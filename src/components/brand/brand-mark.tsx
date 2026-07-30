import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export function BrandMark({
  compact = false,
  className,
}: {
  compact?: boolean
  className?: string
}) {
  return (
    <Link
      href="/"
      aria-label="G9G LINE 禮物品牌成長平台"
      className={cn(
        'inline-flex items-center gap-3 rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-control bg-ink font-black tracking-tight text-paper shadow-brand"
      >
        G9G
      </span>
      {!compact && (
        <span className="grid leading-tight">
          <strong className="tracking-wide">G9G</strong>
          <small className="text-muted">LINE 禮物品牌成長平台</small>
        </span>
      )}
    </Link>
  )
}
