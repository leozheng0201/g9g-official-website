export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-label="G9G LINE 禮物品牌成長平台"
      className="inline-flex items-center gap-3"
    >
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center bg-ink font-black text-paper shadow-brand"
      >
        G9G
      </span>
      {!compact && (
        <span className="grid leading-tight">
          <strong>G9G</strong>
          <small className="text-muted">LINE 禮物品牌成長平台</small>
        </span>
      )}
    </div>
  )
}
