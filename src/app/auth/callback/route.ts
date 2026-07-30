import { type NextRequest, NextResponse } from 'next/server'
import { safeNextPath } from '@/lib/auth/redirects'
import { createServerSupabaseClient } from '@/lib/supabase/server'

function loginFailureUrl(request: NextRequest, next: string): URL {
  const url = new URL('/admin/login', request.url)
  url.searchParams.set('error', 'login_failed')
  url.searchParams.set('next', next)
  return url
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const code = request.nextUrl.searchParams.get('code')
  const next = safeNextPath(request.nextUrl.searchParams.get('next'))

  if (!code) {
    return NextResponse.redirect(loginFailureUrl(request, next))
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(loginFailureUrl(request, next))
  }

  return NextResponse.redirect(new URL(next, request.url))
}
