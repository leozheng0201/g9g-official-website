import { createClient, type User } from '@supabase/supabase-js'
import { APP_ROLES, type AppRole } from '../src/lib/auth/roles'
import { parseServerEnv } from '../src/lib/env/schema'

function readArguments(args: string[]): { email: string; role: AppRole } {
  if (args.length !== 4) {
    throw new Error('Usage: npm run admin:grant -- --email <email> --role <role>')
  }

  const values = new Map<string, string>()
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index]
    const value = args[index + 1]
    if (!flag || !value || !['--email', '--role'].includes(flag)) {
      throw new Error('Only --email and --role are accepted.')
    }
    values.set(flag, value)
  }

  const email = values.get('--email')?.trim().toLowerCase()
  const role = values.get('--role')

  if (!email || !role || !APP_ROLES.includes(role as AppRole)) {
    throw new Error('A valid email and role are required.')
  }

  return { email, role: role as AppRole }
}

async function main(): Promise<void> {
  const { email, role } = readArguments(process.argv.slice(2))
  const env = parseServerEnv(process.env)
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )

  const perPage = 1000
  let user: User | null = null

  for (let page = 1; page <= 100; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) {
      throw error
    }

    user = data.users.find((candidate) => candidate.email?.toLowerCase() === email) ?? null
    if (user || data.users.length < perPage) {
      break
    }
  }

  if (!user) {
    throw new Error('User not found. Ask the user to sign in once before granting a role.')
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email ?? email,
    display_name: user.user_metadata?.full_name ?? null,
    updated_at: new Date().toISOString(),
  })
  if (profileError) {
    throw profileError
  }

  const { data: roleRow, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('key', role)
    .single()
  if (roleError) {
    throw roleError
  }

  const { error: grantError } = await supabase.from('profile_roles').upsert({
    profile_id: user.id,
    role_id: roleRow.id,
  })
  if (grantError) {
    throw grantError
  }

  const { error: auditError } = await supabase.from('audit_events').insert({
    event_type: 'role.granted',
    entity_type: 'profile',
    entity_id: user.id,
    metadata: {
      target_email: email,
      role,
      source: 'cli-bootstrap',
    },
  })
  if (auditError) {
    throw auditError
  }

  console.log(`Granted ${role} to ${email}`)
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(message)
  process.exitCode = 1
})
