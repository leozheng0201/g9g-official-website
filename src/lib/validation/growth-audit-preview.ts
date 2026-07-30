import { z } from 'zod'

export const growthAuditPreviewSchema = z.object({
  contactName: z.string().trim().min(2, '請填寫聯絡人姓名').max(50),
  brandName: z.string().trim().min(2, '請填寫品牌名稱').max(80),
  phone: z.string().trim().regex(/^09\d{8}$/, '請填寫 10 碼台灣手機號碼'),
  email: z.string().trim().email('請填寫有效的 Email'),
  brandUrl: z.string().trim().url('請填寫包含 https:// 的品牌連結'),
  privacyAccepted: z.literal(true, { error: '請先同意隱私權政策' }),
  website: z.string().max(0, '偵測到不合法欄位'),
})

export type GrowthAuditPreviewInput = z.infer<typeof growthAuditPreviewSchema>
