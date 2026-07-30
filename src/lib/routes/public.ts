export const publicRoutes = {
  home: '/',
  about: '/about',
  whyG9g: '/why-g9g',
  growthAudit: '/growth-audit',
  growthBlueprint: '/growth-blueprint',
  growthOperations: '/growth-operations',
  academy: '/line-gift-academy',
  cases: '/cases',
  insights: '/insights',
  faq: '/faq',
  resources: '/resources',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
} as const

export type PublicRoute = (typeof publicRoutes)[keyof typeof publicRoutes]

export const indexablePublicRoutes: readonly PublicRoute[] = Object.values(publicRoutes)
