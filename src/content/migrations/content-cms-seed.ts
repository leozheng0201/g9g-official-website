import { getFeaturedOfficialStats, lineGiftOfficialContent } from '@/content/line-gift-official'
import type { ContentDraftInput } from '@/lib/cms/types'

export type MigratedContentSeed = {
  migrationKey: string
  publicPath: string
  sortOrder: number
  draft: ContentDraftInput
}

export function buildMigratedContentPayload(seed: MigratedContentSeed, updatedAt: string) {
  const articleSubtype = seed.draft.contentType === 'article' ? seed.draft.typeFields.subtype : null
  return {
    content_type: seed.draft.contentType,
    article_subtype: articleSubtype,
    title: seed.draft.title,
    slug: seed.draft.slug,
    excerpt: seed.draft.excerpt,
    blocks: seed.draft.blocks,
    type_fields: seed.draft.typeFields,
    seo_title: seed.draft.seoTitle,
    seo_description: seed.draft.seoDescription,
    sort_order: seed.sortOrder,
    status: 'approved',
    updated_at: updatedAt,
  }
}

const paragraph = (id: string, text: string) => ({ id, type: 'paragraph' as const, text, enabled: true })
const heading = (id: string, text: string) => ({ id, type: 'heading' as const, level: 2 as const, text, enabled: true })
const list = (id: string, items: string[], style: 'bullet' | 'numbered' = 'bullet') => ({ id, type: 'list' as const, style, items, enabled: true })

export const contentCmsSeed: readonly MigratedContentSeed[] = [
  {
    migrationKey: 'academy-about-line-gift',
    publicPath: '/about-line-gift',
    sortOrder: 5,
    draft: {
      contentType: 'article',
      title: '認識 LINE 禮物：品牌進入送禮市場前，應該先看懂什麼？',
      slug: 'about-line-gift',
      excerpt: '從官方市場資料、用戶輪廓、送禮場景與平台成長方向，整理品牌評估 LINE 禮物時需要理解的基礎。',
      blocks: [
        paragraph('33333333-3333-4333-8333-000000000001', '一般電商主要解決「我需要什麼」；送禮電商還需要回答「我想對誰表達什麼」。'),
        heading('33333333-3333-4333-8333-000000000002', '官方市場數據'),
        list('33333333-3333-4333-8333-000000000003', lineGiftOfficialContent.stats.map((item) => `${item.value} ${item.label}`)),
        heading('33333333-3333-4333-8333-000000000004', '四大社交送禮場景'),
        list('33333333-3333-4333-8333-000000000005', [...lineGiftOfficialContent.scenes], 'numbered'),
        heading('33333333-3333-4333-8333-000000000006', lineGiftOfficialContent.growthFormula.join(' × ')),
        paragraph('33333333-3333-4333-8333-000000000007', '商品建立送禮理由；流量安排被看見的節奏；轉換把送禮價值說清楚。'),
        heading('33333333-3333-4333-8333-000000000008', '2026 平台方向'),
        list('33333333-3333-4333-8333-000000000009', [...lineGiftOfficialContent.platformDirections]),
        paragraph('33333333-3333-4333-8333-000000000010', lineGiftOfficialContent.disclaimer),
      ],
      typeFields: {
        subtype: 'line_gift_academy',
        readingMinutes: 6,
        sourceTitle: lineGiftOfficialContent.sourceTitle,
        publicPath: '/about-line-gift',
        featuredStats: getFeaturedOfficialStats(),
        stats: [...lineGiftOfficialContent.stats],
        scenes: [...lineGiftOfficialContent.scenes],
        sceneInterpretations: [...lineGiftOfficialContent.sceneInterpretations],
        growthFormula: [...lineGiftOfficialContent.growthFormula],
        growthInterpretations: [...lineGiftOfficialContent.growthInterpretations],
        platformDirections: [...lineGiftOfficialContent.platformDirections],
        platformDirectionInterpretations: [...lineGiftOfficialContent.platformDirectionInterpretations],
        disclaimer: lineGiftOfficialContent.disclaimer,
      },
      seoTitle: '認識 LINE 禮物｜市場、用戶與送禮場景',
      seoDescription: '整理 LINE 禮物官方市場資料、用戶輪廓、四大送禮場景與品牌經營重點。',
    },
  },
  {
    migrationKey: 'case-smile-fruit',
    publicPath: '/cases/smile-fruit',
    sortOrder: 10,
    draft: {
      contentType: 'case_study',
      title: '微笑甜果｜LINE 禮物電商案例',
      slug: 'smile-fruit',
      excerpt: '以送禮情境與主打品策略，建立節慶檔期的成長動能。',
      blocks: [
        paragraph('11111111-1111-4111-8111-111111111101', '以送禮情境與主打品策略，建立節慶檔期的成長動能。'),
        list('11111111-1111-4111-8111-111111111102', ['過年重點檔期以低廣告預算創造單月近百萬業績', '堅持不降價', '將櫻桃水果禮盒打造為代表性主打商品']),
      ],
      typeFields: {
        brandName: '微笑甜果',
        serviceScope: ['LINE 禮物電商營運'],
        resultSummary: '節慶檔期成長與主打品建立。',
        resultAttribution: '以上為微笑甜果 LINE 禮物電商營運案例成果。',
      },
      seoTitle: '微笑甜果 LINE 禮物電商案例',
      seoDescription: '了解微笑甜果如何以送禮情境與主打品策略建立節慶檔期成長。',
    },
  },
  {
    migrationKey: 'case-ar-patisserie',
    publicPath: '/cases/ar-patisserie',
    sortOrder: 20,
    draft: {
      contentType: 'case_study',
      title: '法布甜｜整體電商與品牌轉型案例',
      slug: 'ar-patisserie',
      excerpt: '從傳統伴手禮市場，升級至高客單、高附加價值的送禮市場。',
      blocks: [
        paragraph('11111111-1111-4111-8111-111111111201', '從傳統伴手禮市場，升級至高客單、高附加價值的送禮市場。'),
        list('11111111-1111-4111-8111-111111111202', ['整體電商年營業額突破千萬', '單月 GMV 穩定達百萬', '單月訂單超過 1,400 筆']),
        paragraph('11111111-1111-4111-8111-111111111203', '以上為整體電商與品牌轉型成果，不代表 LINE 禮物單一平台成果。'),
      ],
      typeFields: {
        brandName: '法布甜',
        serviceScope: ['整體電商', '品牌轉型'],
        resultSummary: '品牌定位與整體電商營運升級。',
        resultAttribution: '以上為整體電商與品牌轉型成果，不代表 LINE 禮物單一平台成果。',
      },
      seoTitle: '法布甜整體電商與品牌轉型案例',
      seoDescription: '了解法布甜如何從傳統伴手禮市場升級至高附加價值送禮市場。',
    },
  },
  ...[
    ['fit', '什麼品牌適合進入 LINE 禮物？', '會從穩定供貨、基本客服、送禮潛力，以及品牌是否願意建立主打商品一起判斷。'],
    ['before-entry', '還沒進駐 LINE 禮物，可以先合作嗎？', '可以先做品牌成長健檢與商城啟動規劃，但 G9G 不保證平台審核結果。'],
    ['guarantee', 'G9G 會保證上架或業績嗎？', '不會。G9G 不保證商城核准、特定業績、流量或搜尋排名。'],
    ['placements', '廣告與站內版位費包含在服務費嗎？', '廣告預算與 LINE 禮物站內版位費另計；G9G 依合作方案提供策略、規劃與基本版位素材尺寸延伸。'],
    ['plans', '三種代營運方案有什麼差異？', '商城啟動適合第一次進場；成果分潤依完成訂單成交額計算；全年代營運建立 12 個月的商品、檔期、版位與數據節奏。'],
    ['audit', '品牌成長健檢會怎麼進行？', '先提交第一階段申請；初審後再由 G9G 聯繫並說明後續流程。'],
  ].map(([slug, question, answer], index): MigratedContentSeed => ({
    migrationKey: `faq-${slug}`,
    publicPath: `/faq#${slug}`,
    sortOrder: (index + 1) * 10,
    draft: {
      contentType: 'faq',
      title: question,
      slug,
      excerpt: answer,
      blocks: [paragraph(`22222222-2222-4222-8222-${String(index + 1).padStart(12, '0')}`, answer)],
      typeFields: { question, category: '合作與服務' },
      seoTitle: `${question}｜G9G FAQ`,
      seoDescription: answer,
    },
  })),
]
