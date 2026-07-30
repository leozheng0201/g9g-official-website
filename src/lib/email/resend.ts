import type { TransactionalEmail } from '@/lib/email/templates/growth-audit'

export type ResendEmailResult = { id: string }

export type ResendGatewayOptions = {
  apiKey: string
  fetchImpl?: typeof fetch
  timeoutMs?: number
}

export async function sendResendEmail(
  email: TransactionalEmail,
  options: ResendGatewayOptions,
): Promise<ResendEmailResult> {
  const fetchImpl = options.fetchImpl ?? fetch
  const timeoutMs = options.timeoutMs ?? 8000
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': email.idempotencyKey,
      },
      body: JSON.stringify({
        from: email.from,
        to: email.to,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
        subject: email.subject,
        html: email.html,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error('Resend email request failed')
    }

    const payload: unknown = await response.json()
    if (!payload || typeof payload !== 'object' || !('id' in payload)) {
      throw new Error('Resend email request failed')
    }

    const id = (payload as { id?: unknown }).id
    if (typeof id !== 'string' || !id) {
      throw new Error('Resend email request failed')
    }

    return { id }
  } catch (error) {
    if (error instanceof Error && error.message === 'Resend email request failed') {
      throw error
    }
    throw new Error('Resend email request failed')
  } finally {
    clearTimeout(timeout)
  }
}
