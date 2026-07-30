import type { GrowthAuditStatus } from '@/lib/growth-audit/status'

export type GrowthAuditApplicationInput = {
  contactName: string
  brandName: string
  phone: string
  email: string
  brandUrl: string
  privacyAcceptedAt: Date
  consentVersion: string
  firstTouch: Record<string, string>
  lastTouch: Record<string, string>
  emailHash: string
  requestFingerprint: string
  duplicateKey: string
  userAgent: string
}

export type StoredGrowthAuditApplication = {
  id: string
  status: GrowthAuditStatus
  createdAt: Date
}

export type GrowthAuditApplicationRecord = GrowthAuditApplicationInput & {
  status: GrowthAuditStatus
}

export type GrowthAuditEventInput = {
  applicationId: string
  eventType: string
  metadata: Record<string, unknown>
}

export type GrowthAuditRepositoryDependencies = {
  insertApplication: (
    record: GrowthAuditApplicationRecord,
  ) => Promise<StoredGrowthAuditApplication>
  appendEvent: (event: GrowthAuditEventInput) => Promise<void>
}

export class DuplicateGrowthAuditApplicationError extends Error {
  constructor() {
    super('A recent matching growth audit application already exists')
    this.name = 'DuplicateGrowthAuditApplicationError'
  }
}

function isUniqueViolation(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code?: unknown }).code === '23505',
  )
}

export async function appendGrowthAuditEvent(
  event: GrowthAuditEventInput,
  dependencies: Pick<GrowthAuditRepositoryDependencies, 'appendEvent'>,
): Promise<void> {
  await dependencies.appendEvent(event)
}

export async function createGrowthAuditApplication(
  input: GrowthAuditApplicationInput,
  dependencies: GrowthAuditRepositoryDependencies,
): Promise<StoredGrowthAuditApplication> {
  let application: StoredGrowthAuditApplication

  try {
    application = await dependencies.insertApplication({
      ...input,
      status: 'new',
    })
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DuplicateGrowthAuditApplicationError()
    }
    throw error
  }

  await appendGrowthAuditEvent(
    {
      applicationId: application.id,
      eventType: 'submitted',
      metadata: {},
    },
    dependencies,
  )

  return {
    id: application.id,
    status: application.status,
    createdAt: application.createdAt,
  }
}
