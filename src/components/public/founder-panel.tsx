import Image from 'next/image'
import { G9GGuideIllustration } from '@/components/brand/g9g-guide-illustration'
import { companyInfo } from '@/content/site'

export function FounderPanel() {
  return (
    <div className="grid items-center gap-8 rounded-[2rem] border border-line bg-surface p-7 sm:p-10 lg:grid-cols-[1.2fr_.8fr]">
      <div>
        <Image
          src="/brand/sheng-cheng-logo.svg"
          alt="盛澄策略顧問 Sheng Cheng Strategy Consulting"
          width={720}
          height={250}
          unoptimized
          className="h-auto w-full max-w-lg"
        />
        <p className="mt-6 text-sm font-bold text-gold">G9G 背後的策略與執行者</p>
        <h3 className="mt-2 text-3xl font-black">{companyInfo.founderName}</h3>
        <p className="text-muted">{companyInfo.founderTitle}</p>
        <p className="mt-5 max-w-2xl text-lg">
          專注品牌策略、電商整合與 LINE 禮物營運，從商品定位、檔期規劃到站內版位，協助品牌把判斷轉成可執行的成長路線。
        </p>
      </div>
      <G9GGuideIllustration className="mx-auto h-auto w-full max-w-xs" />
    </div>
  )
}
