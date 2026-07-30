'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { primaryNavigation } from '@/content/navigation'
import { publicRoutes } from '@/lib/routes/public'
import { LinkButton } from '@/components/ui/link-button'

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstLinkRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="開啟網站選單"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-control border border-line bg-paper font-bold"
      >
        選單
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="網站選單"
          className="fixed inset-0 z-50 bg-paper p-5"
        >
          <div className="mx-auto flex h-full max-w-lg flex-col">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <strong className="text-xl">G9G 網站選單</strong>
              <button
                type="button"
                aria-label="關閉網站選單"
                onClick={() => setOpen(false)}
                className="grid size-11 place-items-center rounded-control border border-line"
              >
                關閉
              </button>
            </div>
            <nav aria-label="手機版主導覽" className="overflow-y-auto">
              <ul className="grid gap-2">
                {primaryNavigation.map((item, index) =>
                  item.children ? (
                    <li key={item.label}>
                      <details className="rounded-card border border-line bg-surface p-3">
                        <summary className="cursor-pointer font-bold">{item.label}</summary>
                        <ul className="mt-3 grid gap-2 border-t border-line pt-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setOpen(false)}
                                className="block rounded-control p-2 hover:bg-soft"
                              >
                                <strong className="block">{child.label}</strong>
                                <span className="text-sm text-muted">{child.description}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <Link
                        ref={index === 0 ? firstLinkRef : undefined}
                        href={item.href ?? publicRoutes.home}
                        onClick={() => setOpen(false)}
                        className="block rounded-control border border-transparent px-3 py-3 font-bold hover:border-line hover:bg-surface"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
            <LinkButton href={publicRoutes.growthAudit} className="mt-auto w-full">
              申請品牌成長健檢
            </LinkButton>
          </div>
        </div>
      )}
    </div>
  )
}
