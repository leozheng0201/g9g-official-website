import 'server-only'

import { createServiceRoleSupabaseClient } from '@/lib/supabase/service-role'

export type SchedulerResult = {
  published: number
  unpublished: number
  skipped: number
  failed: number
}

export async function processScheduledContent(now = new Date()): Promise<SchedulerResult> {
  const client = createServiceRoleSupabaseClient()
  const result: SchedulerResult = { published: 0, unpublished: 0, skipped: 0, failed: 0 }
  const nowIso = now.toISOString()

  const { data: duePublish, error: publishReadError } = await client
    .from('content_items')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_publish_at', nowIso)
    .is('deleted_at', null)
  if (publishReadError) throw publishReadError

  for (const item of duePublish ?? []) {
    try {
      const snapshot = { ...item, status: 'published', published_at: nowIso }
      const { data: updated, error: updateError } = await client
        .from('content_items')
        .update({ status: 'published', published_at: nowIso, updated_at: nowIso, version: item.version + 1 })
        .eq('id', item.id)
        .eq('status', 'scheduled')
        .eq('version', item.version)
        .select('id')
        .maybeSingle()
      if (updateError) throw updateError
      if (!updated) {
        result.skipped += 1
        continue
      }
      const { count } = await client.from('content_revisions').select('id', { count: 'exact', head: true }).eq('content_item_id', item.id)
      const { data: revision, error: revisionError } = await client
        .from('content_revisions')
        .insert({ content_item_id: item.id, revision_number: (count ?? 0) + 1, snapshot })
        .select('id')
        .single()
      if (revisionError) throw revisionError
      const { error: publicationError } = await client.from('content_publications').insert({
        content_item_id: item.id,
        revision_id: revision.id,
        snapshot,
        published_at: nowIso,
      })
      if (publicationError) throw publicationError
      await client.from('content_workflow_events').insert({
        content_item_id: item.id,
        event_type: 'scheduled_publish_completed',
        from_status: 'scheduled',
        to_status: 'published',
      })
      result.published += 1
    } catch {
      result.failed += 1
    }
  }

  const { data: dueUnpublish, error: unpublishReadError } = await client
    .from('content_items')
    .select('id,version')
    .eq('status', 'published')
    .lte('scheduled_unpublish_at', nowIso)
    .is('deleted_at', null)
  if (unpublishReadError) throw unpublishReadError

  for (const item of dueUnpublish ?? []) {
    try {
      const { data: updated, error: updateError } = await client
        .from('content_items')
        .update({ status: 'unpublished', updated_at: nowIso, version: item.version + 1 })
        .eq('id', item.id)
        .eq('status', 'published')
        .eq('version', item.version)
        .select('id')
        .maybeSingle()
      if (updateError) throw updateError
      if (!updated) {
        result.skipped += 1
        continue
      }
      await client.from('content_publications').update({ unpublished_at: nowIso }).eq('content_item_id', item.id).is('unpublished_at', null)
      await client.from('content_workflow_events').insert({
        content_item_id: item.id,
        event_type: 'scheduled_unpublish_completed',
        from_status: 'published',
        to_status: 'unpublished',
      })
      result.unpublished += 1
    } catch {
      result.failed += 1
    }
  }

  return result
}
