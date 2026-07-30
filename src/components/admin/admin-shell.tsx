import Link from 'next/link'
import { BrandMark } from '@/components/brand/brand-mark'
import type { AppRole } from '@/lib/auth/roles'

type AdminShellProps = {
  children: React.ReactNode
  email: string
  roles: AppRole[]
}

export function AdminShell({ children, email, roles }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b border-line bg-paper px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <BrandMark compact />
          <div className="text-right text-sm">
            <strong className="block">{email}</strong>
            <span className="text-muted">{roles.join('、')}</span>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-card border border-line bg-paper p-4">
          <nav aria-label="後台主導覽">
            <Link href="/admin" className="block rounded-control bg-surface px-3 py-2 font-bold">
              Dashboard
            </Link>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
