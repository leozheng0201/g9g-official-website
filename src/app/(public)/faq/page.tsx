import { Accordion } from '@/components/public/accordion'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { faqItems } from '@/content/faq'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '常見問題', description: 'LINE 禮物進駐、商品、費用、版位與 G9G 合作流程常見問題。', path: publicRoutes.faq })

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="常見問題" description="先把平台、費用、合作與品牌成長健檢常見問題說清楚。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '常見問題' }]} />
        <div className="mx-auto max-w-4xl"><Accordion items={faqItems} /></div>
      </Container>
      <CtaBand title="FAQ 沒有回答到你的品牌狀況？" />
    </>
  )
}
