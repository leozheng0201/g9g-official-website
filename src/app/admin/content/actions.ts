'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireCmsUser, requireContentPublisher, requireSuperAdmin } from '@/lib/cms/auth'
import { createPreviewToken } from '@/lib/cms/preview-tokens'
import {
  createContentDraft,
  getContentItem,
  moveContentToTrash,
  permanentlyDeleteContent,
  publishContent,
  restoreContent,
  setContentStatus,
  unpublishContent,
  updateContentDraft,
} from '@/lib/cms/repository'
import { parseContentDraft } from '@/lib/cms/schemas'
import { transitionContent } from '@/lib/cms/workflow'
import type { ContentStatus, ContentType } from '@/lib/cms/types'

function string(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function draftFromForm(formData: FormData) {
  const contentType = string(formData, 'contentType') as ContentType
  return parseContentDraft({
    contentType,
    title: string(formData, 'title'),
    slug: string(formData, 'slug'),
    excerpt: string(formData, 'excerpt'),
    blocks: JSON.parse(string(formData, 'blocks') || '[]'),
    typeFields: JSON.parse(string(formData, 'typeFields') || '{}'),
    seoTitle: string(formData, 'seoTitle'),
    seoDescription: string(formData, 'seoDescription'),
  })
}

export async function saveContentAction(formData: FormData) {
  const { user } = await requireCmsUser()
  const draft = draftFromForm(formData)
  const id = string(formData, 'id')
  if (!id) {
    const created = await createContentDraft(draft, user.id)
    redirect(`/admin/content/${created.content_type}/${created.id}`)
  }
  await updateContentDraft(id, draft, Number(string(formData, 'version')), user.id)
  revalidatePath(`/admin/content/${draft.contentType}/${id}`)
}

async function transitionAction(formData: FormData, action: Parameters<typeof transitionContent>[0]['action']) {
  const allowed = ['approve', 'request_changes', 'schedule', 'publish', 'unpublish'] as const
  const auth = allowed.includes(action as (typeof allowed)[number]) ? await requireContentPublisher() : await requireCmsUser()
  const id = string(formData, 'id')
  const item = await getContentItem(id)
  if (!item) throw new Error('找不到內容。')
  const reason = string(formData, 'reason') || undefined
  const transition = transitionContent({ role: auth.role, from: item.status as ContentStatus, action, reason })
  await setContentStatus({
    id,
    from: item.status as ContentStatus,
    to: transition.status,
    eventType: action,
    actorId: auth.user.id,
    reason,
    expectedVersion: item.version,
    scheduledPublishAt: action === 'schedule' ? string(formData, 'scheduledPublishAt') : undefined,
    scheduledUnpublishAt: action === 'schedule' ? string(formData, 'scheduledUnpublishAt') || null : undefined,
  })
  revalidatePath('/admin/content')
  revalidatePath(`/admin/content/${item.content_type}/${id}`)
}

export async function submitReviewAction(formData: FormData) {
  return transitionAction(formData, 'submit_review')
}

export async function withdrawReviewAction(formData: FormData) {
  return transitionAction(formData, 'withdraw_review')
}

export async function approveContentAction(formData: FormData) {
  return transitionAction(formData, 'approve')
}

export async function requestChangesAction(formData: FormData) {
  return transitionAction(formData, 'request_changes')
}

export async function scheduleContentAction(formData: FormData) {
  return transitionAction(formData, 'schedule')
}

export async function publishContentAction(formData: FormData) {
  const { user } = await requireContentPublisher()
  const id = string(formData, 'id')
  const item = await getContentItem(id)
  if (!item) throw new Error('找不到內容。')
  await publishContent(id, item.version, user.id)
  revalidatePath('/admin/content')
}

export async function unpublishContentAction(formData: FormData) {
  const { user } = await requireContentPublisher()
  const id = string(formData, 'id')
  const item = await getContentItem(id)
  if (!item) throw new Error('找不到內容。')
  await unpublishContent(id, item.version, user.id)
  revalidatePath('/admin/content')
}

export async function trashContentAction(formData: FormData) {
  const { user } = await requireCmsUser(['super_admin', 'editor'])
  const id = string(formData, 'id')
  const item = await getContentItem(id)
  if (!item) throw new Error('找不到內容。')
  await moveContentToTrash(id, item.status as ContentStatus, item.version, user.id)
  revalidatePath('/admin/content')
}

export async function restoreContentAction(formData: FormData) {
  const { user } = await requireCmsUser(['super_admin', 'editor'])
  const id = string(formData, 'id')
  const item = await getContentItem(id)
  if (!item) throw new Error('找不到內容。')
  await restoreContent(id, item.version, user.id)
  revalidatePath('/admin/content/trash')
}

export async function permanentlyDeleteContentAction(formData: FormData) {
  await requireSuperAdmin()
  await permanentlyDeleteContent(string(formData, 'id'))
  revalidatePath('/admin/content/trash')
}

export async function createPreviewAction(formData: FormData) {
  const { user } = await requireCmsUser()
  const { token } = await createPreviewToken({ contentItemId: string(formData, 'id'), actorId: user.id, expiresInMinutes: 60 })
  redirect(`/preview/content/${token}`)
}
