import 'server-only'

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

import { serverEnv } from '@/lib/env/server'
import { createServiceRoleSupabaseClient } from '@/lib/supabase/service-role'

function secret() {
  const env = serverEnv()
  return env.CMS_PREVIEW_SECRET ?? env.GROWTH_AUDIT_FINGERPRINT_SECRET
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

function tokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createPreviewToken(input: {
  contentItemId: string
  actorId: string
  expiresInMinutes?: number
}) {
  const expiresAt = new Date(Date.now() + Math.min(Math.max(input.expiresInMinutes ?? 60, 5), 24 * 60) * 60_000)
  const payload = Buffer.from(JSON.stringify({
    contentItemId: input.contentItemId,
    expiresAt: expiresAt.toISOString(),
    nonce: randomBytes(18).toString('base64url'),
  })).toString('base64url')
  const token = `${payload}.${sign(payload)}`
  const client = createServiceRoleSupabaseClient()
  const { error } = await client.from('preview_tokens').insert({
    content_item_id: input.contentItemId,
    token_hash: tokenHash(token),
    expires_at: expiresAt.toISOString(),
    created_by: input.actorId,
  })
  if (error) throw error
  return { token, expiresAt }
}

export async function verifyPreviewToken(token: string, expectedContentItemId?: string) {
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra) return null
  const expected = Buffer.from(sign(payload))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

  let decoded: { contentItemId: string; expiresAt: string; nonce: string }
  try {
    decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as typeof decoded
  } catch {
    return null
  }
  if (!decoded.contentItemId || !decoded.expiresAt || !decoded.nonce) return null
  if (expectedContentItemId && decoded.contentItemId !== expectedContentItemId) return null
  if (new Date(decoded.expiresAt).getTime() <= Date.now()) return null

  const client = createServiceRoleSupabaseClient()
  const { data, error } = await client
    .from('preview_tokens')
    .select('id,content_item_id,expires_at,revoked_at')
    .eq('token_hash', tokenHash(token))
    .maybeSingle()
  if (error || !data || data.revoked_at) return null
  if (new Date(data.expires_at).getTime() <= Date.now()) return null
  if (data.content_item_id !== decoded.contentItemId) return null
  return { id: data.id, contentItemId: data.content_item_id, expiresAt: new Date(data.expires_at) }
}

export async function revokePreviewToken(token: string) {
  const client = createServiceRoleSupabaseClient()
  const { error } = await client
    .from('preview_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token_hash', tokenHash(token))
  if (error) throw error
}
