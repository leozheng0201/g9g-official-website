import { publicRoutes, type PublicRoute } from '@/lib/routes/public'

export type NavigationChild = {
  label: string
  href: PublicRoute
  description: string
}

export type NavigationItem = {
  label: string
  href?: PublicRoute
  children?: readonly NavigationChild[]
}

export const primaryNavigation: readonly NavigationItem[] = [
  { label: '關於 G9G', href: publicRoutes.about },
  {
    label: '品牌成長',
    children: [
      {
        label: '品牌成長健檢',
        href: publicRoutes.growthAudit,
        description: '先判斷，再談合作。',
      },
      {
        label: '品牌成長藍圖',
        href: publicRoutes.growthBlueprint,
        description: '把判斷整理成可執行的成長路線。',
      },
      {
        label: '品牌成長代營運',
        href: publicRoutes.growthOperations,
        description: '把商品、檔期、版位與營運落地。',
      },
    ],
  },
  { label: 'LINE 禮物研究院', href: publicRoutes.academy },
  { label: '品牌成長案例', href: publicRoutes.cases },
  { label: '品牌觀點', href: publicRoutes.insights },
  { label: '品牌資源', href: publicRoutes.resources },
  { label: '聯絡我們', href: publicRoutes.contact },
]

export const footerNavigation = [
  { label: '品牌成長健檢', href: publicRoutes.growthAudit },
  { label: '品牌成長藍圖', href: publicRoutes.growthBlueprint },
  { label: '品牌成長代營運', href: publicRoutes.growthOperations },
  { label: 'LINE 禮物研究院', href: publicRoutes.academy },
  { label: '品牌成長案例', href: publicRoutes.cases },
  { label: '品牌觀點', href: publicRoutes.insights },
  { label: '常見問題', href: publicRoutes.faq },
  { label: '品牌資源中心', href: publicRoutes.resources },
  { label: '聯絡我們', href: publicRoutes.contact },
  { label: '隱私權政策', href: publicRoutes.privacy },
  { label: '網站使用條款', href: publicRoutes.terms },
] as const
