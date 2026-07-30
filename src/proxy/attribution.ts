import type { NextRequest, NextResponse } from 'next/server'
import { serializeAttributionCookie, type GrowthAuditAttribution } from '@/lib/growth-audit/attribution'

const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
const cookieMaxAge = 60 * 60 * 24 * 90

function isEligibleRequest(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname
  if (request.method !== 'GET') return false
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return false
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) return false
  return !/\.(?:ico|png|jpg|jpeg|svg|webp|css|js|map|txt|xml)$/i.test(pathname)
}

function buildTouch(request: NextRequest): GrowthAuditAttribution {
  const touch: GrowthAuditAttribution = {}
  const landingSearch = new URLSearchParams()

  for (const key of utmKeys) {
    const value = request.nextUrl.searchParams.get(key)?.trim()
    if (!value || value.length > 500) continue
    touch[key] = value
    landingSearch.set(key, value)
  }

  const referrer = request.headers.get('referer')?.trim()
  if (referrer && referrer.length <= 500) touch.referrer = referrer
  const query = landingSearch.toString()
  touch.landing_page = `${request.nextUrl.pathname}${query ? `?${query}` : ''}`
  return touch
}

export function applyAttributionCookies(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  const secret = process.env.GROWTH_AUDIT_FINGERPRINT_SECRET
  if (!secret || !isEligibleRequest(request)) return response

  const value = serializeAttributionCookie(buildTouch(request), secret)
  const options = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: cookieMaxAge,
  }

  if (!request.cookies.get('g9g_first_touch')) {
    response.cookies.set('g9g_first_touch', value, options)
  }
  response.cookies.set('g9g_last_touch', value, options)
  return response
}
