import Link from 'next/link'

export type ContentListItem = {
  id: string
  content_type: string
  article_subtype?: string | null
  title: string
  slug: string
  status: string
  updated_at: string
}

const statusLabels: Record<string, string> = {
  draft: '草稿', in_review: '待審', changes_requested: '退回修改', approved: '已核准', scheduled: '已排程', published: '已發布', unpublished: '已下架', trashed: '垃圾桶',
}

export function ContentList({ items }: { items: ContentListItem[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white">
      <table className="w-full min-w-[720px] text-left">
        <thead className="bg-paper"><tr><th className="p-4">標題</th><th className="p-4">類型</th><th className="p-4">狀態</th><th className="p-4">最後更新</th><th className="p-4">操作</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id} className="border-t border-line"><td className="p-4 font-bold">{item.title}<p className="mt-1 text-xs font-normal text-muted">/{item.slug}</p></td><td className="p-4 text-sm">{item.article_subtype ?? item.content_type}</td><td className="p-4"><span className="rounded-full bg-paper px-3 py-1 text-xs font-bold">{statusLabels[item.status] ?? item.status}</span></td><td className="p-4 text-sm text-muted">{new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.updated_at))}</td><td className="p-4"><Link href={`/admin/content/${item.content_type}/${item.id}`} className="font-bold text-brand">編輯</Link></td></tr>)}</tbody>
      </table>
      {items.length === 0 ? <p className="p-8 text-center text-muted">目前沒有符合條件的內容。</p> : null}
    </div>
  )
}
