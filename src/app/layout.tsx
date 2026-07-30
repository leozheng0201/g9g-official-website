import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'G9G｜LINE 禮物品牌成長平台',
  description: '讓品牌成長，不只是把商品上架。',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  )
}
