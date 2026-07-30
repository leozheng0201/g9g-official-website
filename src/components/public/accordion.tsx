'use client'

import { useState } from 'react'

export type AccordionItem = { id: string; question: string; answer: string }

export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  const [openIds, setOpenIds] = useState<readonly string[]>([])

  const toggle = (id: string) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const open = openIds.includes(item.id)
        const panelId = `faq-panel-${item.id}`
        return (
          <div key={item.id} className="rounded-card border border-line bg-paper">
            <h2>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-black"
              >
                {item.question}
                <span aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
            </h2>
            {open && (
              <div id={panelId} role="region" className="border-t border-line px-5 py-5 text-muted">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
