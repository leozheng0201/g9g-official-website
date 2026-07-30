import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/public/site-footer'
import { SiteHeader } from '@/components/public/site-header'
import { LinkButton } from '@/components/ui/link-button'
import { publicRoutes } from '@/lib/routes/public'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-3 backdrop-blur lg:hidden">
        <LinkButton href={publicRoutes.growthAudit} className="w-full">申請品牌成長健檢</LinkButton>
      </div>
    </div>
  )
}
