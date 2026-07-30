import { LegalDocument } from '@/components/public/legal-document'
import { PageHero } from '@/components/public/page-hero'
import { legalEffectiveDate, privacySections } from '@/content/legal'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '隱私權政策', description: 'G9G 官方網站個人資料蒐集、使用、保存與權利說明。', path: publicRoutes.privacy })

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="PRIVACY" title="隱私權政策" description="說明 G9G 官方網站如何蒐集、使用、保存與保護品牌合作聯絡資料。" />
      <LegalDocument effectiveDate={legalEffectiveDate} sections={privacySections} />
    </>
  )
}
