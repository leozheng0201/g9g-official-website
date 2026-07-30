import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { siteConfig } from '@/content/site'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'G9G｜LINE 禮物品牌成長平台',
    template: '%s｜G9G',
  },
  description: siteConfig.heroDescription,
  applicationName: 'G9G',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'G9G｜LINE 禮物品牌成長平台',
    title: 'G9G｜LINE 禮物品牌成長平台',
    description: siteConfig.heroDescription,
    url: '/',
  },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-Hant-TW" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
