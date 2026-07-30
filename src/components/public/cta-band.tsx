import { Container } from '@/components/public/container'
import { LinkButton } from '@/components/ui/link-button'
import { publicRoutes } from '@/lib/routes/public'

export function CtaBand({
  title = '先判斷品牌現在的位置，再決定下一步。',
  description = '提交第一階段資料，G9G 將在 24 小時內聯繫並說明後續流程。',
}: {
  title?: string
  description?: string
}) {
  return (
    <section className="border-y border-line bg-brand py-14">
      <Container className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-3xl font-black">{title}</h2>
          <p className="mt-2 max-w-2xl">{description}</p>
        </div>
        <LinkButton href={publicRoutes.growthAudit} variant="secondary">申請品牌成長健檢</LinkButton>
      </Container>
    </section>
  )
}
