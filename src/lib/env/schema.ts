import { z } from 'zod'

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})

const serviceRoleSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  GROWTH_AUDIT_FROM_EMAIL: z.string().email(),
  GROWTH_AUDIT_ADMIN_EMAIL: z.string().email(),
  GROWTH_AUDIT_FINGERPRINT_SECRET: z.string().min(32),
  CMS_PREVIEW_SECRET: z.string().min(32).optional(),
  CMS_SCHEDULER_SECRET: z.string().min(32).optional(),
})

export type PublicEnv = z.infer<typeof publicSchema>
export type ServiceRoleEnv = z.infer<typeof serviceRoleSchema>
export type ServerEnv = z.infer<typeof serverSchema>

export const parsePublicEnv = (input: Record<string, string | undefined>): PublicEnv =>
  publicSchema.parse(input)

export const parseServiceRoleEnv = (
  input: Record<string, string | undefined>,
): ServiceRoleEnv => serviceRoleSchema.parse(input)

export const parseServerEnv = (input: Record<string, string | undefined>): ServerEnv =>
  serverSchema.parse(input)
