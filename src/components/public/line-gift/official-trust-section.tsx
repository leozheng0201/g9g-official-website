import Link from 'next/link'

import { Container } from '@/components/public/container'
import { SectionHeading } from '@/components/public/section-heading'
import type { OfficialStat } from '@/lib/cms/types'
import { publicRoutes } from '@/lib/routes/public'

export function OfficialTrustSection({
  sourceTitle,
  stats,
}: {
  sourceTitle: string
  stats: readonly OfficialStat[]
}) {
  return (
    <section className="bg-soft py-16 sm:py-20" id="line-gift-market">
      <Container>
        <SectionHeading
          eyebrow="LINE 禮物官方資料"
          title="先看懂市場，再決定品牌要怎麼進場。"
          description="以下為《2026 LINE 禮物資訊分享》中的核准資訊；G9G 的營運解讀與服務建議會另外標示。"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <article key={item.id} className="rounded-card border border-line bg-paper p-6">
              <p className="text-3xl font-black">{item.value}</p>
              <p className="mt-2 text-sm text-muted">{item.label}</p>
            </article>
          ))}
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">資料來源：{sourceTitle}</p>
          <Link
            href={publicRoutes.aboutLineGift}
            className="font-bold underline decoration-brand decoration-4 underline-offset-4"
          >
            完整認識 LINE 禮物
          </Link>
        </div>
      </Container>
    </section>
  )
}
