import Link from 'next/link'
import { BrandMark } from '@/components/brand/brand-mark'
import { Container } from '@/components/public/container'
import { MobileNavigation } from '@/components/public/mobile-navigation'
import { LinkButton } from '@/components/ui/link-button'
import { primaryNavigation } from '@/content/navigation'
import { publicRoutes } from '@/lib/routes/public'

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要內容</a>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <Container className="flex min-h-20 items-center justify-between gap-5">
          <BrandMark />
          <nav aria-label="主導覽" className="hidden items-center gap-1 lg:flex">
            {primaryNavigation.map((item) =>
              item.children ? (
                <details key={item.label} className="group relative">
                  <summary className="cursor-pointer list-none rounded-control px-3 py-2 font-bold hover:bg-surface">
                    {item.label}
                  </summary>
                  <div className="absolute left-1/2 top-full mt-3 w-80 -translate-x-1/2 rounded-card border border-line bg-paper p-3 shadow-xl">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="block rounded-control p-3 hover:bg-surface">
                        <strong className="block">{child.label}</strong>
                        <span className="text-sm text-muted">{child.description}</span>
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link key={item.label} href={item.href ?? publicRoutes.home} className="rounded-control px-3 py-2 font-bold hover:bg-surface">
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="hidden lg:block">
            <LinkButton href={publicRoutes.growthAudit}>申請品牌成長健檢</LinkButton>
          </div>
          <MobileNavigation />
        </Container>
      </header>
    </>
  )
}
