import { describe, expect, it } from 'vitest'

import { canPerformContentAction, transitionContent } from '@/lib/cms/workflow'

describe('CMS workflow permissions', () => {
  it('allows marketing to edit drafts and submit for review', () => {
    expect(canPerformContentAction('marketing', 'draft', 'edit')).toBe(true)
    expect(canPerformContentAction('marketing', 'draft', 'submit_review')).toBe(true)
  })

  it('prevents marketing from publishing or unpublishing', () => {
    expect(canPerformContentAction('marketing', 'approved', 'publish')).toBe(false)
    expect(canPerformContentAction('marketing', 'published', 'unpublish')).toBe(false)
  })

  it('allows editor and super admin to approve and publish', () => {
    expect(canPerformContentAction('editor', 'in_review', 'approve')).toBe(true)
    expect(canPerformContentAction('editor', 'approved', 'publish')).toBe(true)
    expect(canPerformContentAction('super_admin', 'approved', 'schedule')).toBe(true)
  })

  it('locks normal editing while content is under review', () => {
    expect(canPerformContentAction('marketing', 'in_review', 'edit')).toBe(false)
    expect(canPerformContentAction('editor', 'in_review', 'edit')).toBe(false)
  })

  it('does not allow service role into CMS workflows', () => {
    expect(canPerformContentAction('service', 'draft', 'edit')).toBe(false)
    expect(canPerformContentAction('service', 'in_review', 'approve')).toBe(false)
  })

  it('requires a reason when returning content for changes', () => {
    expect(() => transitionContent({ role: 'editor', from: 'in_review', action: 'request_changes' })).toThrow()
    expect(
      transitionContent({ role: 'editor', from: 'in_review', action: 'request_changes', reason: '補上成果來源' }),
    ).toMatchObject({ status: 'changes_requested', reason: '補上成果來源' })
  })

  it('allows marketing to withdraw its review submission', () => {
    expect(transitionContent({ role: 'marketing', from: 'in_review', action: 'withdraw_review' }).status).toBe('draft')
  })

  it('allows only super admin to permanently delete after 30 days in trash', () => {
    const now = new Date('2026-07-31T07:00:00.000Z')
    const oldTrash = new Date('2026-06-30T06:59:59.000Z')
    expect(
      canPerformContentAction('editor', 'trashed', 'permanent_delete', { now, trashedAt: oldTrash }),
    ).toBe(false)
    expect(
      canPerformContentAction('super_admin', 'trashed', 'permanent_delete', { now, trashedAt: oldTrash }),
    ).toBe(true)
  })

  it('blocks permanent deletion before the 30-day retention period', () => {
    const now = new Date('2026-07-31T07:00:00.000Z')
    const recentTrash = new Date('2026-07-15T07:00:00.000Z')
    expect(
      canPerformContentAction('super_admin', 'trashed', 'permanent_delete', { now, trashedAt: recentTrash }),
    ).toBe(false)
  })

  it('supports the approved publish and unpublish lifecycle', () => {
    expect(transitionContent({ role: 'editor', from: 'in_review', action: 'approve' }).status).toBe('approved')
    expect(transitionContent({ role: 'editor', from: 'approved', action: 'schedule' }).status).toBe('scheduled')
    expect(transitionContent({ role: 'editor', from: 'approved', action: 'publish' }).status).toBe('published')
    expect(transitionContent({ role: 'editor', from: 'published', action: 'unpublish' }).status).toBe('unpublished')
  })

  it('rejects invalid status transitions', () => {
    expect(() => transitionContent({ role: 'editor', from: 'draft', action: 'publish' })).toThrow()
    expect(() => transitionContent({ role: 'marketing', from: 'approved', action: 'publish' })).toThrow()
  })
})
