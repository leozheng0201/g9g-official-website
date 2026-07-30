import type { GrowthAuditEventInput, GrowthAuditApplicationInput, StoredGrowthAuditApplication } from '@/lib/growth-audit/repository'
import { growthAuditSubmissionSchema, normalizeGrowthAuditSubmission } from '@/lib/growth-audit/schema'
import type { GrowthAuditRateLimitResult } from '@/lib/growth-audit/rate-limit'

export type GrowthAuditSubmissionResult =
  | { ok: true; applicationId: string }
  | { ok: false; kind: 'spam' }
  | { ok: false; kind: 'validation'; fieldErrors: Record<string, string> }
  | { ok: false; kind: 'rate_limit'; retryAfterSeconds: number }
  | { ok: false; kind: 'storage' }

export type GrowthAuditSubmissionDependencies = {
  now: () => Date
  firstTouch: Record<string, string>
  lastTouch: Record<string, string>
  requestFingerprint: string
  userAgent?: string
  emailHash: (email: string) => Promise<string>
  duplicateKey: (value: string) => Promise<string>
  checkRateLimit: (input: {
    now: Date
    fingerprint: string
    emailHash: string
    duplicateKey: string
  }) => Promise<GrowthAuditRateLimitResult>
  createApplication: (input: GrowthAuditApplicationInput) => Promise<StoredGrowthAuditApplication>
  appendEvent: (event: GrowthAuditEventInput) => Promise<void>
  sendApplicantReceipt: (application: GrowthAuditEmailApplication) => Promise<{ id: string }>
  sendAdminNotification: (application: GrowthAuditEmailApplication) => Promise<{ id: string }>
}

export type GrowthAuditEmailApplication = {
  id: string
  contactName: string
  brandName: string
  email: string
  phone: string
  brandUrl: string
  createdAt: Date
}

function toFieldErrors(error: { issues: readonly { path: readonly PropertyKey[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    fieldErrors[key] ??= issue.message
  }
  return fieldErrors
}

async function recordEmailResult(
  dependencies: GrowthAuditSubmissionDependencies,
  applicationId: string,
  eventType: string,
  operation: () => Promise<{ id: string }>,
) {
  try {
    const response = await operation()
    await dependencies.appendEvent({
      applicationId,
      eventType: `${eventType}_sent`,
      metadata: { providerId: response.id },
    })
  } catch {
    await dependencies.appendEvent({
      applicationId,
      eventType: `${eventType}_failed`,
      metadata: {},
    })
  }
}

export async function processGrowthAuditSubmission(
  rawInput: unknown,
  dependencies: GrowthAuditSubmissionDependencies,
): Promise<GrowthAuditSubmissionResult> {
  if (
    rawInput &&
    typeof rawInput === 'object' &&
    'website' in rawInput &&
    typeof (rawInput as { website?: unknown }).website === 'string' &&
    (rawInput as { website: string }).website.trim() !== ''
  ) {
    return { ok: false, kind: 'spam' }
  }

  const parsed = growthAuditSubmissionSchema.safeParse(rawInput)
  if (!parsed.success) {
    return { ok: false, kind: 'validation', fieldErrors: toFieldErrors(parsed.error) }
  }

  const normalized = normalizeGrowthAuditSubmission(parsed.data)
  const now = dependencies.now()
  const emailHash = await dependencies.emailHash(normalized.email)
  const duplicateKey = await dependencies.duplicateKey(
    `${normalized.email}|${normalized.brandUrl}|${normalized.brandName.toLowerCase()}`,
  )
  const rateLimit = await dependencies.checkRateLimit({
    now,
    fingerprint: dependencies.requestFingerprint,
    emailHash,
    duplicateKey,
  })

  if (!rateLimit.allowed) {
    return {
      ok: false,
      kind: 'rate_limit',
      retryAfterSeconds: rateLimit.retryAfterSeconds ?? 60,
    }
  }

  let stored: StoredGrowthAuditApplication
  try {
    stored = await dependencies.createApplication({
      contactName: normalized.contactName,
      brandName: normalized.brandName,
      phone: normalized.phone,
      email: normalized.email,
      brandUrl: normalized.brandUrl,
      privacyAcceptedAt: now,
      consentVersion: 'privacy-v1',
      firstTouch: dependencies.firstTouch,
      lastTouch: dependencies.lastTouch,
      emailHash,
      requestFingerprint: dependencies.requestFingerprint,
      duplicateKey,
      userAgent: dependencies.userAgent ?? '',
    })
  } catch {
    return { ok: false, kind: 'storage' }
  }

  const emailApplication: GrowthAuditEmailApplication = {
    id: stored.id,
    contactName: normalized.contactName,
    brandName: normalized.brandName,
    email: normalized.email,
    phone: normalized.phone,
    brandUrl: normalized.brandUrl,
    createdAt: stored.createdAt,
  }

  await recordEmailResult(dependencies, stored.id, 'applicant_receipt', () =>
    dependencies.sendApplicantReceipt(emailApplication),
  )
  await recordEmailResult(dependencies, stored.id, 'admin_notification', () =>
    dependencies.sendAdminNotification(emailApplication),
  )

  return { ok: true, applicationId: stored.id }
}
