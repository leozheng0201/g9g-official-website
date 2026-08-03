import type { OfficialInterpretation, OfficialStat } from '@/lib/cms/types'

export type { OfficialInterpretation, OfficialStat } from '@/lib/cms/types'

export const lineGiftOfficialContentId = '30000000-0000-4000-8000-000000000201'

export type LineGiftOfficialFields = {
  sourceTitle: string
  publicPath: string
  featuredStats: OfficialStat[]
  stats: OfficialStat[]
  scenes: string[]
  sceneInterpretations: string[]
  growthFormula: string[]
  growthInterpretations: OfficialInterpretation[]
  platformDirections: string[]
  platformDirectionInterpretations: string[]
  disclaimer: string
}

export const lineGiftOfficialContent = {
  sourceTitle: '2026 LINE 禮物資訊分享',
  stats: [
    { id: 'users', value: '900 萬以上', label: 'LINE 禮物用戶' },
    { id: 'gifts', value: '8,000 萬以上', label: '2021–2025 累積送禮份數' },
    { id: 'age-20-44', value: '超過八成', label: '20–44 歲用戶占比' },
    { id: 'under-34', value: '超過 55%', label: '34 歲以下族群' },
    { id: 'gender', value: '女性約 60%／男性約 40%', label: '用戶性別比例' },
  ] satisfies OfficialStat[],
  scenes: ['儀式禮物', '商務禮物', '吉時禮物', '情緒禮物'],
  sceneInterpretations: [
    '對應生日、週年、節慶等明確時刻，商品需要能快速說明送禮理由與儀式感。',
    '企業往來、客戶致意與團隊關係更重視穩定供貨、品牌識別與收禮體驗。',
    '開工、升遷、喬遷與祝賀等時刻，文案、寓意與包裝必須讓祝福一眼可懂。',
    '道謝、打氣、道歉與陪伴不是固定檔期，商品需要承接情緒與關係表達。',
  ],
  growthFormula: ['商品', '流量', '轉換'],
  growthInterpretations: [
    { title: '商品', text: '送禮理由、對象、價格帶、組合、包裝與賀卡。' },
    { title: '流量', text: '平台活動、年度檔期、主題策展、品牌週與站內版位。' },
    { title: '轉換', text: '首圖、標題、商品頁、優惠、加價購與收禮選擇。' },
  ] satisfies OfficialInterpretation[],
  platformDirections: ['更好逛', '更心動', '更好送'],
  platformDirectionInterpretations: [
    '整理商品分類、價格帶與送禮對象，讓送禮者更快找到合適選項。',
    '用首圖、文案、包裝與組合說清楚商品值得被送出的理由。',
    '檢查收禮流程、配送資訊與可選項目，降低送出前後的不確定感。',
  ],
  disclaimer:
    '資料來源：《2026 LINE 禮物資訊分享》。G9G／盛澄策略顧問非 LINE 官方或官方代理商；本頁將官方資料、營運解讀與 G9G 服務分開呈現。',
} as const

export function getFeaturedOfficialStats(): OfficialStat[] {
  const [users, gifts, age2044] = lineGiftOfficialContent.stats
  return [
    users,
    gifts,
    age2044,
    { id: 'scenes', value: '四大場景', label: '儀式、商務、吉時、情緒' },
  ]
}

export function readOfficialStats(value: unknown): OfficialStat[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is OfficialStat => {
    if (!item || typeof item !== 'object') return false
    const candidate = item as Record<string, unknown>
    return typeof candidate.id === 'string' && typeof candidate.value === 'string' && typeof candidate.label === 'string'
  })
}

export function readOfficialStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export function readOfficialInterpretations(value: unknown): OfficialInterpretation[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is OfficialInterpretation => {
    if (!item || typeof item !== 'object') return false
    const candidate = item as Record<string, unknown>
    return typeof candidate.title === 'string' && typeof candidate.text === 'string'
  })
}

function hasExactStats(actual: readonly OfficialStat[], expected: readonly OfficialStat[]) {
  return actual.length === expected.length && actual.every((item, index) => {
    const approved = expected[index]
    return item.id === approved.id && item.value === approved.value && item.label === approved.label
  })
}

function hasExactStrings(actual: readonly string[], expected: readonly string[]) {
  return actual.length === expected.length && actual.every((item, index) => item === expected[index])
}

export function parseLineGiftOfficialFields(value: Record<string, unknown>): LineGiftOfficialFields | null {
  const featuredStats = readOfficialStats(value.featuredStats)
  const stats = readOfficialStats(value.stats)
  const scenes = readOfficialStrings(value.scenes)
  const sceneInterpretations = readOfficialStrings(value.sceneInterpretations)
  const growthFormula = readOfficialStrings(value.growthFormula)
  const growthInterpretations = readOfficialInterpretations(value.growthInterpretations)
  const platformDirections = readOfficialStrings(value.platformDirections)
  const platformDirectionInterpretations = readOfficialStrings(value.platformDirectionInterpretations)
  const approvedFeaturedStats = getFeaturedOfficialStats()

  const valid =
    value.sourceTitle === lineGiftOfficialContent.sourceTitle &&
    value.publicPath === '/about-line-gift' &&
    value.disclaimer === lineGiftOfficialContent.disclaimer &&
    hasExactStats(featuredStats, approvedFeaturedStats) &&
    hasExactStats(stats, lineGiftOfficialContent.stats) &&
    hasExactStrings(scenes, lineGiftOfficialContent.scenes) &&
    sceneInterpretations.length === scenes.length &&
    sceneInterpretations.every(Boolean) &&
    hasExactStrings(growthFormula, lineGiftOfficialContent.growthFormula) &&
    growthInterpretations.length === growthFormula.length &&
    growthInterpretations.every((item, index) => item.title === growthFormula[index] && Boolean(item.text)) &&
    hasExactStrings(platformDirections, lineGiftOfficialContent.platformDirections) &&
    platformDirectionInterpretations.length === platformDirections.length &&
    platformDirectionInterpretations.every(Boolean)

  if (!valid) return null

  return {
    sourceTitle: lineGiftOfficialContent.sourceTitle,
    publicPath: '/about-line-gift',
    featuredStats,
    stats,
    scenes,
    sceneInterpretations,
    growthFormula,
    growthInterpretations,
    platformDirections,
    platformDirectionInterpretations,
    disclaimer: lineGiftOfficialContent.disclaimer,
  }
}
