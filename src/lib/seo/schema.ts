import { companyInfo, contactInfo, siteConfig } from '@/content/site'

export function buildOrganizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyInfo.legalName,
    alternateName: siteConfig.name,
    url: siteUrl,
    email: contactInfo.email,
    telephone: contactInfo.phoneLabel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.address,
      addressCountry: 'TW',
    },
    founder: {
      '@type': 'Person',
      name: companyInfo.founderName,
      jobTitle: companyInfo.founderTitle,
    },
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
      description: siteConfig.positioning,
    },
  } as const
}

export function buildWebSiteSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${siteConfig.name}｜${siteConfig.positioning}`,
    url: siteUrl,
    description: siteConfig.heroDescription,
    inLanguage: 'zh-TW',
  } as const
}

export function buildWebPageSchema(
  siteUrl: string,
  page: { name: string; description: string; path: string; datePublished?: string },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.name,
    description: page.description,
    url: new URL(page.path, siteUrl).toString(),
    inLanguage: 'zh-TW',
    ...(page.datePublished ? { datePublished: page.datePublished } : {}),
    isPartOf: {
      '@type': 'WebSite',
      name: `${siteConfig.name}｜${siteConfig.positioning}`,
      url: siteUrl,
    },
  } as const
}

export function buildBreadcrumbSchema(
  siteUrl: string,
  items: readonly { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  } as const
}
