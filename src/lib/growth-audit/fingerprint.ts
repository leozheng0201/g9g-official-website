import { createHmac } from 'node:crypto'

export type RequestFingerprintInput = {
  ipAddress: string
  userAgent: string
  secret: string
}

export function createRequestFingerprint({
  ipAddress,
  userAgent,
  secret,
}: RequestFingerprintInput): string {
  if (!secret) throw new Error('fingerprint secret is required')

  return createHmac('sha256', secret)
    .update(`${ipAddress.trim()}\n${userAgent.trim()}`)
    .digest('hex')
}
