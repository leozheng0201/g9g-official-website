import { z } from 'zod'

import type { ContentBlock, ContentDraftInput } from '@/lib/cms/types'

const uuid = z.string().uuid()
const nonEmptyText = (max: number) => z.string().trim().min(1).max(max)

const safeLink = z.string().trim().refine((value) => {
  if (value.startsWith('/')) return !value.startsWith('//')
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}, '連結必須是站內路徑或 HTTPS 網址')

const httpsUrl = z.url().refine((value) => new URL(value).protocol === 'https:', '網址必須使用 HTTPS')

const baseBlock = {
  id: uuid,
  enabled: z.boolean(),
}

const headingBlock = z
  .object({ ...baseBlock, type: z.literal('heading'), level: z.union([z.literal(2), z.literal(3), z.literal(4)]), text: nonEmptyText(200) })
  .strict()
const paragraphBlock = z.object({ ...baseBlock, type: z.literal('paragraph'), text: nonEmptyText(10000) }).strict()
const imageBlock = z
  .object({ ...baseBlock, type: z.literal('image'), mediaId: uuid, alt: nonEmptyText(300), caption: z.string().trim().max(500).optional() })
  .strict()
const imageTextBlock = z
  .object({
    ...baseBlock,
    type: z.literal('image_text'),
    mediaId: uuid,
    alt: nonEmptyText(300),
    text: nonEmptyText(5000),
    imagePosition: z.enum(['left', 'right']),
  })
  .strict()
const quoteBlock = z
  .object({ ...baseBlock, type: z.literal('quote'), text: nonEmptyText(2000), attribution: z.string().trim().max(300).optional() })
  .strict()
const listBlock = z
  .object({
    ...baseBlock,
    type: z.literal('list'),
    style: z.enum(['bullet', 'numbered']),
    items: z.array(nonEmptyText(1000)).min(1).max(50),
  })
  .strict()
const ctaBlock = z.object({ ...baseBlock, type: z.literal('cta'), label: nonEmptyText(120), href: safeLink }).strict()
const metricsBlock = z
  .object({
    ...baseBlock,
    type: z.literal('metrics'),
    items: z
      .array(z.object({ label: nonEmptyText(120), value: nonEmptyText(120), note: z.string().trim().max(300).optional() }).strict())
      .min(1)
      .max(8),
  })
  .strict()
const tableBlock = z
  .object({
    ...baseBlock,
    type: z.literal('table'),
    headers: z.array(nonEmptyText(200)).min(1).max(12),
    rows: z.array(z.array(z.string().trim().max(2000))).max(100),
  })
  .strict()
  .superRefine((value, context) => {
    value.rows.forEach((row, rowIndex) => {
      if (row.length !== value.headers.length) {
        context.addIssue({ code: 'custom', path: ['rows', rowIndex], message: '每列欄位數必須與表頭一致' })
      }
    })
  })
const videoBlock = z
  .object({
    ...baseBlock,
    type: z.literal('video'),
    provider: z.enum(['youtube', 'vimeo']),
    url: httpsUrl,
    title: z.string().trim().max(200).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const hostname = new URL(value.url).hostname.replace(/^www\./, '')
    const approved = value.provider === 'youtube' ? ['youtube.com', 'youtu.be'] : ['vimeo.com', 'player.vimeo.com']
    if (!approved.includes(hostname)) {
      context.addIssue({ code: 'custom', path: ['url'], message: '影片網址與選擇的平台不符' })
    }
  })
const faqGroupBlock = z
  .object({
    ...baseBlock,
    type: z.literal('faq_group'),
    items: z.array(z.object({ question: nonEmptyText(300), answer: nonEmptyText(5000) }).strict()).min(1).max(30),
  })
  .strict()
const dividerBlock = z.object({ ...baseBlock, type: z.literal('divider') }).strict()

const contentBlockSchema = z.discriminatedUnion('type', [
  headingBlock,
  paragraphBlock,
  imageBlock,
  imageTextBlock,
  quoteBlock,
  listBlock,
  ctaBlock,
  metricsBlock,
  tableBlock,
  videoBlock,
  faqGroupBlock,
  dividerBlock,
])

const blocksSchema = z.array(contentBlockSchema).max(200)

const coreDraft = {
  title: nonEmptyText(200),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 格式不正確'),
  excerpt: nonEmptyText(500),
  blocks: blocksSchema,
  seoTitle: nonEmptyText(200),
  seoDescription: nonEmptyText(500),
}

const articleDraft = z
  .object({
    ...coreDraft,
    contentType: z.literal('article'),
    typeFields: z
      .object({
        subtype: z.enum(['insight', 'line_gift_academy']),
        readingMinutes: z.number().int().min(1).max(240),
        relatedContentIds: z.array(uuid).max(12).optional(),
        cta: z.object({ label: nonEmptyText(120), href: safeLink }).strict().optional(),
      })
      .strict(),
  })
  .strict()

const caseStudyDraft = z
  .object({
    ...coreDraft,
    contentType: z.literal('case_study'),
    typeFields: z
      .object({
        brandName: nonEmptyText(200),
        serviceScope: z.array(nonEmptyText(200)).min(1).max(20),
        resultSummary: z.string().trim().max(3000).optional(),
        resultAttribution: nonEmptyText(1000),
        timeline: z.string().trim().max(500).optional(),
      })
      .strict(),
  })
  .strict()

const faqDraft = z
  .object({
    ...coreDraft,
    contentType: z.literal('faq'),
    typeFields: z.object({ question: nonEmptyText(300), category: nonEmptyText(120) }).strict(),
  })
  .strict()

const resourceDraft = z
  .object({
    ...coreDraft,
    contentType: z.literal('resource'),
    typeFields: z
      .object({
        access: z.enum(['gated', 'ungated']),
        mediaId: uuid.optional(),
        externalUrl: httpsUrl.optional(),
        instructions: z.string().trim().max(2000).optional(),
      })
      .strict()
      .refine((value) => Boolean(value.mediaId || value.externalUrl), '資源必須包含檔案或外部網址'),
  })
  .strict()

const contentDraftSchema = z.discriminatedUnion('contentType', [articleDraft, caseStudyDraft, faqDraft, resourceDraft])

export function parseContentBlocks(input: unknown): ContentBlock[] {
  return blocksSchema.parse(input) as ContentBlock[]
}

export function parseContentDraft(input: unknown): ContentDraftInput {
  return contentDraftSchema.parse(input) as ContentDraftInput
}
