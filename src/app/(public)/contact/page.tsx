import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { ContactMethods } from '@/components/public/contact-methods'
import { Container } from '@/components/public/container'
import { PageHero } from '@/components/public/page-hero'
import { LinkButton } from '@/components/ui/link-button'
import { companyInfo } from '@/content/site'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '聯絡我們', description: '透過品牌成長健檢、電話、Email 或 LINE 與 G9G 聯絡。', path: publicRoutes.contact })

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="CONTACT" title="聯絡我們" description="品牌合作先從品牌成長健檢開始；也可以透過電話、Email 或 LINE 聯絡 G9G。" primaryAction={{ label: '申請品牌成長健檢', href: publicRoutes.growthAudit }} />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '聯絡我們' }]} />
        <ContactMethods />
        <section className="mt-12 rounded-card border border-line bg-surface p-7">
          <h2 className="text-2xl font-black">公司資訊</h2>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-muted">公司名稱</dt><dd className="font-bold">{companyInfo.legalName}</dd></div>
            <div><dt className="text-muted">英文名稱</dt><dd className="font-bold">{companyInfo.englishName}</dd></div>
            <div><dt className="text-muted">創辦人暨執行總監</dt><dd className="font-bold">莊又丞</dd></div>
            <div><dt className="text-muted">統一編號</dt><dd className="font-bold">{companyInfo.taxId}</dd></div>
          </dl>
          <p className="mt-6 text-muted">LINE、電話與 Email 主要提供品牌合作、LINE 禮物代營運與電商成長相關詢問。</p>
          <LinkButton href={publicRoutes.growthAudit} className="mt-6">申請品牌成長健檢</LinkButton>
        </section>
      </Container>
    </>
  )
}
