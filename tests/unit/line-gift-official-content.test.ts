import { describe, expect, it } from 'vitest'

import {
  getFeaturedOfficialStats,
  lineGiftOfficialContent,
} from '@/content/line-gift-official'

describe('LINE Gift official content contract', () => {
  it('keeps every approved official statistic exactly sourced', () => {
    expect(lineGiftOfficialContent.sourceTitle).toBe('2026 LINE 禮物資訊分享')
    expect(lineGiftOfficialContent.stats).toEqual([
      { id: 'users', value: '900 萬以上', label: 'LINE 禮物用戶' },
      { id: 'gifts', value: '8,000 萬以上', label: '2021–2025 累積送禮份數' },
      { id: 'age-20-44', value: '超過八成', label: '20–44 歲用戶占比' },
      { id: 'under-34', value: '超過 55%', label: '34 歲以下族群' },
      { id: 'gender', value: '女性約 60%／男性約 40%', label: '用戶性別比例' },
    ])
  })

  it('preserves the official social gifting scene order', () => {
    expect(lineGiftOfficialContent.scenes).toEqual([
      '儀式禮物',
      '商務禮物',
      '吉時禮物',
      '情緒禮物',
    ])
  })

  it('preserves the official growth formula and 2026 directions', () => {
    expect(lineGiftOfficialContent.growthFormula).toEqual(['商品', '流量', '轉換'])
    expect(lineGiftOfficialContent.platformDirections).toEqual([
      '更好逛',
      '更心動',
      '更好送',
    ])
  })

  it('keeps the required source and non-official disclaimer', () => {
    expect(lineGiftOfficialContent.disclaimer).toBe(
      '資料來源：《2026 LINE 禮物資訊分享》。G9G／盛澄策略顧問非 LINE 官方或官方代理商；本頁將官方資料、營運解讀與 G9G 服務分開呈現。',
    )
  })

  it('returns only the four approved homepage trust signals', () => {
    expect(getFeaturedOfficialStats()).toEqual([
      { id: 'users', value: '900 萬以上', label: 'LINE 禮物用戶' },
      { id: 'gifts', value: '8,000 萬以上', label: '2021–2025 累積送禮份數' },
      { id: 'age-20-44', value: '超過八成', label: '20–44 歲用戶占比' },
      { id: 'scenes', value: '四大場景', label: '儀式、商務、吉時、情緒' },
    ])
  })

  it('does not contain forbidden public identifiers or unapproved free claims', () => {
    const serialized = JSON.stringify(lineGiftOfficialContent)
    expect(serialized).not.toContain('scrutator')
    expect(serialized).not.toContain('免費品牌健檢')
  })
})
