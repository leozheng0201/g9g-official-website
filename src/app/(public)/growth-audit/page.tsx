import { AuditPreviewForm } from '@/components/public/audit-preview-form'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { ProcessStep } from '@/components/public/content-cards'
import { Container } from '@/components/public/container'
import { PageHero } from '@/components/public/page-hero'
import { SectionHeading } from '@/components/public/section-heading'
import { processSteps } from '@/content/home'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '品牌成長健檢', description: '先判斷品牌在 LINE 禮物的適配性、問題與準備方向，再談後續合作。', path: publicRoutes.growthAudit })

export default function GrowthAuditPage() {
  return (
    <>
      <PageHero eyebrow="BRAND GROWTH AUDIT" title="品牌成長健檢" description="先判斷，再談合作。提交第一階段資料後，G9G 於 24 小時內聯繫並說明下一步。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '品牌成長健檢' }]} />
        <SectionHeading title="不是每個品牌現在都適合進場，也不是每個問題都需要代營運。" description="初步審核後，可能進入詳細問卷、30 分鐘線上說明與 PDF 品牌成長健檢報告；申請不代表保證承接或合作。" />
        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map(([number, title, description]) => <ProcessStep key={number} number={number} title={title} description={description} />)}
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-black">第一階段申請</h2>
            <p className="mt-4 text-muted">只需要聯絡人、品牌、手機、Email 與品牌連結。詳細營運資料會在初步判斷後再提供問卷。</p>
            <p className="mt-5 rounded-card bg-soft p-4 font-bold">目前為前台 Preview；表單只檢查欄位，不會送出或儲存資料。</p>
          </div>
          <AuditPreviewForm />
        </div>
      </Container>
    </>
  )
}
