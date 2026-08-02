import 'server-only'

import { createServiceRoleSupabaseClient } from '@/lib/supabase/service-role'
import type { ContentType } from '@/lib/cms/types'

export type PublishedContent = {
  id: string
  contentType: ContentType
  articleSubtype: 'insight' | 'line_gift_academy' | null
  title: string
  slug: string
  excerpt: string | null
  blocks: unknown[]
  typeFields: Record<string, unknown>
  seoTitle: string | null
  seoDescription: string | null
  canonicalUrl: string | null
  publishedAt: string
  snapshot: Record<string, unknown>
}

function mapPublication(row: { snapshot: Record<string, unknown>; published_at: string }): PublishedContent {
  const snapshot = row.snapshot
  return {
    id: String(snapshot.id),
    contentType: snapshot.content_type as ContentType,
    articleSubtype: (snapshot.article_subtype as PublishedContent['articleSubtype']) ?? null,
    title: String(snapshot.title),
    slug: String(snapshot.slug),
    excerpt: typeof snapshot.excerpt === 'string' ? snapshot.excerpt : null,
    blocks: Array.isArray(snapshot.blocks) ? snapshot.blocks : [],
    typeFields: typeof snapshot.type_fields === 'object' && snapshot.type_fields ? (snapshot.type_fields as Record<string, unknown>) : {},
    seoTitle: typeof snapshot.seo_title === 'string' ? snapshot.seo_title : null,
    seoDescription: typeof snapshot.seo_description === 'string' ? snapshot.seo_description : null,
    canonicalUrl: typeof snapshot.canonical_url === 'string' ? snapshot.canonical_url : null,
    publishedAt: row.published_at,
    snapshot,
  }
}

export async function getPublishedContentBySlug(input: {
  contentType: ContentType
  slug: string
  articleSubtype?: 'insight' | 'line_gift_academy'
}) {
  const client = createServiceRoleSupabaseClient()
  let query = client
    .from('content_publications')
    .select('snapshot,published_at')
    .is('unpublished_at', null)
    .contains('snapshot', { content_type: input.contentType, slug: input.slug, status: 'published' })
    .order('published_at', { ascending: false })
    .limit(1)
  if (input.articleSubtype) query = query.contains('snapshot', { article_subtype: input.articleSubtype })
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  return data ? mapPublication(data as { snapshot: Record<string, unknown>; published_at: string }) : null
}

export async function listPublishedContent(input: {
  contentType: ContentType
  articleSubtype?: 'insight' | 'line_gift_academy'
  limit?: number
}) {
  const client = createServiceRoleSupabaseClient()
  let query = client
    .from('content_publications')
    .select('snapshot,published_at')
    .is('unpublished_at', null)
    .contains('snapshot', { content_type: input.contentType, status: 'published' })
    .order('published_at', { ascending: false })
    .limit(Math.min(Math.max(input.limit ?? 100, 1), 200))
  if (input.articleSubtype) query = query.contains('snapshot', { article_subtype: input.articleSubtype })
  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map((row) => mapPublication(row as { snapshot: Record<string, unknown>; published_at: string }))
}

export async function listPublishedSitemapEntries() {
  const client = createServiceRoleSupabaseClient()
  const { data, error } = await client.from('content_publications').select('snapshot,published_at').is('unpublished_at', null)
  if (error) throw error
  return (data ?? [])
    .map((row) => mapPublication(row as { snapshot: Record<string, unknown>; published_at: string }))
    .filter((item) => item.snapshot.status === 'published')
}
