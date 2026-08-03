import {
  approveContentAction,
  createPreviewAction,
  publishContentAction,
  requestChangesAction,
  revokePreviewAction,
  scheduleContentAction,
  submitReviewAction,
  trashContentAction,
  unpublishContentAction,
  withdrawReviewAction,
} from '@/app/admin/content/actions'
import type { CmsRole } from '@/lib/cms/auth'

export function WorkflowPanel({ id, status, role }: { id: string; status: string; role: CmsRole }) {
  const publisher = role === 'super_admin' || role === 'editor'
  return (
    <aside className="rounded-card border border-line bg-paper p-5">
      <h2 className="text-lg font-black">發布流程</h2><p className="mt-2 text-sm text-muted">目前狀態：{status}</p>
      <div className="mt-5 space-y-3">
        {['draft', 'changes_requested', 'unpublished'].includes(status) ? <form action={submitReviewAction}><input type="hidden" name="id" value={id} /><button className="w-full rounded bg-brand px-4 py-2 font-bold text-white">送審</button></form> : null}
        {status === 'in_review' ? <form action={withdrawReviewAction}><input type="hidden" name="id" value={id} /><button className="w-full rounded border px-4 py-2 font-bold">撤回送審</button></form> : null}
        {status === 'in_review' && publisher ? <><form action={approveContentAction}><input type="hidden" name="id" value={id} /><button className="w-full rounded bg-brand px-4 py-2 font-bold text-white">核准</button></form><form action={requestChangesAction} className="space-y-2"><input type="hidden" name="id" value={id} /><textarea name="reason" required placeholder="退回原因" className="w-full rounded border border-line p-2" /><button className="w-full rounded border border-red-300 px-4 py-2 font-bold text-red-700">退回修改</button></form></> : null}
        {status === 'approved' && publisher ? <><form action={publishContentAction}><input type="hidden" name="id" value={id} /><button className="w-full rounded bg-brand px-4 py-2 font-bold text-white">立即發布</button></form><form action={scheduleContentAction} className="space-y-2"><input type="hidden" name="id" value={id} /><input name="scheduledPublishAt" type="datetime-local" required className="w-full rounded border border-line p-2" /><input name="scheduledUnpublishAt" type="datetime-local" className="w-full rounded border border-line p-2" /><button className="w-full rounded border px-4 py-2 font-bold">設定排程</button></form></> : null}
        {status === 'published' && publisher ? <form action={unpublishContentAction}><input type="hidden" name="id" value={id} /><button className="w-full rounded border px-4 py-2 font-bold">下架</button></form> : null}
        <form action={createPreviewAction}><input type="hidden" name="id" value={id} /><button className="w-full rounded border px-4 py-2 font-bold">建立 60 分鐘預覽</button></form>
        <form action={revokePreviewAction}><input type="hidden" name="id" value={id} /><button className="w-full rounded border px-4 py-2 font-bold">撤銷有效預覽</button></form>
        {role !== 'marketing' && status !== 'trashed' ? <form action={trashContentAction}><input type="hidden" name="id" value={id} /><button className="w-full rounded border border-red-300 px-4 py-2 font-bold text-red-700">移到垃圾桶</button></form> : null}
      </div>
    </aside>
  )
}
