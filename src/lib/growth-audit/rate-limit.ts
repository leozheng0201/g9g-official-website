export type GrowthAuditRateLimitReason = 'duplicate' | 'fingerprint' | 'email'

export type GrowthAuditRateLimitInput = {
  now: Date
  fingerprint: string
  emailHash: string
  duplicateKey: string
}

export type RecentGrowthAuditSubmission = {
  createdAt: Date
  fingerprint: string
  emailHash: string
  duplicateKey: string
}

export type GrowthAuditRateLimitRepository = {
  findRecent: (since: Date) => Promise<RecentGrowthAuditSubmission[]>
}

export type GrowthAuditRateLimitResult =
  | {
      allowed: true
      reason?: never
      retryAfterSeconds?: never
    }
  | {
      allowed: false
      reason: GrowthAuditRateLimitReason
      retryAfterSeconds: number
    }

const duplicateWindowMs = 10 * 60_000
const requestWindowMs = 24 * 60 * 60_000
const fingerprintLimit = 3
const emailLimit = 2

function retryAfterSeconds(now: Date, oldest: Date, windowMs: number): number {
  return Math.max(1, Math.ceil((oldest.getTime() + windowMs - now.getTime()) / 1000))
}

export async function checkGrowthAuditRateLimit(
  input: GrowthAuditRateLimitInput,
  repository: GrowthAuditRateLimitRepository,
): Promise<GrowthAuditRateLimitResult> {
  const since = new Date(input.now.getTime() - requestWindowMs)
  const rows = (await repository.findRecent(since)).filter(
    (row) => row.createdAt.getTime() >= since.getTime(),
  )

  const duplicate = rows
    .filter(
      (row) =>
        row.duplicateKey === input.duplicateKey &&
        input.now.getTime() - row.createdAt.getTime() <= duplicateWindowMs,
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  if (duplicate.length > 0) {
    return {
      allowed: false,
      reason: 'duplicate',
      retryAfterSeconds: retryAfterSeconds(input.now, duplicate[0].createdAt, duplicateWindowMs),
    }
  }

  const fingerprintRows = rows
    .filter((row) => row.fingerprint === input.fingerprint)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  if (fingerprintRows.length >= fingerprintLimit) {
    return {
      allowed: false,
      reason: 'fingerprint',
      retryAfterSeconds: retryAfterSeconds(
        input.now,
        fingerprintRows[0].createdAt,
        requestWindowMs,
      ),
    }
  }

  const emailRows = rows
    .filter((row) => row.emailHash === input.emailHash)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  if (emailRows.length >= emailLimit) {
    return {
      allowed: false,
      reason: 'email',
      retryAfterSeconds: retryAfterSeconds(input.now, emailRows[0].createdAt, requestWindowMs),
    }
  }

  return { allowed: true }
}
