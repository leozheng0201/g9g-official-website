import { createHmac, timingSafeEqual } from 'node:crypto'

const approvedKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'referrer',
  'landing_page',
] as const

type AttributionKey = (typeof approvedKeys)[number]
export type GrowthAuditAttribution = Partial<Record<AttributionKey, string>>

function parseTouch(raw: string): GrowthAuditAttribution {
  if (!raw) return {}

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const source = parsed as Record<string, unknown>
    const result: GrowthAuditAttribution = {}

    for (const key of approvedKeys) {
      const value = source[key]
      if (typeof value !== 'string') continue
      const normalized = value.trim()
      if (!normalized || normalized.length > 500) continue
      result[key] = normalized
    }

    return result
  } catch {
    return {}
  }
}

function signature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function serializeAttributionCookie(
  touch: GrowthAuditAttribution,
  secret: string,
): string {
  if (!secret) throw new Error('attribution secret is required')
  const payload = Buffer.from(JSON.stringify(touch), 'utf8').toString('base64url')
  return `${payload}.${signature(payload, secret)}`
}

function parseSignedTouch(raw: string, secret: string): GrowthAuditAttribution {
  const [payload, providedSignature] = raw.split('.')
  if (!payload || !providedSignature) return {}
  const expectedSignature = signature(payload, secret)
  const provided = Buffer.from(providedSignature)
  const expected = Buffer.from(expectedSignature)
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return {}

  try {
    return parseTouch(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    return {}
  }
}

export function parseAttributionCookies(
  firstTouchCookie: string,
  lastTouchCookie: string,
  secret?: string,
) {
  const resolvedSecret = secret ?? process.env.GROWTH_AUDIT_FINGERPRINT_SECRET
  const parse = resolvedSecret
    ? (raw: string) => parseSignedTouch(raw, resolvedSecret)
    : parseTouch
  return {
    firstTouch: parse(firstTouchCookie),
    lastTouch: parse(lastTouchCookie),
  }
}
