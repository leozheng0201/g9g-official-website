import { deleteMediaAction, updateMediaAction, uploadMediaAction } from '@/app/admin/media/actions'
import { requireCmsUser } from '@/lib/cms/auth'
import { createServiceRoleSupabaseClient } from '@/lib/supabase/service-role'

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { role } = await requireCmsUser()
  const { q = '' } = await searchParams
  const client = createServiceRoleSupabaseClient()
  let query = client.from('media_assets').select('*').is('deleted_at', null).order('created_at', { ascending: false }).limit(100)
  if (q.trim()) query = query.ilike('original_filename', `%${q.trim()}%`)
  const { data, error } = await query
  if (error) throw error

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black tracking-[0.16em] text-brand">CMS</p><h1 className="mt-2 text-3xl font-black">媒體庫</h1></div><a href="/admin/content" className="font-bold text-brand">返回內容總覽</a></div>
      <form action={uploadMediaAction} className="mt-8 grid gap-4 rounded-card border border-line bg-paper p-6 sm:grid-cols-[1fr_1fr_auto]">
        <label className="font-bold">檔案<input name="file" type="file" required className="mt-2 block w-full" /></label>
        <label className="font-bold">圖片替代文字<input name="altText" className="mt-2 w-full rounded border border-line p-3 font-normal" /></label>
        <button className="self-end rounded-full bg-brand px-5 py-3 font-bold text-white">上傳</button>
      </form>
      <form className="mt-6"><input name="q" defaultValue={q} placeholder="搜尋檔名" className="w-full max-w-md rounded border border-line p-3" /></form>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {(data ?? []).map((asset) => (
          <article key={asset.id} className="rounded-card border border-line bg-white p-5">
            <p className="break-all font-bold">{asset.original_filename}</p><p className="mt-1 text-xs text-muted">{asset.mime_type}・{Math.round(Number(asset.file_size) / 1024)} KB</p>
            <form action={updateMediaAction} className="mt-4 space-y-3"><input type="hidden" name="id" value={asset.id} /><input name="altText" defaultValue={asset.alt_text ?? ''} placeholder="alt" className="w-full rounded border border-line p-2" /><input name="title" defaultValue={asset.title ?? ''} placeholder="標題" className="w-full rounded border border-line p-2" /><textarea name="description" defaultValue={asset.description ?? ''} placeholder="說明" className="w-full rounded border border-line p-2" /><button className="rounded border px-4 py-2 font-bold">儲存資訊</button></form>
            {role !== 'marketing' ? <form action={deleteMediaAction} className="mt-3"><input type="hidden" name="id" value={asset.id} /><button className="text-sm font-bold text-red-700">刪除未使用素材</button></form> : null}
          </article>
        ))}
      </div>
    </main>
  )
}
