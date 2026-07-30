import Link from 'next/link'
import { Container } from '@/components/public/container'
import { LinkButton } from '@/components/ui/link-button'
import { publicRoutes } from '@/lib/routes/public'

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-surface py-20">
      <Container className="text-center">
        <p className="font-black tracking-[.18em] text-gold">404</p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">找不到這個頁面</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">這個網址可能已經調整，請回到首頁、查看服務，或直接申請品牌成長健檢。</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href={publicRoutes.growthAudit}>申請品牌成長健檢</LinkButton>
          <LinkButton href={publicRoutes.home} variant="secondary">回到首頁</LinkButton>
          <Link href={publicRoutes.growthOperations} className="inline-flex min-h-11 items-center px-4 font-bold underline">查看服務方案</Link>
        </div>
      </Container>
    </main>
  )
}
