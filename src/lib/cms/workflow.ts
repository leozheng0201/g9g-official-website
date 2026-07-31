import type { ContentStatus } from '@/lib/cms/types'

export type CmsRole = 'super_admin' | 'editor' | 'marketing' | 'service'

export type ContentAction =
  | 'edit'
  | 'submit_review'
  | 'withdraw_review'
  | 'request_changes'
  | 'approve'
  | 'schedule'
  | 'publish'
  | 'unpublish'
  | 'trash'
  | 'restore'
  | 'permanent_delete'

export interface ContentActionContext {
  now?: Date
  trashedAt?: Date
}

export interface TransitionInput {
  role: CmsRole
  from: ContentStatus
  action: ContentAction
  reason?: string
}

export interface TransitionResult {
  status: ContentStatus
  reason?: string
}

const editorRoles = new Set<CmsRole>(['super_admin', 'editor'])
const cmsRoles = new Set<CmsRole>(['super_admin', 'editor', 'marketing'])

const transitions: Partial<Record<ContentStatus, Partial<Record<ContentAction, ContentStatus>>>> = {
  draft: {
    submit_review: 'in_review',
    trash: 'trashed',
  },
  in_review: {
    withdraw_review: 'draft',
    request_changes: 'changes_requested',
    approve: 'approved',
    trash: 'trashed',
  },
  changes_requested: {
    submit_review: 'in_review',
    trash: 'trashed',
  },
  approved: {
    schedule: 'scheduled',
    publish: 'published',
    trash: 'trashed',
  },
  scheduled: {
    publish: 'published',
    unpublish: 'unpublished',
    trash: 'trashed',
  },
  published: {
    unpublish: 'unpublished',
    trash: 'trashed',
  },
  unpublished: {
    submit_review: 'in_review',
    trash: 'trashed',
  },
  trashed: {
    restore: 'draft',
  },
}

function hasThirtyDayRetentionElapsed(now: Date, trashedAt: Date): boolean {
  const retentionMs = 30 * 24 * 60 * 60 * 1000
  return now.getTime() - trashedAt.getTime() >= retentionMs
}

export function canPerformContentAction(
  role: CmsRole,
  status: ContentStatus,
  action: ContentAction,
  context: ContentActionContext = {},
): boolean {
  if (!cmsRoles.has(role)) return false

  if (action === 'edit') {
    return status === 'draft' || status === 'changes_requested' || status === 'unpublished'
  }

  if (action === 'submit_review') {
    return (role === 'marketing' || editorRoles.has(role)) && (status === 'draft' || status === 'changes_requested' || status === 'unpublished')
  }

  if (action === 'withdraw_review') {
    return status === 'in_review' && (role === 'marketing' || editorRoles.has(role))
  }

  if (action === 'request_changes' || action === 'approve') {
    return status === 'in_review' && editorRoles.has(role)
  }

  if (action === 'schedule' || action === 'publish') {
    return status === 'approved' && editorRoles.has(role)
  }

  if (action === 'unpublish') {
    return (status === 'published' || status === 'scheduled') && editorRoles.has(role)
  }

  if (action === 'trash') {
    return role === 'super_admin' || role === 'editor'
  }

  if (action === 'restore') {
    return status === 'trashed' && (role === 'super_admin' || role === 'editor')
  }

  if (action === 'permanent_delete') {
    if (role !== 'super_admin' || status !== 'trashed' || !context.now || !context.trashedAt) return false
    return hasThirtyDayRetentionElapsed(context.now, context.trashedAt)
  }

  return false
}

export function transitionContent(input: TransitionInput): TransitionResult {
  if (!canPerformContentAction(input.role, input.from, input.action)) {
    throw new Error('不允許的內容狀態轉換')
  }

  if (input.action === 'request_changes') {
    const reason = input.reason?.trim()
    if (!reason) throw new Error('退回修改時必須填寫原因')
    return { status: 'changes_requested', reason }
  }

  const status = transitions[input.from]?.[input.action]
  if (!status) throw new Error('不允許的內容狀態轉換')

  return { status }
}
