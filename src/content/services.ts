export const blueprintDeliverables = [
  '品牌現況與通路角色',
  'LINE 禮物適配性',
  '主打商品方向',
  '送禮場景與價格帶',
  '年度檔期規劃',
  '三階段成長路線',
  'KPI 與執行優先順序',
] as const

export const operationsPlans = [
  {
    name: '商城啟動方案',
    price: 'NT$30,000',
    cadence: '一次性',
    description: '進場判斷、商品策略與商城建置，不只是代辦上架。',
    features: ['主打商品與價格帶', '禮盒結構與檔期倒推', '商城開通與後台設定'],
  },
  {
    name: '成果分潤方案',
    price: '完成訂單成交額 35%',
    cadence: '依實際完成訂單計算',
    description: '35% 已包含 LINE 禮物平台抽成與 G9G 營運服務費。',
    features: ['取消與退款訂單不計', '平台年費 NT$12,000 於簽約啟動時代收代繳', '依完成訂單實際成交額結算'],
  },
  {
    name: '全年代營運方案',
    price: 'NT$30,000／月',
    cadence: '合約 12 個月',
    description: '建立全年商品、檔期、版位與數據優化節奏。',
    features: ['月成交額超過 NT$300,000 的部分收取 3.5%', '以折扣後、已完成且扣除退款的訂單計算', '平台年費 NT$12,000 由品牌直接支付平台'],
    recommended: true,
  },
] as const

export const operationsCommonNotes = [
  '廣告預算不包含在服務費內。',
  'LINE 禮物站內版位費由品牌直接支付 LINE 禮物。',
  'G9G 提供站內版位策略、行銷規劃與基本版位素材設計及尺寸延伸。',
  '攝影、進階修圖、影片、全網廣告、CIS 與 SEO 延伸服務另行報價。',
  'G9G 不保證商城核准、特定業績或搜尋排名。',
] as const
