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

  it('preserves the official LINE Gift fields through CMS validation', () => {
    const value = parseContentDraft({
      ...core,
      contentType: 'article',
      slug: 'about-line-gift',
      typeFields: {
        subtype: 'line_gift_academy',
        readingMinutes: 6,
        sourceTitle: '2026 LINE 禮物資訊分享',
        publicPath: '/about-line-gift',
        featuredStats: [
          { id: 'users', value: '900 萬以上', label: 'LINE 禮物用戶' },
          { id: 'gifts', value: '8,000 萬以上', label: '2021–2025 累積送禮份數' },
          { id: 'age-20-44', value: '超過八成', label: '20–44 歲用戶占比' },
          { id: 'scenes', value: '四大場景', label: '儀式、商務、吉時、情緒' },
        ],
        stats: [
          { id: 'users', value: '900 萬以上', label: 'LINE 禮物用戶' },
          { id: 'gifts', value: '8,000 萬以上', label: '2021–2025 累積送禮份數' },
          { id: 'age-20-44', value: '超過八成', label: '20–44 歲用戶占比' },
          { id: 'under-34', value: '超過 55%', label: '34 歲以下族群' },
          { id: 'gender', value: '女性約 60%／男性約 40%', label: '用戶性別比例' },
        ],
        scenes: ['儀式禮物', '商務禮物', '吉時禮物', '情緒禮物'],
        sceneInterpretations: ['儀式解讀', '商務解讀', '吉時解讀', '情緒解讀'],
        growthFormula: ['商品', '流量', '轉換'],
        growthInterpretations: [
          { title: '商品', text: '商品解讀' },
          { title: '流量', text: '流量解讀' },
          { title: '轉換', text: '轉換解讀' },
        ],
        platformDirections: ['更好逛', '更心動', '更好送'],
        platformDirectionInterpretations: ['逛的解讀', '心動解讀', '送的解讀'],
        disclaimer:
          '資料來源：《2026 LINE 禮物資訊分享》。G9G／盛澄策略顧問非 LINE 官方或官方代理商；本頁將官方資料、營運解讀與 G9G 服務分開呈現。',
      },
    })

    expect(value.typeFields).toMatchObject({
      sourceTitle: '2026 LINE 禮物資訊分享',
      publicPath: '/about-line-gift',
      scenes: ['儀式禮物', '商務禮物', '吉時禮物', '情緒禮物'],
      platformDirectionInterpretations: ['逛的解讀', '心動解讀', '送的解讀'],
    })
  })

  it('rejects altered official LINE Gift statistics', () => {
    expect(() =>
      parseContentDraft({
        ...core,
        contentType: 'article',
        slug: 'about-line-gift',
        typeFields: {
          subtype: 'line_gift_academy',
          readingMinutes: 6,
          sourceTitle: '2026 LINE 禮物資訊分享',
          publicPath: '/about-line-gift',
          featuredStats: [
            { id: 'users', value: '1,000 萬以上', label: 'LINE 禮物用戶' },
            { id: 'gifts', value: '8,000 萬以上', label: '2021–2025 累積送禮份數' },
            { id: 'age-20-44', value: '超過八成', label: '20–44 歲用戶占比' },
            { id: 'scenes', value: '四大場景', label: '儀式、商務、吉時、情緒' },
          ],
          stats: [{ id: 'users', value: '1,000 萬以上', label: 'LINE 禮物用戶' }],
          scenes: ['儀式禮物', '商務禮物', '吉時禮物', '情緒禮物'],
          sceneInterpretations: ['儀式解讀', '商務解讀', '吉時解讀', '情緒解讀'],
          growthFormula: ['商品', '流量', '轉換'],
          growthInterpretations: [
            { title: '商品', text: '商品解讀' },
            { title: '流量', text: '流量解讀' },
            { title: '轉換', text: '轉換解讀' },
          ],
          platformDirections: ['更好逛', '更心動', '更好送'],
          platformDirectionInterpretations: ['逛的解讀', '心動解讀', '送的解讀'],
          disclaimer:
            '資料來源：《2026 LINE 禮物資訊分享》。G9G／盛澄策略顧問非 LINE 官方或官方代理商；本頁將官方資料、營運解讀與 G9G 服務分開呈現。',
        },
      }),
    ).toThrow(/官方資料契約/)
  })

  it('requires the fixed non-official disclaimer on the foundation page', () => {
    expect(() =>
      parseContentDraft({
        ...core,
        contentType: 'article',
        slug: 'about-line-gift',
        typeFields: {
          subtype: 'line_gift_academy',
          readingMinutes: 6,
          publicPath: '/about-line-gift',
        },
      }),
    ).toThrow(/官方資料契約/)
  })

  it('does not let the fixed foundation item bypass its contract by renaming both routes', () => {
    expect(() =>
      parseContentDraft(
        {
          ...core,
          contentType: 'article',
          slug: 'renamed-foundation',
          typeFields: { subtype: 'line_gift_academy', readingMinutes: 6 },
        },
        { contentItemId: '30000000-0000-4000-8000-000000000201' },
      ),
    ).toThrow(/官方資料契約/)
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
