type SourceLabelProps = {
  kind: 'official' | 'interpretation' | 'support'
}

const labels = {
  official: 'LINE 禮物官方資料',
  interpretation: '老莊營運解讀',
  support: 'G9G 可以怎麼協助',
} as const

export function SourceLabel({ kind }: SourceLabelProps) {
  return (
    <span className="inline-flex rounded-full border border-line bg-paper px-3 py-1 text-xs font-black tracking-wide text-muted">
      {labels[kind]}
    </span>
  )
}
