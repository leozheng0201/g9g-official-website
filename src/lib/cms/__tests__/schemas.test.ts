import { describe, expect, it } from 'vitest'

import { parseContentBlocks, parseContentDraft } from '@/lib/cms/schemas'

const blockId = '11111111-1111-4111-8111-111111111111'

const validBlocks = [
  { id: blockId, type: 'heading', level: 2, text: '標題', enabled: true },
  { id: blockId, type: 'paragraph', text: '段落', enabled: true },
  { id: blockId, type: 'image', mediaId: blockId, alt: '圖片說明', enabled: true },
  { id: blockId, type: 'image_text', mediaId: blockId, alt: '圖片說明', text: '文字', imagePosition: 'left', enabled: true },
  { id: blockId, type: 'quote', text: '重點', enabled: true },
  { id: blockId, type: 'list', style: 'bullet', items: ['一', '二'], enabled: true },
  { id: blockId, type: 'cta', label: '了解更多', href: 'https://example.com', enabled: true },
  { id: blockId, type: 'metrics', items: [{ label: '成長', value: '20%' }], enabled: true },
  { id: blockId, type: 'table', headers: ['欄位'], rows: [['內容']], enabled: true },
  { id: blockId, type: 'video', provider: 'youtube', url: 'https://www.youtube.com/watch?v=abc123', enabled: true },
  { id: blockId, type: 'faq_group', items: [{ question: '問題', answer: '答案' }], enabled: true },
  { id: blockId, type: 'divider', enabled: true },
] as const

describe('parseContentBlocks', () => {
  it('accepts all supported block types', () => {
    expect(parseContentBlocks(validBlocks)).toHaveLength(12)
  })

  it('rejects unstable or missing block ids', () => {
    expect(() => parseContentBlocks([{ type: 'paragraph', text: '段落', enabled: true }])).toThrow()
  })

  it('rejects unknown keys and raw html payloads', () => {
    expect(() =>
      parseContentBlocks([{ id: blockId, type: 'paragraph', text: '段落', html: '<script>alert(1)</script>', enabled: true }]),
    ).toThrow()
  })

  it('requires safe https links for CTA blocks', () => {
    expect(() =>
      parseContentBlocks([{ id: blockId, type: 'cta', label: '不安全', href: 'javascript:alert(1)', enabled: true }]),
    ).toThrow()
  })

  it('accepts only approved video providers', () => {
    expect(() =>
      parseContentBlocks([{ id: blockId, type: 'video', provider: 'unknown', url: 'https://example.com/video', enabled: true }]),
    ).toThrow()
  })

  it('rejects table rows that do not match header width', () => {
    expect(() =>
      parseContentBlocks([{ id: blockId, type: 'table', headers: ['A', 'B'], rows: [['只有一欄']], enabled: true }]),
    ).toThrow()
  })
})

describe('parseContentDraft', () => {
  const core = {
    title: '內容標題',
    slug: 'content-slug',
    excerpt: '內容摘要',
    blocks: [validBlocks[1]],
    seoTitle: 'SEO 標題',
    seoDescription: 'SEO 描述',
  }

  it('validates article fields', () => {
    const value = parseContentDraft({
      ...core,
      contentType: 'article',
      typeFields: { subtype: 'insight', readingMinutes: 5 },
    })
    expect(value.contentType).toBe('article')
  })

  it('requires result attribution for case studies', () => {
    expect(() =>
      parseContentDraft({
        ...core,
        contentType: 'case_study',
        typeFields: { brandName: '品牌', serviceScope: ['LINE 禮物'] },
      }),
    ).toThrow()
  })

  it('validates FAQ fields', () => {
    const value = parseContentDraft({
      ...core,
      contentType: 'faq',
      typeFields: { question: '常見問題？', category: '合作方式' },
    })
    expect(value.contentType).toBe('faq')
  })

  it('requires https for resource external URLs', () => {
    expect(() =>
      parseContentDraft({
        ...core,
        contentType: 'resource',
        typeFields: { access: 'ungated', externalUrl: 'http://example.com/file' },
      }),
    ).toThrow()
  })
})
