const scenes = ['情緒', '儀式', '商務', '吉時'] as const
const pillars = ['商品', '流量', '轉換'] as const

export function HeroStrategyBoard() {
  return (
    <div aria-label="G9G 送禮場景與成長策略" className="relative mx-auto w-full max-w-xl">
      <div className="rounded-[2rem] border border-line bg-surface p-5 shadow-[0_24px_60px_rgba(36,41,37,.10)] sm:p-7">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <span className="text-xs font-bold tracking-[.16em] text-muted">GIFT STRATEGY</span>
            <h2 className="mt-1 text-xl font-black">把商品放進對的送禮時刻</h2>
          </div>
          <span className="rounded-full bg-brand px-3 py-1 text-sm font-black">LINE 禮物</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {scenes.map((scene, index) => (
            <div key={scene} className="rounded-card border border-line bg-paper p-4">
              <span className="text-xs text-muted">0{index + 1}</span>
              <strong className="mt-6 block text-2xl">{scene}</strong>
              <span className="text-sm text-muted">送禮場景</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 rounded-card border border-gold/40 bg-paper p-4 text-center">
          {pillars.map((pillar, index) => (
            <div key={pillar} className="contents">
              <strong className="flex-1 text-lg">{pillar}</strong>
              {index < pillars.length - 1 && <span className="text-gold">×</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-4 -right-2 rounded-card border border-brand-dark bg-brand px-4 py-3 text-sm font-bold shadow-control sm:right-5">
        先判斷，再談合作
      </div>
    </div>
  )
}
