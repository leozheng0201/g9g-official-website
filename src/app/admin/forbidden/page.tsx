import Link from 'next/link'

export default function AdminForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-5">
      <section className="max-w-lg rounded-card border border-line bg-paper p-8 text-center">
        <p className="font-bold text-danger">沒有操作權限</p>
        <h1 className="mt-2 text-3xl font-black">此帳號尚未取得 G9G Admin 角色</h1>
        <p className="mt-4 text-muted">請聯絡系統管理員確認帳號與權限設定。</p>
        <Link href="/" className="mt-6 inline-flex font-bold underline underline-offset-4">
          返回官網
        </Link>
      </section>
    </main>
  )
}
