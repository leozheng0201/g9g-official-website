import type { Metadata } from 'next'

export type PageMetadataInput = {
  title: string
  description: string
  path: string
  noIndex?: boolean
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      title: `${title}｜G9G`,
      description,
      url: path,
      siteName: 'G9G｜LINE 禮物品牌成長平台',
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}
