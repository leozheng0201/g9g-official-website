import 'server-only'

import { createServiceRoleSupabaseClient } from '@/lib/supabase/service-role'
import { parseContentDraft } from '@/lib/cms/schemas'
import type { ContentDraftInput, ContentStatus, ContentType } from '@/lib/cms/types'

export class ContentConflictError extends Error {
  constructor() {
    super('內容已被其他使用者更新，請重新整理後再試。')
  }
}

export type ContentListFilters = {
  contentType?: ContentType
  articleSubtype?: 'insight' | 'line_gift_academy'
  status?: ContentStatus
  query?: string
  includeTrashed?: boolean
  page?: number
  pageSize?: number
}

export async function listContentItems(filters: ContentListFilters = {}) {
  const client = createServiceRoleSupabaseClient()
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100)
  const page = Math.max(filters.page ?? 1, 1)
  let query = client
    .from('content_items')
    .select('id,content_type,article_subtype,title,slug,excerpt,status,sort_order,version,published_at,scheduled_publish_at,scheduled_unpublish_at,deleted_at,updated_at', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (filters.contentType) query = query.eq('content_type', filters.contentType)
  if (filters.articleSubtype) query = query.eq('article_subtype', filters.articleSubtype)
  if (filters.status) query = query.eq('status', filters.status)
  if (!filters.includeTrashed) query = query.is('deleted_at', null)
  if (filters.query?.trim()) query = query.ilike('title', `%${filters.query.trim()}%`)

  const { data, error, count } = await query
  if (error) throw error
  return { items: data ?? [], total: count ?? 0, page, pageSize }
}

export async function getContentItem(id: string) {
  const client = createServiceRoleSupabaseClient()
  const [{ data: item, error }, { data: events }, { data: revisions }] = await Promise.all([
    client.from('content_items').select('*').eq('id', id).maybeSingle(),
    client.from('content_workflow_events').select('*').eq('content_item_id', id).order('created_at', { ascending: false }),
    client.from('content_revisions').select('id,revision_number,created_by,created_at').eq('content_item_id', id).order('revision_number', { ascending: false }),
  ])
  if (error) throw error
  return item ? { ...item, events: events ?? [], revisions: revisions ?? [] } : null
}

export async function createContentDraft(input: ContentDraftInput, actorId: string) {
  const draft = parseContentDraft(input)
  const client = createServiceRoleSupabaseClient()
  const articleSubtype = draft.contentType === 'article' ? draft.typeFields.subtype : null
  const { data, error } = await client
    .from('content_items')
    .insert({
      content_type: draft.contentType,
      article_subtype: articleSubtype,
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      blocks: draft.blocks,
      type_fields: draft.typeFields,
      seo_title: draft.seoTitle,
      seo_description: draft.seoDescription,
      status: 'draft',
      created_by: actorId,
      updated_by: actorId,
    })
    .select('*')
    .single()
  if (error) throw error
  await client.from('content_workflow_events').insert({ content_item_id: data.id, actor_id: actorId, event_type: 'created', to_status: 'draft' })
  return data
}

export async function updateContentDraft(id: string, input: ContentDraftInput, expectedVersion: number, actorId: string) {
  const draft = parseContentDraft(input)
  const client = createServiceRoleSupabaseClient()
  const articleSubtype = draft.contentType === 'article' ? draft.typeFields.subtype : null
  const { data, error } = await client
    .from('content_items')
    .update({
      content_type: draft.contentType,
      article_subtype: articleSubtype,
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      blocks: draft.blocks,
      type_fields: draft.typeFields,
      seo_title: draft.seoTitle,
      seo_description: draft.seoDescription,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
      version: expectedVersion + 1,
    })
    .eq('id', id)
    .eq('version', expectedVersion)
    .in('status', ['draft', 'changes_requested', 'approved', 'unpublished'])
    .select('*')
    .maybeSingle()
  if (error) throw error
  if (!data) throw new ContentConflictError()
  return data
}

export async function setContentStatus(input: {
  id: string
  from: ContentStatus
  to: ContentStatus
  eventType: string
  actorId: string
  reason?: string
  expectedVersion: number
  scheduledPublishAt?: string | null
  scheduledUnpublishAt?: string | null
}) {
  const client = createServiceRoleSupabaseClient()
  const now = new Date().toISOString()
  const update: Record<string, unknown> = {
    status: input.to,
    updated_by: input.actorId,
    updated_at: now,
    version: input.expectedVersion + 1,
  }
  if (input.to === 'trashed') update.deleted_at = now
  if (input.from === 'trashed' && input.to !== 'trashed') update.deleted_at = null
  if (input.scheduledPublishAt !== undefined) update.scheduled_publish_at = input.scheduledPublishAt
  if (input.scheduledUnpublishAt !== undefined) update.scheduled_unpublish_at = input.scheduledUnpublishAt
  if (input.to === 'published') update.published_at = now

  const { data, error } = await client
    .from('content_items')
    .update(update)
    .eq('id', input.id)
    .eq('status', input.from)
    .eq('version', input.expectedVersion)
    .select('*')
    .maybeSingle()
  if (error) throw error
  if (!data) throw new ContentConflictError()
  await client.from('content_workflow_events').insert({
    content_item_id: input.id,
    actor_id: input.actorId,
    event_type: input.eventType,
    from_status: input.from,
    to_status: input.to,
    reason: input.reason ?? null,
  })
  return data
}

export async function publishContent(id: string, expectedVersion: number, actorId: string) {
  const client = createServiceRoleSupabaseClient()
  const { data: item, error } = await client.from('content_items').select('*').eq('id', id).eq('version', expectedVersion).maybeSingle()
  if (error) throw error
  if (!item) throw new ContentConflictError()
  if (!['approved', 'scheduled'].includes(item.status)) throw new Error('只有已核准或已排程內容可以發布。')

  const snapshot = { ...item, status: 'published', published_at: new Date().toISOString() }
  const { count } = await client.from('content_revisions').select('id', { count: 'exact', head: true }).eq('content_item_id', id)
  const { data: revision, error: revisionError } = await client
    .from('content_revisions')
    .insert({ content_item_id: id, revision_number: (count ?? 0) + 1, snapshot, created_by: actorId })
    .select('id')
    .single()
  if (revisionError) throw revisionError
  const { error: publicationError } = await client.from('content_publications').insert({
    content_item_id: id,
    revision_id: revision.id,
    snapshot,
    published_by: actorId,
  })
  if (publicationError) throw publicationError
  return setContentStatus({ id, from: item.status, to: 'published', eventType: 'published', actorId, expectedVersion })
}

export async function unpublishContent(id: string, expectedVersion: number, actorId: string) {
  const client = createServiceRoleSupabaseClient()
  const result = await setContentStatus({ id, from: 'published', to: 'unpublished', eventType: 'unpublished', actorId, expectedVersion })
  await client.from('content_publications').update({ unpublished_at: new Date().toISOString() }).eq('content_item_id', id).is('unpublished_at', null)
  return result
}

export const moveContentToTrash = (id: string, from: ContentStatus, expectedVersion: number, actorId: string) =>
  setContentStatus({ id, from, to: 'trashed', eventType: 'trashed', actorId, expectedVersion })

export const restoreContent = (id: string, expectedVersion: number, actorId: string) =>
  setContentStatus({ id, from: 'trashed', to: 'draft', eventType: 'restored', actorId, expectedVersion })

export async function permanentlyDeleteContent(id: string) {
  const client = createServiceRoleSupabaseClient()
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { error } = await client.from('content_items').delete().eq('id', id).eq('status', 'trashed').lt('deleted_at', cutoff)
  if (error) throw error
}
