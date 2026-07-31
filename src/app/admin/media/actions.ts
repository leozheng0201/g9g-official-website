'use server'

import { revalidatePath } from 'next/cache'

import { requireCmsUser } from '@/lib/cms/auth'
import { createMediaAsset, deleteMediaAsset, updateMediaMetadata } from '@/lib/cms/media'

export async function uploadMediaAction(formData: FormData) {
  const { user } = await requireCmsUser()
  const file = formData.get('file')
  if (!(file instanceof File)) throw new Error('請選擇檔案。')
  await createMediaAsset({
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    bytes: await file.arrayBuffer(),
    altText: String(formData.get('altText') ?? ''),
  }, user.id)
  revalidatePath('/admin/media')
}

export async function updateMediaAction(formData: FormData) {
  await requireCmsUser()
  await updateMediaMetadata(String(formData.get('id') ?? ''), {
    altText: String(formData.get('altText') ?? ''),
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
  })
  revalidatePath('/admin/media')
}

export async function deleteMediaAction(formData: FormData) {
  await requireCmsUser(['super_admin', 'editor'])
  await deleteMediaAsset(String(formData.get('id') ?? ''))
  revalidatePath('/admin/media')
}
