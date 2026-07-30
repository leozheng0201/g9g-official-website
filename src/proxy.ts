import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import { applyAttributionCookies } from '@/proxy/attribution'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const needsSession = pathname.startsWith('/admin') || pathname.startsWith('/auth/callback')
  const response = needsSession
    ? await updateSession(request)
    : NextResponse.next({ request })

  return applyAttributionCookies(request, response)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
