import { describe, expect, it } from 'vitest'

import {
  buildMigratedContentPayload,
  contentCmsSeed,
} from '@/content/migrations/content-cms-seed'
import { parseContentDraft } from '@/lib/cms/schemas'

describe('static content CMS migration payload', () => {
  it('stores only fields accepted by the strict CMS schema', () => {
    for (const seed of contentCmsSeed) {
      expect(parseContentDraft(seed.draft)).toEqual(seed.draft)
      const payload = buildMigratedContentPayload(seed, '2026-08-03T00:00:00.000Z')
      expect(payload.type_fields).toEqual(seed.draft.typeFields)
      expect(payload.type_fields).not.toHaveProperty('migrationKey')
    }
  })
})
