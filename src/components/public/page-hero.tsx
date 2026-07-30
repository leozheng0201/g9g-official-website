import type { ReactNode } from 'react'
import { Container } from '@/components/public/container'
import { LinkButton } from '@/components/ui/link-button'

export type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  children?: ReactNode
}

export function PageHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: PageHeroProps) {
  return (
    <section className="overflow-hidden border-b border-line bg-paper py-14 sm:py-20 lg:py-24">
      <Container className={children ? 'grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]' : ''}>
        <div>
          <p className="mb-4 font-bold tracking-[.16em] text-gold">{eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg text-muted sm:text-xl">{description}</p>
          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryAction && <LinkButton href={primaryAction.href}>{primaryAction.label}</LinkButton>}
              {secondaryAction && <LinkButton href={secondaryAction.href} variant="secondary">{secondaryAction.label}</LinkButton>}
            </div>
          )}
        </div>
        {children}
      </Container>
    </section>
  )
}
