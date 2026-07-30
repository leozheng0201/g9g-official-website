import { z } from 'zod'

const taiwanMobile = z
  .string()
  .trim()
  .max(32)
  .refine((value) => {
    const digits = value.replace(/[\s()-]/g, '')
    return /^09\d{8}$/.test(digits) || /^\+8869\d{8}$/.test(digits)
  }, '請輸入有效的台灣手機號碼')

const httpsUrl = z
  .string()
  .trim()
  .max(500)
  .url()
  .refine((value) => new URL(value).protocol === 'https:', '品牌連結必須使用 HTTPS')

export const growthAuditSubmissionSchema = z
  .object({
    contactName: z.string().trim().min(1).max(80),
    brandName: z.string().trim().min(1).max(120),
    phone: taiwanMobile,
    email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
    brandUrl: httpsUrl,
    privacyAccepted: z.literal(true),
    website: z.literal(''),
  })
  .strict()

export type GrowthAuditSubmissionInput = z.input<typeof growthAuditSubmissionSchema>
export type NormalizedGrowthAuditSubmission = z.output<typeof growthAuditSubmissionSchema>

function normalizeTaiwanMobile(value: string): string {
  const digits = value.replace(/[\s()-]/g, '')
  if (digits.startsWith('+886')) return digits
  return `+886${digits.slice(1)}`
}

export function normalizeGrowthAuditSubmission(
  input: NormalizedGrowthAuditSubmission,
): NormalizedGrowthAuditSubmission {
  return {
    ...input,
    contactName: input.contactName.trim(),
    brandName: input.brandName.trim(),
    phone: normalizeTaiwanMobile(input.phone),
    email: input.email.trim().toLowerCase(),
    brandUrl: input.brandUrl.trim(),
  }
}
