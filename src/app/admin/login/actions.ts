'use server'

import { redirect } from 'next/navigation'
import { publicEnv } from '@/lib/env/public'
import { safeNextPath } from '@/lib/auth/redirects'
import { createServerSupabaseClient } from '@/lib/supabase/server'

function loginErrorPath(next: string): string {
  const params = new URLSearchParams({
    error: 'login_failed',
    next,
  })

  return `/admin/login?${params.toString()}`
}

export async function signInWithPasswordAction(formData: FormData): Promise<never> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNextPath(formData.get('next'))

  if (!email || !password) {
    redirect(loginErrorPath(next))
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(loginErrorPath(next))
  }

  redirect(next)
}

export async function signInWithGoogleAction(formData: FormData): Promise<never> {
  const next = safeNextPath(formData.get('next'))
  const env = publicEnv()
  const callbackUrl = new URL('/auth/callback', env.NEXT_PUBLIC_SITE_URL)
  callbackUrl.searchParams.set('next', next)

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl.toString(),
    },
  })

  if (error || !data.url) {
    redirect(loginErrorPath(next))
  }

  redirect(data.url)
}
