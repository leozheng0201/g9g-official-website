import { timingSafeEqual } from 'node:crypto'

import { NextResponse } from 'next/server'

import { processScheduledContent } from '@/lib/cms/scheduler'
import { serverEnv } from '@/lib/env/server'

function authorized(request: Request) {
  const env = serverEnv()
  const expectedValue = env.CMS_SCHEDULER_SECRET ?? env.GROWTH_AUDIT_FINGERPRINT_SECRET
  const receivedValue = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const expected = Buffer.from(expectedValue)
  const received = Buffer.from(receivedValue)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const result = await processScheduledContent(new Date())
  return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
}
