import Link from 'next/link'
import { BrandMark } from '@/components/brand/brand-mark'
import { Container } from '@/components/public/container'
import { contactInfo, companyInfo, siteConfig } from '@/content/site'
import { footerNavigation } from '@/content/navigation'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface pb-24 pt-14 lg:pb-10">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-md text-muted">{siteConfig.heroDescription}</p>
            <div className="mt-6 text-sm">
              <strong className="block">{companyInfo.legalName}</strong>
              <span className="text-muted">{companyInfo.englishName}</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-black">聯絡 G9G</h2>
            <address className="mt-4 grid gap-2 not-italic text-sm">
              <a href={contactInfo.phoneHref}>{contactInfo.phoneLabel}</a>
              <a href={contactInfo.emailHref}>{contactInfo.email}</a>
              <a href={contactInfo.lineUrl} target="_blank" rel="noreferrer">
                {contactInfo.lineLabel}<span className="sr-only">（另開新視窗）</span>
              </a>
              <span>{companyInfo.address}</span>
              <span>{companyInfo.transit}</span>
              <span>統一編號 {companyInfo.taxId}</span>
            </address>
          </div>
          <div>
            <h2 className="text-lg font-black">網站導覽</h2>
            <nav aria-label="頁尾導覽" className="mt-4">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {footerNavigation.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:underline">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs text-muted">
          © {new Date().getFullYear()} G9G / {companyInfo.legalName}. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
