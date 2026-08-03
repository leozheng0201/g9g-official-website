import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/app/admin/content/actions', () => ({
  approveContentAction: vi.fn(),
  createPreviewAction: vi.fn(),
  publishContentAction: vi.fn(),
  requestChangesAction: vi.fn(),
  revokePreviewAction: vi.fn(),
  scheduleContentAction: vi.fn(),
  submitReviewAction: vi.fn(),
  trashContentAction: vi.fn(),
  unpublishContentAction: vi.fn(),
  withdrawReviewAction: vi.fn(),
}))

import { WorkflowPanel } from '@/components/admin/cms/workflow-panel'

describe('WorkflowPanel preview controls', () => {
  it('lets an authorized CMS user revoke active private previews', () => {
    render(<WorkflowPanel id="30000000-0000-4000-8000-000000000201" status="published" role="editor" />)
    expect(screen.getByRole('button', { name: '撤銷有效預覽' })).toBeInTheDocument()
  })
})
