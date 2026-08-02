export const contentTypes = ['article', 'case_study', 'faq', 'resource'] as const
export type ContentType = (typeof contentTypes)[number]

export const contentStatuses = [
  'draft',
  'in_review',
  'changes_requested',
  'approved',
  'scheduled',
  'published',
  'unpublished',
  'trashed',
] as const
export type ContentStatus = (typeof contentStatuses)[number]

export type BaseBlock = {
  id: string
  enabled: boolean
}

export type HeadingBlock = BaseBlock & { type: 'heading'; level: 2 | 3 | 4; text: string }
export type ParagraphBlock = BaseBlock & { type: 'paragraph'; text: string }
export type ImageBlock = BaseBlock & { type: 'image'; mediaId: string; alt: string; caption?: string }
export type ImageTextBlock = BaseBlock & {
  type: 'image_text'
  mediaId: string
  alt: string
  text: string
  imagePosition: 'left' | 'right'
}
export type QuoteBlock = BaseBlock & { type: 'quote'; text: string; attribution?: string }
export type ListBlock = BaseBlock & { type: 'list'; style: 'bullet' | 'numbered'; items: string[] }
export type CtaBlock = BaseBlock & { type: 'cta'; label: string; href: string }
export type MetricsBlock = BaseBlock & {
  type: 'metrics'
  items: Array<{ label: string; value: string; note?: string }>
}
export type TableBlock = BaseBlock & { type: 'table'; headers: string[]; rows: string[][] }
export type VideoBlock = BaseBlock & { type: 'video'; provider: 'youtube' | 'vimeo'; url: string; title?: string }
export type FaqGroupBlock = BaseBlock & {
  type: 'faq_group'
  items: Array<{ question: string; answer: string }>
}
export type DividerBlock = BaseBlock & { type: 'divider' }

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ImageTextBlock
  | QuoteBlock
  | ListBlock
  | CtaBlock
  | MetricsBlock
  | TableBlock
  | VideoBlock
  | FaqGroupBlock
  | DividerBlock

export type OfficialStat = {
  id: string
  value: string
  label: string
}

export type ArticleFields = {
  subtype: 'insight' | 'line_gift_academy'
  readingMinutes: number
  relatedContentIds?: string[]
  cta?: { label: string; href: string }
  sourceTitle?: string
  publicPath?: string
  featuredStats?: OfficialStat[]
  stats?: OfficialStat[]
  scenes?: string[]
  growthFormula?: string[]
  platformDirections?: string[]
  disclaimer?: string
}

export type CaseStudyFields = {
  brandName: string
  serviceScope: string[]
  resultSummary?: string
  resultAttribution: string
  timeline?: string
}

export type FaqFields = {
  question: string
  category: string
}

export type ResourceFields = {
  access: 'gated' | 'ungated'
  mediaId?: string
  externalUrl?: string
  instructions?: string
}

export type ContentDraftInput = {
  title: string
  slug: string
  excerpt: string
  blocks: ContentBlock[]
  seoTitle: string
  seoDescription: string
} & (
  | { contentType: 'article'; typeFields: ArticleFields }
  | { contentType: 'case_study'; typeFields: CaseStudyFields }
  | { contentType: 'faq'; typeFields: FaqFields }
  | { contentType: 'resource'; typeFields: ResourceFields }
)
