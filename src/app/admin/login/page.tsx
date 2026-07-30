import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'
import { safeNextPath } from '@/lib/auth/redirects'
import {
  signInWithGoogleAction,
  signInWithPasswordAction,
} from './actions'

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string | string[]
    next?: string | string[]
  }>
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams
  const next = safeNextPath(firstValue(params.next))
  const hasError = firstValue(params.error) === 'login_failed'

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-5 py-10">
      <section className="w-full max-w-md rounded-card border border-line bg-paper p-7 shadow-brand">
        <BrandMark />
        <h1 className="mt-8 text-3xl font-black">G9G Admin</h1>
        <p className="mt-2 text-muted">登入後管理 G9G 官方網站與品牌內容。</p>

        {hasError && (
          <p role="alert" className="mt-5 border border-danger p-3 text-danger">
            登入失敗，請確認資料後再試一次。
          </p>
        )}

        <form action={signInWithPasswordAction} className="mt-6 grid gap-4">
          <input type="hidden" name="next" value={next} />
          <label className="grid gap-1 font-bold" htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-h-11 rounded-control border border-line bg-paper px-3 font-normal"
            />
          </label>
          <label className="grid gap-1 font-bold" htmlFor="password">
            密碼
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="min-h-11 rounded-control border border-line bg-paper px-3 font-normal"
            />
          </label>
          <Button type="submit" className="mt-2 w-full">
            登入
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-sm text-muted" aria-hidden="true">
          <span className="h-px flex-1 bg-line" />
          或
          <span className="h-px flex-1 bg-line" />
        </div>

        <form action={signInWithGoogleAction}>
          <input type="hidden" name="next" value={next} />
          <Button type="submit" variant="secondary" className="w-full">
            使用 Google 登入
          </Button>
        </form>
      </section>
    </main>
  )
}
