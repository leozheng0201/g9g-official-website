import { z } from 'zod'

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

export type PublicEnv = z.infer<typeof publicSchema>
export type ServerEnv = z.infer<typeof serverSchema>

export const parsePublicEnv = (input: Record<string, string | undefined>): PublicEnv =>
  publicSchema.parse(input)

export const parseServerEnv = (input: Record<string, string | undefined>): ServerEnv =>
  serverSchema.parse(input)
