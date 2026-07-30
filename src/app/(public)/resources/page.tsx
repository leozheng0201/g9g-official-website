import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Container } from '@/components/public/container'
import { CtaBand } from '@/components/public/cta-band'
import { PageHero } from '@/components/public/page-hero'
import { resourceTypes } from '@/content/content-centers'
import { publicRoutes } from '@/lib/routes/public'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({ title: '品牌資源中心', description: 'LINE 禮物檔期、上架、商品規劃與送禮場景的實用資源入口。', path: publicRoutes.resources })

export default function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow="BRAND RESOURCES" title="品牌資源中心" description="把品牌常用的檔期、上架、商品與送禮規劃工具整理在同一個地方。" />
      <Container className="py-16 sm:py-20">
        <Breadcrumbs items={[{ label: '品牌資源中心' }]} />
        <p className="max-w-3xl text-lg text-muted">V2.0 先建立公開內容與檔案入口；資料完成前不顯示假下載按鈕。</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceTypes.map((resource) => <article key={resource} className="rounded-card border border-line bg-surface p-6"><h2 className="text-xl font-black">{resource}</h2><p className="mt-3 text-sm text-muted">內容製作與版本確認中。</p></article>)}
        </div>
      </Container>
      <CtaBand title="需要先處理品牌現在的問題？" />
    </>
  )
}
