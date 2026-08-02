import 'server-only'

import { createHash } from 'node:crypto'

import { createServiceRoleSupabaseClient } from '@/lib/supabase/service-role'

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
const documentTypes = new Set(['application/pdf'])
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024

export type MediaUploadInput = {
  filename: string
  mimeType: string
  size: number
  bytes: ArrayBuffer
  altText?: string
}

export function validateMediaUpload(input: Omit<MediaUploadInput, 'bytes'>) {
  const isImage = imageTypes.has(input.mimeType)
  const isDocument = documentTypes.has(input.mimeType)
  if (!isImage && !isDocument) throw new Error('僅支援 JPG、PNG、WebP、GIF、SVG 與 PDF。')
  if (input.size <= 0) throw new Error('檔案不可為空。')
  if (isImage && input.size > MAX_IMAGE_BYTES) throw new Error('圖片不可超過 10MB。')
  if (isDocument && input.size > MAX_DOCUMENT_BYTES) throw new Error('文件不可超過 25MB。')
  if (isImage && !input.altText?.trim()) throw new Error('圖片必須填寫替代文字。')
  return { isImage, maxBytes: isImage ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES }
}

function safeFilename(filename: string) {
  const extension = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : undefined
  const stem = filename.replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'asset'
  return extension ? `${stem}.${extension}` : stem
}

export async function createMediaAsset(input: MediaUploadInput, actorId: string) {
  validateMediaUpload(input)
  const client = createServiceRoleSupabaseClient()
  const checksum = createHash('sha256').update(Buffer.from(input.bytes)).digest('hex')
  const { data: existing } = await client.from('media_assets').select('*').eq('checksum', checksum).is('deleted_at', null).maybeSingle()
  if (existing) return existing

  const storagePath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeFilename(input.filename)}`
  const { error: uploadError } = await client.storage.from('content-media').upload(storagePath, input.bytes, {
    contentType: input.mimeType,
    upsert: false,
  })
  if (uploadError) throw uploadError
  const { data, error } = await client
    .from('media_assets')
    .insert({
      storage_path: storagePath,
      original_filename: input.filename,
      mime_type: input.mimeType,
      file_size: input.size,
      checksum,
      alt_text: input.altText?.trim() || null,
      created_by: actorId,
    })
    .select('*')
    .single()
  if (error) {
    await client.storage.from('content-media').remove([storagePath])
    throw error
  }
  return data
}

export async function updateMediaMetadata(id: string, input: { altText?: string; title?: string; description?: string }) {
  const client = createServiceRoleSupabaseClient()
  const { data, error } = await client
    .from('media_assets')
    .update({
      alt_text: input.altText?.trim() || null,
      title: input.title?.trim() || null,
      description: input.description?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function listMediaUsage(mediaAssetId: string) {
  const client = createServiceRoleSupabaseClient()
  const { data, error } = await client
    .from('media_usages')
    .select('id,content_item_id,usage_role,block_id,created_at')
    .eq('media_asset_id', mediaAssetId)
  if (error) throw error
  return data ?? []
}

export async function deleteMediaAsset(id: string) {
  const client = createServiceRoleSupabaseClient()
  const usages = await listMediaUsage(id)
  if (usages.length > 0) throw new Error('此素材仍被內容使用，請先移除引用。')
  const { data: asset, error: readError } = await client.from('media_assets').select('storage_bucket,storage_path').eq('id', id).single()
  if (readError) throw readError
  const { error } = await client.from('media_assets').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
  await client.storage.from(asset.storage_bucket).remove([asset.storage_path])
}
