import { LegalDocument } from '@/components/public/legal-document'
import { PageHero } from '@/components/public/page-hero'
import { legalEffectiveDate, termsSections } from '@/content/legal'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '網站使用條款', description: 'G9G 官方網站內容、服務資訊、智慧財產權與責任限制說明。', path: publicRoutes.terms })

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="TERMS" title="網站使用條款" description="說明網站內容、公開服務資訊、智慧財產權與使用者責任。" />
      <LegalDocument effectiveDate={legalEffectiveDate} sections={termsSections} />
    </>
  )
}
