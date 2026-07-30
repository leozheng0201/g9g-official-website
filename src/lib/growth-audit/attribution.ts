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

export function parseAttributionCookies(firstTouchCookie: string, lastTouchCookie: string) {
  return {
    firstTouch: parseTouch(firstTouchCookie),
    lastTouch: parseTouch(lastTouchCookie),
  }
}
