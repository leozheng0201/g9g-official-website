'use server'

import { createHmac } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { contactInfo } from '@/content/site'
import { buildGrowthAuditAdminNotification, buildGrowthAuditApplicantReceipt } from '@/lib/email/templates/growth-audit'
import { sendResendEmail } from '@/lib/email/resend'
import { serverEnv } from '@/lib/env/server'
import { parseAttributionCookies } from '@/lib/growth-audit/attribution'
import { createRequestFingerprint } from '@/lib/growth-audit/fingerprint'
import { checkGrowthAuditRateLimit } from '@/lib/growth-audit/rate-limit'
import { appendGrowthAuditEvent, createGrowthAuditApplication } from '@/lib/growth-audit/repository'
import { processGrowthAuditSubmission, type GrowthAuditSubmissionResult } from '@/lib/growth-audit/submit'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'

export type GrowthAuditActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> }

export const initialGrowthAuditActionState: GrowthAuditActionState = { status: 'idle' }

function hmac(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('hex')
}

function formDataToInput(formData: FormData) {
  return {
    contactName: formData.get('contactName'),
    brandName: formData.get('brandName'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    brandUrl: formData.get('brandUrl'),
    privacyAccepted: formData.get('privacyAccepted') === 'on',
    website: formData.get('website') ?? '',
  }
}

function actionStateFromResult(result: GrowthAuditSubmissionResult): GrowthAuditActionState {
  if (result.ok) return { status: 'idle' }
  if (result.kind === 'validation') {
    return { status: 'error', message: '請檢查表單欄位。', fieldErrors: result.fieldErrors }
  }
  if (result.kind === 'rate_limit') {
    return { status: 'error', message: '送出次數過於頻繁，請稍後再試。' }
  }
  if (result.kind === 'spam') {
    return { status: 'error', message: '無法送出申請。' }
  }
  return { status: 'error', message: '系統暫時無法送出，請稍後再試或使用 LINE 聯絡我們。' }
}

export async function submitGrowthAudit(
  _previousState: GrowthAuditActionState,
  formData: FormData,
): Promise<GrowthAuditActionState> {
  const env = serverEnv()
  const requestHeaders = await headers()
  const cookieStore = await cookies()
  const supabase = createAdminSupabaseClient()
  const userAgent = requestHeaders.get('user-agent') ?? ''
  const forwardedFor = requestHeaders.get('x-forwarded-for') ?? ''
  const ipAddress = forwardedFor.split(',')[0]?.trim() || requestHeaders.get('x-real-ip') || 'unknown'
  const attribution = parseAttributionCookies(
    cookieStore.get('g9g_first_touch')?.value ?? '',
    cookieStore.get('g9g_last_touch')?.value ?? '',
    env.GROWTH_AUDIT_FINGERPRINT_SECRET,
  )
  const requestFingerprint = createRequestFingerprint({
    ipAddress,
    userAgent,
    secret: env.GROWTH_AUDIT_FINGERPRINT_SECRET,
  })

  const appendEvent = async (event: {
    applicationId: string
    eventType: string
    metadata: Record<string, unknown>
  }) => {
    const { error } = await supabase.from('growth_audit_events').insert({
      application_id: event.applicationId,
      event_type: event.eventType,
      metadata: event.metadata,
    })
    if (error) throw error
  }

  const result = await processGrowthAuditSubmission(formDataToInput(formData), {
    now: () => new Date(),
    firstTouch: attribution.firstTouch,
    lastTouch: attribution.lastTouch,
    requestFingerprint,
    userAgent,
    emailHash: async (email) => hmac(email, env.GROWTH_AUDIT_FINGERPRINT_SECRET),
    duplicateKey: async (value) => hmac(value, env.GROWTH_AUDIT_FINGERPRINT_SECRET),
    checkRateLimit: async (input) =>
      checkGrowthAuditRateLimit(input, {
        findRecent: async (since) => {
          const { data, error } = await supabase
            .from('growth_audit_applications')
            .select('created_at, request_fingerprint, email_hash, duplicate_key')
            .gte('created_at', since.toISOString())
          if (error) throw error
          return (data ?? []).map((row) => ({
            createdAt: new Date(row.created_at),
            fingerprint: row.request_fingerprint,
            emailHash: row.email_hash,
            duplicateKey: row.duplicate_key,
          }))
        },
      }),
    createApplication: async (input) =>
      createGrowthAuditApplication(input, {
        insertApplication: async (record) => {
          const { data, error } = await supabase
            .from('growth_audit_applications')
            .insert({
              status: record.status,
              contact_name: record.contactName,
              brand_name: record.brandName,
              phone: record.phone,
              email: record.email,
              brand_url: record.brandUrl,
              privacy_accepted_at: record.privacyAcceptedAt.toISOString(),
              consent_version: record.consentVersion,
              first_touch: record.firstTouch,
              last_touch: record.lastTouch,
              email_hash: record.emailHash,
              request_fingerprint: record.requestFingerprint,
              duplicate_key: record.duplicateKey,
              user_agent: record.userAgent,
            })
            .select('id, status, created_at')
            .single()
          if (error) throw error
          return { id: data.id, status: data.status, createdAt: new Date(data.created_at) }
        },
        appendEvent,
      }),
    appendEvent: (event) => appendGrowthAuditEvent(event, { appendEvent }),
    sendApplicantReceipt: async (application) =>
      sendResendEmail(
        buildGrowthAuditApplicantReceipt(application, {
          from: env.GROWTH_AUDIT_FROM_EMAIL,
          replyTo: contactInfo.email,
        }),
        { apiKey: env.RESEND_API_KEY },
      ),
    sendAdminNotification: async (application) =>
      sendResendEmail(
        buildGrowthAuditAdminNotification(application, {
          from: env.GROWTH_AUDIT_FROM_EMAIL,
          adminEmail: env.GROWTH_AUDIT_ADMIN_EMAIL,
          replyTo: application.email,
        }),
        { apiKey: env.RESEND_API_KEY },
      ),
  })

  if (result.ok) redirect('/growth-audit/success')
  return actionStateFromResult(result)
}
