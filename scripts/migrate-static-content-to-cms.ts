import { createClient } from '@supabase/supabase-js'

import { contentCmsSeed } from '../src/content/migrations/content-cms-seed'
import { parseServerEnv } from '../src/lib/env/schema'

async function main() {
  const env = parseServerEnv(process.env)
  const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  for (const seed of contentCmsSeed) {
    const articleSubtype = seed.draft.contentType === 'article' ? seed.draft.typeFields.subtype : null
    const { data: existing, error: findError } = await client
      .from('content_items')
      .select('id,version')
      .eq('slug', seed.draft.slug)
      .eq('content_type', seed.draft.contentType)
      .maybeSingle()
    if (findError) throw findError

    const payload = {
      content_type: seed.draft.contentType,
      article_subtype: articleSubtype,
      title: seed.draft.title,
      slug: seed.draft.slug,
      excerpt: seed.draft.excerpt,
      blocks: seed.draft.blocks,
      type_fields: { ...seed.draft.typeFields, migrationKey: seed.migrationKey, publicPath: seed.publicPath },
      seo_title: seed.draft.seoTitle,
      seo_description: seed.draft.seoDescription,
      sort_order: seed.sortOrder,
      status: 'approved',
      updated_at: new Date().toISOString(),
    }

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
