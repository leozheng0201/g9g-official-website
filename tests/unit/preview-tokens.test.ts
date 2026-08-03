import { describe, expect, it, vi } from 'vitest'

const clientState = vi.hoisted(() => {
  const chain = {
    update: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
  }
  chain.update.mockReturnValue(chain)
  chain.eq.mockReturnValue(chain)
  chain.is.mockResolvedValue({ error: null })
  return { chain, from: vi.fn(() => chain) }
})

vi.mock('@/lib/supabase/service-role', () => ({
  createServiceRoleSupabaseClient: () => ({ from: clientState.from }),
}))

import { revokePreviewTokensForContentItem } from '@/lib/cms/preview-tokens'

describe('preview token revocation', () => {
  it('revokes every active token for exactly one content item', async () => {
    await revokePreviewTokensForContentItem('30000000-0000-4000-8000-000000000201')

    expect(clientState.from).toHaveBeenCalledWith('preview_tokens')
    expect(clientState.chain.update).toHaveBeenCalledWith({
      revoked_at: expect.any(String),
    })
    expect(clientState.chain.eq).toHaveBeenCalledWith(
      'content_item_id',
      '30000000-0000-4000-8000-000000000201',
    )
    expect(clientState.chain.is).toHaveBeenCalledWith('revoked_at', null)
  })
})
