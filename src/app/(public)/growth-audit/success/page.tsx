import type { Metadata } from 'next'
import { Container } from '@/components/public/container'
import { LinkButton } from '@/components/ui/link-button'
import { publicRoutes } from '@/lib/routes/public'

export const metadata: Metadata = {
  title: '申請已送出',
  robots: { index: false, follow: false },
}

export default function GrowthAuditSuccessPage() {
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-line bg-paper p-8 text-center shadow-card sm:p-12">
        <p className="text-sm font-black tracking-[.18em] text-brand-dark">APPLICATION RECEIVED</p>
        <h1 className="mt-4 text-4xl font-black">品牌成長健檢申請已送出</h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          我們已收到你的第一階段資料，並會寄送收件確認信。G9G 預計於 24 小時內確認資料完整度並說明下一步。
        </p>
        <p className="mt-5 rounded-card bg-soft p-4 font-bold">
          送出申請不代表一定通過審核、取得健檢報告或成立合作關係。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href={publicRoutes.home}>返回首頁</LinkButton>
          <LinkButton href={publicRoutes.contact} variant="secondary">聯絡 G9G</LinkButton>
        </div>
      </div>
    </Container>
  )
}
