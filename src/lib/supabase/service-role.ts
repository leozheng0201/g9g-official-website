import 'server-only'

import { createClient } from '@supabase/supabase-js'

import { parseServiceRoleEnv, type ServiceRoleEnv } from '@/lib/env/schema'

let cached: ServiceRoleEnv | undefined

function serviceRoleEnv(): ServiceRoleEnv {
  cached ??= parseServiceRoleEnv(process.env)
  return cached
}

export function createServiceRoleSupabaseClient() {
  const env = serviceRoleEnv()
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
