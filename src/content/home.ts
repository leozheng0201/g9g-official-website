import { publicRoutes } from '@/lib/routes/public'

export const painPoints = [
  { title: '還在準備，市場已經先走了', description: '看著同業進入 LINE 禮物，品牌仍停在查資料、問流程與等待內部共識。' },
  { title: '已經上架，卻沒有成交理由', description: '商品有人看，但頁面沒有對送禮者說清楚：為什麼現在要送、適合送給誰。' },
  { title: '一年只靠兩個大檔期', description: '過年、中秋很忙，其他月份缺少生日、感謝、打氣、商務與吉時等常態需求。' },
] as const

export const growthPillars = [
  { title: '商品', description: '主打品、價格帶、禮盒結構、包裝與服務。' },
  { title: '流量', description: '站內版位、年度檔期、品牌週與活動節奏。' },
  { title: '轉換', description: '送禮理由、祝福賀卡、商品組合與優惠機制。' },
] as const

export const giftScenes = [
  { title: '情緒', description: '打氣、感謝、道歉與關心，讓商品承接沒說出口的心意。' },
  { title: '儀式', description: '生日、紀念日、節慶與人生節點，讓送禮成為關係中的儀式。' },
  { title: '商務', description: '客戶、同事、夥伴與企業贈禮，兼顧體面、效率與品牌印象。' },
  { title: '吉時', description: '開運、入厝、升遷、開幕與祝賀，回應明確時機與祝福需求。' },
] as const

export const growthServices = [
  { title: '品牌成長健檢', description: '先判斷品牌適配性、關鍵問題與優先順序。', href: publicRoutes.growthAudit, actionLabel: '了解健檢流程', items: ['申請制', '30 分鐘線上說明', '品牌成長健檢報告'] },
  { title: '品牌成長藍圖', description: '把判斷整理成商品、場景、檔期與 KPI 的三階段路線。', href: publicRoutes.growthBlueprint, actionLabel: '查看藍圖內容', items: ['通路角色', '主打商品', '年度檔期與 KPI'] },
  { title: '品牌成長代營運', description: '把商品、檔期、版位、客服與數據優化實際落地。', href: publicRoutes.growthOperations, actionLabel: '查看完整方案', items: ['商城啟動', '成果分潤', '全年代營運'] },
] as const

export const processSteps = [
  ['01', '提交品牌成長健檢', '先提供品牌與現況的基本資料。'],
  ['02', '初步判斷與聯繫', 'G9G 於 24 小時內聯繫並確認下一步。'],
  ['03', '詳細問卷與資料整理', '通過初步審核後，再補充商品、通路與營運資料。'],
  ['04', '30 分鐘線上說明', '說明關鍵問題、機會與優先順序。'],
  ['05', '品牌成長健檢報告', '整理適配性、問題與可行的準備方向。'],
  ['06', '進入藍圖或代營運', '適合者再討論策略規劃或長期落地合作。'],
] as const

export const contentEntries = [
  { title: 'LINE 禮物研究院', description: '從平台、用戶、場景到營運實戰，建立品牌的送禮知識庫。', href: publicRoutes.academy },
  { title: '品牌觀點', description: '分享品牌策略、商品規劃、電商與行銷判斷。', href: publicRoutes.insights },
  { title: '品牌資源中心', description: '整理檔期、上架、商品與送禮場景的實用資源。', href: publicRoutes.resources },
] as const
