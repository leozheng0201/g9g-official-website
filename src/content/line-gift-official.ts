export type OfficialStat = {
  id: string
  value: string
  label: string
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
  growthFormula: ['商品', '流量', '轉換'],
  platformDirections: ['更好逛', '更心動', '更好送'],
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
