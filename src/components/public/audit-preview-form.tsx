'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { growthAuditPreviewSchema } from '@/lib/validation/growth-audit-preview'
import { publicRoutes } from '@/lib/routes/public'

const fields = [
  { name: 'contactName', label: '聯絡人姓名', type: 'text', autoComplete: 'name' },
  { name: 'brandName', label: '品牌名稱', type: 'text', autoComplete: 'organization' },
  { name: 'phone', label: '手機', type: 'tel', autoComplete: 'tel' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'brandUrl', label: '品牌連結', type: 'url', autoComplete: 'url' },
] as const

export function AuditPreviewForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [validPreview, setValidPreview] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidPreview(false)
    const form = event.currentTarget
    const data = new FormData(form)
    const result = growthAuditPreviewSchema.safeParse({
      contactName: data.get('contactName'),
      brandName: data.get('brandName'),
      phone: data.get('phone'),
      email: data.get('email'),
      brandUrl: data.get('brandUrl'),
      privacyAccepted: data.get('privacyAccepted') === 'on',
      website: data.get('website') ?? '',
    })

    if (!result.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? 'form')
        nextErrors[key] ??= issue.message
      }
      setErrors(nextErrors)
      const firstKey = Object.keys(nextErrors)[0]
      const firstField = form.elements.namedItem(firstKey)
      if (firstField instanceof HTMLElement) firstField.focus()
      return
    }

    setErrors({})
    setValidPreview(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-[2rem] border border-line bg-paper p-6 sm:p-8">
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
          <input name="privacyAccepted" type="checkbox" className="mt-1 size-5" aria-describedby={errors.privacyAccepted ? 'privacy-error' : undefined} />
          <span>我已閱讀並同意<Link href={publicRoutes.privacy} className="font-bold underline">隱私權政策</Link>。</span>
        </label>
        {errors.privacyAccepted && <p id="privacy-error" className="mt-2 text-sm text-danger">{errors.privacyAccepted}</p>}
      </div>
      <Button type="submit" className="mt-6 w-full sm:w-auto">檢查申請資料</Button>
      {validPreview && (
        <p role="status" className="mt-5 rounded-card border border-brand-dark bg-soft p-4 font-bold">
          目前為 Preview，申請資料尚未送出或儲存。正式送出功能將在品牌成長健檢系統完成後啟用。
        </p>
      )}
    </form>
  )
}
