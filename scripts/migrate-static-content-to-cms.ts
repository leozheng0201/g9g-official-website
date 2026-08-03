import { createClient } from '@supabase/supabase-js'

import {
  buildMigratedContentPayload,
  contentCmsSeed,
} from '../src/content/migrations/content-cms-seed'
import { parseServerEnv } from '../src/lib/env/schema'

async function main() {
  const env = parseServerEnv(process.env)
  const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  for (const seed of contentCmsSeed) {
    const { data: existing, error: findError } = await client
      .from('content_items')
      .select('id,version')
      .eq('slug', seed.draft.slug)
      .eq('content_type', seed.draft.contentType)
      .maybeSingle()
    if (findError) throw findError

    const payload = buildMigratedContentPayload(seed, new Date().toISOString())

    if (existing) {
      const { error } = await client.from('content_items').update({ ...payload, version: existing.version + 1 }).eq('id', existing.id)
      if (error) throw error
      process.stdout.write(`updated ${seed.migrationKey}\n`)
    } else {
      const { error } = await client.from('content_items').insert({ ...payload, version: 1 })
      if (error) throw error
      process.stdout.write(`created ${seed.migrationKey}\n`)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
