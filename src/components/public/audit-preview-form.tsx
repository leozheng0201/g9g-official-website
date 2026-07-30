'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { publicRoutes } from '@/lib/routes/public'

export type GrowthAuditFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> }

export type GrowthAuditFormAction = (
  previousState: GrowthAuditFormState,
  formData: FormData,
) => Promise<GrowthAuditFormState>

const fields = [
  { name: 'contactName', label: '聯絡人姓名', type: 'text', autoComplete: 'name' },
  { name: 'brandName', label: '品牌名稱', type: 'text', autoComplete: 'organization' },
  { name: 'phone', label: '手機', type: 'tel', autoComplete: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'brandUrl', label: '品牌連結', type: 'url', autoComplete: 'url' },
] as const

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="mt-6 w-full sm:w-auto">
      {pending ? '送出中…' : '送出品牌成長健檢申請'}
    </Button>
  )
}

export function AuditPreviewForm({ action }: { action: GrowthAuditFormAction }) {
  const [state, formAction] = useActionState(action, { status: 'idle' } as GrowthAuditFormState)
  const errors = state.status === 'error' ? (state.fieldErrors ?? {}) : {}

  return (
    <form action={formAction} className="rounded-[2rem] border border-line bg-paper p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name]
          return (
            <div key={field.name} className={field.name === 'brandUrl' ? 'sm:col-span-2' : ''}>
              <label htmlFor={field.name} className="mb-2 block font-bold">{field.label}</label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${field.name}-error` : undefined}
                className="min-h-12 w-full rounded-control border border-line bg-paper px-4 focus:border-ink"
              />
              {error && <p id={`${field.name}-error`} className="mt-2 text-sm text-danger">{error}</p>}
            </div>
          )
        })}
      </div>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">網站</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="mt-5">
        <label className="flex items-start gap-3">
          <input
            name="privacyAccepted"
            type="checkbox"
            required
            className="mt-1 size-5"
            aria-describedby={errors.privacyAccepted ? 'privacy-error' : undefined}
          />
          <span>我已閱讀並同意<Link href={publicRoutes.privacy} className="font-bold underline">隱私權政策</Link>。</span>
        </label>
        {errors.privacyAccepted && <p id="privacy-error" className="mt-2 text-sm text-danger">{errors.privacyAccepted}</p>}
      </div>
      <SubmitButton />
      {state.status === 'error' && (
        <p role="alert" className="mt-5 rounded-card border border-danger bg-paper p-4 font-bold text-danger">
          {state.message}
        </p>
      )}
    </form>
  )
}
