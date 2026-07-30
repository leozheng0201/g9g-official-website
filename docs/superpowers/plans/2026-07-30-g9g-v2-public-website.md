# G9G Public Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete preview-ready G9G public website with bright brand styling, multi-page navigation, transparent service pricing, static content-center entry pages, accessible interactions, and baseline SEO while preserving the existing admin foundation.

**Architecture:** Keep the existing Next.js App Router application and add a public route-group layout around focused, reusable server components. Put approved copy, company details, routes, pricing rules, cases, FAQ, and legal text in typed content modules so pages only compose data and components; client components are limited to mobile navigation, accordion interaction, and the preview-only audit form. The public site remains static for this phase and is designed to be replaced by the later Page CMS and Content CMS without changing component interfaces.

**Tech Stack:** Node.js 24, Next.js 16.2.12 App Router, React 19.2.8, TypeScript 6.0.3, Tailwind CSS 4.3.3, Zod 4.4.3, Vitest 4.1.10, Testing Library 16.3.2, Playwright 1.62.0.

## Global Constraints

- Work only on `feature/public-website`; do not modify `main` and do not create a production deployment.
- Preserve existing `/admin`, Supabase Auth, RBAC, proxy, database, and CI behavior.
- G9G is the primary public brand; 盛澄策略顧問 is company and professional endorsement only.
- Use a bright visual system: white, warm white, light gray, dark charcoal text, restrained gold, and LINE green only for primary actions and small interaction accents.
- The hero H1 is exactly `讓商品不只上架，而是成為別人想送的理由。`.
- The hero supporting copy is exactly `從商品策略、送禮場景到檔期營運，協助品牌在 LINE 禮物找到成長方法。`.
- The primary CTA is exactly `申請品牌成長健檢`.
- Never use `免費`, `免費健檢`, or `免費品牌健檢` to describe the audit.
- Never render `scrutator` or a LINE QR code; the only LINE entry is `加入 LINE 諮詢` linked to `https://lin.ee/QwORXXZ`.
- Do not publish unsupported platform counts, invented metrics, fake client claims, guaranteed revenue, guaranteed approval, guaranteed ranking, or unconfirmed refund and termination terms.
- Attribute 法布甜 results to overall ecommerce and brand transformation, not to LINE Gift alone.
- The growth-audit form is UI and client-side validation only in this phase; a valid submit must explicitly say that Preview data has not been sent or stored.
- Static content-center entry pages may show approved categories and available content, but must not create `#`, fake detail URLs, or clickable cards for unavailable content.
- Every public page has one H1, page-specific metadata, keyboard access, visible focus, reduced-motion support, and no horizontal overflow.
- Do not add a new runtime dependency for functionality already covered by React, Next.js, Tailwind, or Zod.

---

## File Structure

### Existing files to modify

- `src/app/layout.tsx` — site-wide metadata base and title template without wrapping admin in public chrome.
- `src/app/globals.css` — approved bright design tokens, typography, layout primitives, focus and reduced-motion rules.
- `src/app/(public)/page.tsx` — complete homepage composition.
- `src/components/brand/brand-mark.tsx` — linkable G9G primary mark.
- `src/components/ui/button.tsx` — shared exported button class builder used by button and link CTA.
- `tests/unit/home.test.tsx` — new hero, section, and forbidden-copy assertions.
- `tests/e2e/foundation.spec.ts` — update public homepage smoke assertion while preserving admin checks.
- `package.json` — only add scripts if verification requires them; no new runtime package.

### Files to create

- `public/brand/sheng-cheng-logo.png`
- `src/app/(public)/layout.tsx`
- `src/app/(public)/about/page.tsx`
- `src/app/(public)/why-g9g/page.tsx`
- `src/app/(public)/growth-audit/page.tsx`
- `src/app/(public)/growth-blueprint/page.tsx`
- `src/app/(public)/growth-operations/page.tsx`
- `src/app/(public)/line-gift-academy/page.tsx`
- `src/app/(public)/cases/page.tsx`
- `src/app/(public)/insights/page.tsx`
- `src/app/(public)/faq/page.tsx`
- `src/app/(public)/resources/page.tsx`
- `src/app/(public)/contact/page.tsx`
- `src/app/(public)/privacy/page.tsx`
- `src/app/(public)/terms/page.tsx`
- `src/app/not-found.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/components/brand/g9g-guide-illustration.tsx`
- `src/components/ui/link-button.tsx`
- `src/components/public/site-header.tsx`
- `src/components/public/desktop-navigation.tsx`
- `src/components/public/mobile-navigation.tsx`
- `src/components/public/site-footer.tsx`
- `src/components/public/breadcrumbs.tsx`
- `src/components/public/container.tsx`
- `src/components/public/page-hero.tsx`
- `src/components/public/section-heading.tsx`
- `src/components/public/hero-strategy-board.tsx`
- `src/components/public/strategy-card.tsx`
- `src/components/public/gift-scene-card.tsx`
- `src/components/public/service-card.tsx`
- `src/components/public/process-step.tsx`
- `src/components/public/case-card.tsx`
- `src/components/public/pricing-card.tsx`
- `src/components/public/founder-panel.tsx`
- `src/components/public/cta-band.tsx`
- `src/components/public/contact-methods.tsx`
- `src/components/public/accordion.tsx`
- `src/components/public/audit-preview-form.tsx`
- `src/components/public/json-ld.tsx`
- `src/content/site.ts`
- `src/content/navigation.ts`
- `src/content/home.ts`
- `src/content/about.ts`
- `src/content/services.ts`
- `src/content/cases.ts`
- `src/content/content-centers.ts`
- `src/content/faq.ts`
- `src/content/legal.ts`
- `src/lib/routes/public.ts`
- `src/lib/pricing/operations.ts`
- `src/lib/validation/growth-audit-preview.ts`
- `src/lib/seo/metadata.ts`
- `src/lib/seo/schema.ts`
- `tests/unit/public-routes.test.ts`
- `tests/unit/public-content.test.ts`
- `tests/unit/link-button.test.tsx`
- `tests/unit/public-navigation.test.tsx`
- `tests/unit/mobile-navigation.test.tsx`
- `tests/unit/public-components.test.tsx`
- `tests/unit/pricing.test.ts`
- `tests/unit/growth-audit-form.test.tsx`
- `tests/unit/accordion.test.tsx`
- `tests/unit/seo.test.ts`
- `tests/unit/public-pages.test.tsx`
- `tests/e2e/public-site.spec.ts`

---

### Task 1: Public Route Registry and Approved Site Data

**Files:**
- Create: `src/lib/routes/public.ts`
- Create: `src/content/site.ts`
- Test: `tests/unit/public-routes.test.ts`
- Test: `tests/unit/public-content.test.ts`

**Interfaces:**
- Produces: `publicRoutes`, `indexablePublicRoutes`, `PublicRoute`, `siteConfig`, `companyInfo`, and `contactInfo`.
- Consumes: no application modules.

- [ ] **Step 1: Write the failing route and site-data tests**

```ts
import { describe, expect, it } from 'vitest'
import { indexablePublicRoutes, publicRoutes } from '@/lib/routes/public'
import { companyInfo, contactInfo, siteConfig } from '@/content/site'

describe('public route registry', () => {
  it('contains every approved public path and no placeholder links', () => {
    expect(indexablePublicRoutes).toEqual([
      '/',
      '/about',
      '/why-g9g',
      '/growth-audit',
      '/growth-blueprint',
      '/growth-operations',
      '/line-gift-academy',
      '/cases',
      '/insights',
      '/faq',
      '/resources',
      '/contact',
      '/privacy',
      '/terms',
    ])
    expect(Object.values(publicRoutes)).not.toContain('#')
  })
})

describe('approved public site data', () => {
  it('uses G9G as the primary brand and the approved company data', () => {
    expect(siteConfig.name).toBe('G9G')
    expect(siteConfig.positioning).toBe('LINE 禮物品牌成長平台')
    expect(companyInfo.legalName).toBe('盛澄策略顧問')
    expect(companyInfo.taxId).toBe('60381422')
    expect(contactInfo.lineUrl).toBe('https://lin.ee/QwORXXZ')
  })

  it('does not expose the hidden LINE account name or prohibited audit wording', () => {
    const serialized = JSON.stringify({ siteConfig, companyInfo, contactInfo })
    expect(serialized).not.toContain('scrutator')
    expect(serialized).not.toContain('免費健檢')
    expect(serialized).not.toContain('免費品牌健檢')
  })
})
```

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `npm run test:run -- tests/unit/public-routes.test.ts tests/unit/public-content.test.ts`

Expected: FAIL because `@/lib/routes/public` and `@/content/site` do not exist.

- [ ] **Step 3: Implement the route registry**

```ts
export const publicRoutes = {
  home: '/',
  about: '/about',
  whyG9g: '/why-g9g',
  growthAudit: '/growth-audit',
  growthBlueprint: '/growth-blueprint',
  growthOperations: '/growth-operations',
  academy: '/line-gift-academy',
  cases: '/cases',
  insights: '/insights',
  faq: '/faq',
  resources: '/resources',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
} as const

export type PublicRoute = (typeof publicRoutes)[keyof typeof publicRoutes]

export const indexablePublicRoutes: readonly PublicRoute[] = Object.values(publicRoutes)
```

- [ ] **Step 4: Implement the approved site, company, and contact data**

```ts
export const siteConfig = {
  name: 'G9G',
  positioning: 'LINE 禮物品牌成長平台',
  serviceLine: 'LINE 禮物代營運・品牌策略・電商成長',
  heroTitle: '讓商品不只上架，而是成為別人想送的理由。',
  heroDescription:
    '從商品策略、送禮場景到檔期營運，協助品牌在 LINE 禮物找到成長方法。',
  primaryCta: '申請品牌成長健檢',
} as const

export const companyInfo = {
  legalName: '盛澄策略顧問',
  englishName: 'Sheng Cheng Strategy Consulting',
  founderName: '莊又丞',
  founderTitle: '創辦人暨執行總監',
  taxId: '60381422',
  address: '台北市大安區忠孝東路四段169號12樓',
  transit: '捷運忠孝敦化站1號出口',
} as const

export const contactInfo = {
  phoneLabel: '0915-009-707',
  phoneHref: 'tel:+886915009707',
  email: 'g9growth@gmail.com',
  emailHref: 'mailto:g9growth@gmail.com',
  lineUrl: 'https://lin.ee/QwORXXZ',
  lineLabel: '加入 LINE 諮詢',
} as const
```

- [ ] **Step 5: Run tests and commit**

Run: `npm run test:run -- tests/unit/public-routes.test.ts tests/unit/public-content.test.ts`

Expected: PASS.

```bash
git add src/lib/routes/public.ts src/content/site.ts tests/unit/public-routes.test.ts tests/unit/public-content.test.ts
git commit -m "feat: add public route and site content contracts"
```

---

### Task 2: Bright Design Tokens, Link CTA, Brand Assets, and Base Primitives

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/brand/brand-mark.tsx`
- Create: `src/components/ui/link-button.tsx`
- Create: `src/components/public/container.tsx`
- Create: `src/components/brand/g9g-guide-illustration.tsx`
- Create: `public/brand/sheng-cheng-logo.png`
- Test: `tests/unit/link-button.test.tsx`
- Test: `tests/unit/button.test.tsx`

**Interfaces:**
- Produces: `buttonClassName(variant, className)`, `ButtonVariant`, `LinkButton`, `Container`, `BrandMark`, and `G9GGuideIllustration`.
- Consumes: `cn` from `src/lib/utils/cn.ts`.

- [ ] **Step 1: Add failing primitive tests**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LinkButton } from '@/components/ui/link-button'
import { BrandMark } from '@/components/brand/brand-mark'

describe('LinkButton', () => {
  it('renders a navigable primary CTA', () => {
    render(<LinkButton href="/growth-audit">申請品牌成長健檢</LinkButton>)
    expect(screen.getByRole('link', { name: '申請品牌成長健檢' })).toHaveAttribute(
      'href',
      '/growth-audit',
    )
  })
})

describe('BrandMark', () => {
  it('links the primary G9G brand to the homepage', () => {
    render(<BrandMark />)
    expect(screen.getByRole('link', { name: /G9G LINE 禮物品牌成長平台/ })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `npm run test:run -- tests/unit/link-button.test.tsx tests/unit/button.test.tsx`

Expected: FAIL because `LinkButton` does not exist and `BrandMark` is not a link.

- [ ] **Step 3: Export the shared button style contract**

Update `src/components/ui/button.tsx` so it exports:

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

export function buttonClassName(variant: ButtonVariant = 'primary', className?: string) {
  return cn(
    'inline-flex min-h-11 items-center justify-center rounded-control border px-5 py-2.5 font-bold transition-[background-color,color,transform,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50 motion-safe:hover:-translate-y-0.5',
    variants[variant],
    className,
  )
}
```

Use `buttonClassName` inside `Button` without changing its existing `type="button"` default.

- [ ] **Step 4: Create LinkButton and Container**

```tsx
import Link from 'next/link'
import type { ComponentProps } from 'react'
import { buttonClassName, type ButtonVariant } from './button'

export type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant
}

export function LinkButton({ className, variant = 'primary', ...props }: LinkButtonProps) {
  return <Link className={buttonClassName(variant, className)} {...props} />
}
```

```tsx
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10', className)} {...props} />
}
```

- [ ] **Step 5: Apply the approved tokens and global behavior**

Replace the public-facing token values in `src/app/globals.css` with:

```css
:root {
  color-scheme: light;
  --g9g-ink: #242925;
  --g9g-paper: #fffefa;
  --g9g-surface: #f7f4ec;
  --g9g-soft: #eef1ed;
  --g9g-muted: #667069;
  --g9g-line: #dce2dc;
  --g9g-green: #06c755;
  --g9g-green-dark: #04a847;
  --g9g-gold: #c9a23b;
  --g9g-warning: #a86500;
  --g9g-danger: #b42318;
  --g9g-radius-control: 0.5rem;
  --g9g-radius-card: 1rem;
  --g9g-shadow-control: 3px 3px 0 var(--g9g-ink);
  --g9g-shadow-brand: 4px 4px 0 color-mix(in srgb, var(--g9g-green) 65%, white);
}
```

Add Tailwind theme mappings for `soft` and `gold`, set `body` to the approved warm paper background, add `scroll-behavior: smooth`, `text-wrap: balance` for headings, an accessible `.skip-link`, and this reduced-motion rule:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6: Make BrandMark linkable and add the small guide illustration**

`BrandMark` must render a Next.js `Link` to `/`, keep the `compact` prop, and use the accessible name `G9G LINE 禮物品牌成長平台`.

Create `G9GGuideIllustration` as an inline SVG decorative component with `aria-hidden="true"`. It must use only the approved palette and depict a small simplified guide character: reverse dark cap, a small red `莊` badge, black shirt, one visible tattooed forearm, laptop, and LINE-green gift box. It is not rendered in the hero and never displays the text `老莊`.

- [ ] **Step 7: Add the user-supplied company logo asset**

Copy the exact uploaded source `/mnt/data/logo-盛澄策略顧問-01.png` to `public/brand/sheng-cheng-logo.png`. Preserve the visible 盛澄策略顧問 and English company name; do not redraw or rename the company.

- [ ] **Step 8: Run tests, lint, and commit**

Run:

```bash
npm run test:run -- tests/unit/link-button.test.tsx tests/unit/button.test.tsx
npm run lint
npm run typecheck
```

Expected: all commands PASS.

```bash
git add src/app/globals.css src/components/ui/button.tsx src/components/ui/link-button.tsx src/components/public/container.tsx src/components/brand/brand-mark.tsx src/components/brand/g9g-guide-illustration.tsx public/brand/sheng-cheng-logo.png tests/unit/link-button.test.tsx tests/unit/button.test.tsx
git commit -m "feat: establish bright public brand primitives"
```

---

### Task 3: Public Navigation, Mobile Drawer, Footer, and Route-Group Layout

**Files:**
- Create: `src/content/navigation.ts`
- Create: `src/components/public/site-header.tsx`
- Create: `src/components/public/desktop-navigation.tsx`
- Create: `src/components/public/mobile-navigation.tsx`
- Create: `src/components/public/site-footer.tsx`
- Create: `src/components/public/breadcrumbs.tsx`
- Create: `src/app/(public)/layout.tsx`
- Test: `tests/unit/public-navigation.test.tsx`
- Test: `tests/unit/mobile-navigation.test.tsx`

**Interfaces:**
- Produces: `primaryNavigation`, `footerNavigation`, `SiteHeader`, `SiteFooter`, `Breadcrumbs`.
- Consumes: `publicRoutes`, `siteConfig`, `companyInfo`, `contactInfo`, `BrandMark`, `LinkButton`, `Container`.

- [ ] **Step 1: Write failing navigation tests**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'

it('provides all approved top-level destinations and the primary CTA', () => {
  render(<SiteHeader />)
  expect(screen.getByRole('link', { name: '關於 G9G' })).toHaveAttribute('href', '/about')
  expect(screen.getByRole('link', { name: 'LINE 禮物研究院' })).toHaveAttribute(
    'href',
    '/line-gift-academy',
  )
  expect(screen.getAllByRole('link', { name: '申請品牌成長健檢' }).length).toBeGreaterThan(0)
})

it('never exposes the LINE account name in the footer', () => {
  const { container } = render(<SiteFooter />)
  expect(container.textContent).not.toContain('scrutator')
  expect(screen.getByRole('link', { name: '加入 LINE 諮詢' })).toHaveAttribute(
    'href',
    'https://lin.ee/QwORXXZ',
  )
})

it('opens and closes the mobile menu accessibly', () => {
  render(<SiteHeader />)
  const trigger = screen.getByRole('button', { name: '開啟網站選單' })
  fireEvent.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('dialog', { name: '網站選單' })).toBeInTheDocument()
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('dialog', { name: '網站選單' })).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:run -- tests/unit/public-navigation.test.tsx tests/unit/mobile-navigation.test.tsx`

Expected: FAIL because the public navigation components do not exist.

- [ ] **Step 3: Create typed navigation data**

Use this exact structure in `src/content/navigation.ts`:

```ts
import { publicRoutes, type PublicRoute } from '@/lib/routes/public'

export type NavigationChild = { label: string; href: PublicRoute; description: string }
export type NavigationItem = {
  label: string
  href?: PublicRoute
  children?: readonly NavigationChild[]
}

export const primaryNavigation: readonly NavigationItem[] = [
  { label: '關於 G9G', href: publicRoutes.about },
  {
    label: '品牌成長',
    children: [
      { label: '品牌成長健檢', href: publicRoutes.growthAudit, description: '先判斷，再談合作。' },
      { label: '品牌成長藍圖', href: publicRoutes.growthBlueprint, description: '把判斷整理成可執行的成長路線。' },
      { label: '品牌成長代營運', href: publicRoutes.growthOperations, description: '把商品、檔期、版位與營運落地。' },
    ],
  },
  { label: 'LINE 禮物研究院', href: publicRoutes.academy },
  { label: '品牌成長案例', href: publicRoutes.cases },
  { label: '品牌觀點', href: publicRoutes.insights },
  { label: '品牌資源', href: publicRoutes.resources },
  { label: '聯絡我們', href: publicRoutes.contact },
]
```

Create `footerNavigation` with the service routes, content-center routes, contact route, privacy route, and terms route; do not include fake social links.

- [ ] **Step 4: Implement desktop and mobile navigation**

`DesktopNavigation` is a server component. Use normal links for direct items and an accessible `<details>` menu for `品牌成長`; the summary must be keyboard operable, and child links must include label and description.

`MobileNavigation` is a client component with this behavior:

```ts
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
```

Render an `aria-modal="true"`, `role="dialog"`, `aria-label="網站選單"` panel only while open. Use a native `<details>` group for the three service links. Include the primary CTA at the end. Do not implement a custom focus trap in this phase; focus the first link on open, support Escape, lock body scroll, and restore focus on close.

- [ ] **Step 5: Implement header, footer, breadcrumbs, and public layout**

`SiteHeader` contains a skip link, `BrandMark`, desktop navigation at `lg` and above, the desktop audit CTA, and mobile trigger below `lg`.

`SiteFooter` contains:

- G9G positioning.
- 盛澄策略顧問 and Sheng Cheng Strategy Consulting.
- 0915-009-707, g9growth@gmail.com, address, transit, tax ID.
- `加入 LINE 諮詢` external link with `target="_blank"` and `rel="noreferrer"`.
- Footer navigation and current year.
- No LINE account name and no QR image.

`Breadcrumbs` accepts:

```ts
export type BreadcrumbItem = { label: string; href?: string }
export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }): JSX.Element
```

`src/app/(public)/layout.tsx` wraps children with `SiteHeader`, `<main id="main-content">`, `SiteFooter`, and a mobile sticky audit CTA that does not cover the footer.

- [ ] **Step 6: Run tests and commit**

Run:

```bash
npm run test:run -- tests/unit/public-navigation.test.tsx tests/unit/mobile-navigation.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

```bash
git add src/content/navigation.ts src/components/public/site-header.tsx src/components/public/desktop-navigation.tsx src/components/public/mobile-navigation.tsx src/components/public/site-footer.tsx src/components/public/breadcrumbs.tsx src/app/'(public)'/layout.tsx tests/unit/public-navigation.test.tsx tests/unit/mobile-navigation.test.tsx
git commit -m "feat: add accessible public site navigation"
```

---

### Task 4: Reusable Public-Site Section Components

**Files:**
- Create: `src/components/public/page-hero.tsx`
- Create: `src/components/public/section-heading.tsx`
- Create: `src/components/public/hero-strategy-board.tsx`
- Create: `src/components/public/strategy-card.tsx`
- Create: `src/components/public/gift-scene-card.tsx`
- Create: `src/components/public/service-card.tsx`
- Create: `src/components/public/process-step.tsx`
- Create: `src/components/public/case-card.tsx`
- Create: `src/components/public/pricing-card.tsx`
- Create: `src/components/public/founder-panel.tsx`
- Create: `src/components/public/cta-band.tsx`
- Create: `src/components/public/contact-methods.tsx`
- Test: `tests/unit/public-components.test.tsx`

**Interfaces:**
- Produces: reusable, content-driven components with typed props and no page-specific data imports except `FounderPanel` and `ContactMethods`.
- Consumes: `Container`, `LinkButton`, `G9GGuideIllustration`, `companyInfo`, `contactInfo`.

- [ ] **Step 1: Write failing component contract tests**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PricingCard } from '@/components/public/pricing-card'
import { HeroStrategyBoard } from '@/components/public/hero-strategy-board'
import { ContactMethods } from '@/components/public/contact-methods'

it('renders the approved hero strategy concepts', () => {
  render(<HeroStrategyBoard />)
  for (const label of ['情緒', '儀式', '商務', '吉時', '商品', '流量', '轉換']) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }
})

it('renders a transparent pricing card without a fake starting-price label', () => {
  render(
    <PricingCard
      name="商城啟動方案"
      price="NT$30,000"
      cadence="一次性"
      description="從進場判斷到商城啟動。"
      features={['主打商品', '價格帶']}
    />,
  )
  expect(screen.getByText('NT$30,000')).toBeInTheDocument()
  expect(screen.queryByText(/起$/)).not.toBeInTheDocument()
})

it('uses only the approved public contact methods', () => {
  const { container } = render(<ContactMethods />)
  expect(screen.getByRole('link', { name: '加入 LINE 諮詢' })).toBeInTheDocument()
  expect(container.textContent).not.toContain('scrutator')
})
```

- [ ] **Step 2: Run test and confirm failure**

Run: `npm run test:run -- tests/unit/public-components.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implement typed component boundaries**

Use these exact public prop contracts:

```ts
export type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  children?: React.ReactNode
}

export type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export type CardProps = {
  title: string
  description: string
  eyebrow?: string
}

export type ServiceCardProps = CardProps & {
  href: string
  actionLabel: string
  items: readonly string[]
}

export type PricingCardProps = {
  name: string
  price: string
  cadence: string
  description: string
  features: readonly string[]
  recommended?: boolean
}

export type CaseCardProps = {
  brand: string
  category: string
  summary: string
  results: readonly string[]
  note?: string
}
```

`PageHero`, `SectionHeading`, `StrategyCard`, `GiftSceneCard`, `ServiceCard`, `ProcessStep`, `CaseCard`, and `PricingCard` remain server components. `HeroStrategyBoard` renders the approved four scenes and the `商品 × 流量 × 轉換` structure in a responsive grid with light cards; it must not contain unverified platform numbers.

`FounderPanel` renders company logo through `next/image`, founder name/title, a concise professional paragraph, and the small `G9GGuideIllustration`. It does not render a portrait.

`ContactMethods` renders phone, email, LINE button, address, and transit using only `contactInfo` and `companyInfo`.

- [ ] **Step 4: Add semantic and accessibility details**

- Card lists use `<ul>` and `<li>`.
- Decorative graphics are `aria-hidden`.
- External LINE link identifies that it opens a new tab with visually hidden text.
- Pricing `recommended` uses visible text `推薦方案`, not color alone.
- `CtaBand` always contains a real route and never a `#` href.

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm run test:run -- tests/unit/public-components.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

```bash
git add src/components/public/page-hero.tsx src/components/public/section-heading.tsx src/components/public/hero-strategy-board.tsx src/components/public/strategy-card.tsx src/components/public/gift-scene-card.tsx src/components/public/service-card.tsx src/components/public/process-step.tsx src/components/public/case-card.tsx src/components/public/pricing-card.tsx src/components/public/founder-panel.tsx src/components/public/cta-band.tsx src/components/public/contact-methods.tsx tests/unit/public-components.test.tsx
git commit -m "feat: add reusable public content components"
```

---

### Task 5: Homepage Content and Composition

**Files:**
- Create: `src/content/home.ts`
- Create: `src/content/cases.ts`
- Modify: `src/app/(public)/page.tsx`
- Modify: `tests/unit/home.test.tsx`

**Interfaces:**
- Produces: `painPoints`, `growthPillars`, `giftScenes`, `growthServices`, `processSteps`, `featuredCases`, `homeContentEntries`.
- Consumes: public section components, `siteConfig`, `publicRoutes`.

- [ ] **Step 1: Replace the existing homepage test with approved-copy and section tests**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from '@/app/(public)/page'

describe('HomePage', () => {
  it('uses the approved hero and audit CTA', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '讓商品不只上架，而是成為別人想送的理由。',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('從商品策略、送禮場景到檔期營運，協助品牌在 LINE 禮物找到成長方法。'),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: '申請品牌成長健檢' }).length).toBeGreaterThan(0)
  })

  it('explains the gifting difference and growth method', () => {
    render(<HomePage />)
    expect(
      screen.getByText('在 LINE 禮物，付錢的人跟收到商品的人不是同一個。原本的商品文案，很可能寫給錯的人看了。'),
    ).toBeInTheDocument()
    for (const value of ['商品', '流量', '轉換', '情緒', '儀式', '商務', '吉時']) {
      expect(screen.getAllByText(value).length).toBeGreaterThan(0)
    }
  })

  it('contains no prohibited audit wording or unsupported platform counts', () => {
    const { container } = render(<HomePage />)
    const text = container.textContent ?? ''
    expect(text).not.toContain('免費健檢')
    expect(text).not.toContain('免費品牌健檢')
    expect(text).not.toContain('900萬')
    expect(text).not.toContain('3,000+')
  })
})
```

- [ ] **Step 2: Run the homepage test and confirm failure**

Run: `npm run test:run -- tests/unit/home.test.tsx`

Expected: FAIL because the current homepage only renders `G9G` and the positioning line.

- [ ] **Step 3: Create exact homepage data**

`src/content/home.ts` must contain:

```ts
export const painPoints = [
  {
    title: '還在準備，市場已經先走了',
    description: '看著同業進入 LINE 禮物，品牌仍停在查資料、問流程與等待內部共識。',
  },
  {
    title: '已經上架，卻沒有成交理由',
    description: '商品有人看，但頁面沒有對送禮者說清楚：為什麼現在要送、適合送給誰。',
  },
  {
    title: '一年只靠兩個大檔期',
    description: '過年、中秋很忙，其他月份缺少生日、感謝、打氣、商務與吉時等常態需求。',
  },
] as const

export const growthPillars = [
  { title: '商品', description: '主打品、價格帶、禮盒結構、包裝與服務。' },
  { title: '流量', description: '站內版位、年度檔期、品牌週與活動節奏。' },
  { title: '轉換', description: '送禮理由、祝福賀卡、商品組合與優惠機制。' },
] as const

export const giftScenes = [
  { title: '情緒', description: '打氣、感謝、道歉與關心，讓商品承接沒說出口的心意。' },
  { title: '儀式', description: '生日、紀念日、節慶與人生節點，讓送禮成為關係中的儀式。' },
  { title: '商務', description: '客戶、同事、夥伴與企業贈禮，兼顧體面、效率與品牌印象。' },
  { title: '吉時', description: '開運、入厝、升遷、開幕與祝賀，回應明確時機與祝福需求。' },
] as const

export const processSteps = [
  ['01', '提交品牌成長健檢', '先提供品牌與現況的基本資料。'],
  ['02', '初步判斷與聯繫', 'G9G 於 24 小時內聯繫並確認下一步。'],
  ['03', '詳細問卷與資料整理', '通過初步審核後，再補充商品、通路與營運資料。'],
  ['04', '30 分鐘線上說明', '說明關鍵問題、機會與優先順序。'],
  ['05', '品牌成長健檢報告', '整理適配性、問題與可行的準備方向。'],
  ['06', '進入藍圖或代營運', '適合者再討論策略規劃或長期落地合作。'],
] as const
```

Add three service records in the order 健檢 → 藍圖 → 代營運 and three content-center entries 研究院 → 品牌觀點 → 品牌資源, each linked to the real route.

`src/content/cases.ts` must expose exactly these featured records:

```ts
export const featuredCases = [
  {
    brand: '微笑甜果',
    category: 'LINE 禮物電商案例',
    summary: '以送禮情境與主打品策略，建立節慶檔期的成長動能。',
    results: ['過年重點檔期以低廣告預算創造單月近百萬業績', '堅持不降價', '將櫻桃水果禮盒打造為代表性主打商品'],
  },
  {
    brand: '法布甜',
    category: '整體電商與品牌轉型案例',
    summary: '從傳統伴手禮市場，升級至高客單、高附加價值的送禮市場。',
    results: ['整體電商年營業額突破千萬', '單月 GMV 穩定達百萬', '單月訂單超過 1,400 筆'],
    note: '以上為整體電商與品牌轉型成果，不代表 LINE 禮物單一平台成果。',
  },
] as const
```

- [ ] **Step 4: Compose the complete homepage in the approved order**

Render these sections in this exact order:

1. Hero with service line, approved H1/subtitle, audit CTA, `了解 G9G 的成長方法`, and `HeroStrategyBoard`.
2. Three visitor pain cards.
3. The approved “付錢的人與收禮的人不同” statement.
4. `商品 × 流量 × 轉換` growth pillars.
5. Four gifting scenes.
6. Three connected growth services.
7. Six-step process.
8. Two featured cases.
9. Public pricing summary linked to `/growth-operations`.
10. Academy, insights, and resource entry cards.
11. `FounderPanel` with company endorsement.
12. Final `CtaBand` linking to `/growth-audit`.

Every section must have a unique `id` suitable for internal links; use `id="growth-method"` for the secondary hero CTA target.

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm run test:run -- tests/unit/home.test.tsx tests/unit/public-content.test.ts
npm run lint
npm run typecheck
```

Expected: PASS.

```bash
git add src/content/home.ts src/content/cases.ts src/app/'(public)'/page.tsx tests/unit/home.test.tsx
git commit -m "feat: build the G9G public homepage"
```

---

### Task 6: About G9G and Why G9G Pages

**Files:**
- Create: `src/content/about.ts`
- Create: `src/app/(public)/about/page.tsx`
- Create: `src/app/(public)/why-g9g/page.tsx`
- Test: `tests/unit/public-pages.test.tsx`

**Interfaces:**
- Produces: `aboutSections`, `giftCommerceDifferences`, `fitCriteria`, and two public pages.
- Consumes: page and section components, `companyInfo`, `FounderPanel`, `Breadcrumbs`, `CtaBand`.

- [ ] **Step 1: Add failing page tests**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AboutPage from '@/app/(public)/about/page'
import WhyG9GPage from '@/app/(public)/why-g9g/page'

it('explains the G9G and 盛澄 relationship', () => {
  render(<AboutPage />)
  expect(screen.getByRole('heading', { level: 1, name: '關於 G9G' })).toBeInTheDocument()
  expect(screen.getByText(/G9G 是盛澄策略顧問聚焦 LINE 禮物品牌成長的服務品牌/)).toBeInTheDocument()
  expect(screen.getByText('莊又丞')).toBeInTheDocument()
})

it('explains why gift ecommerce needs a different decision model', () => {
  render(<WhyG9GPage />)
  expect(screen.getByRole('heading', { level: 1, name: '為什麼選擇 G9G' })).toBeInTheDocument()
  expect(screen.getByText('一般電商')).toBeInTheDocument()
  expect(screen.getByText('送禮電商')).toBeInTheDocument()
  expect(screen.getByText('目前不適合合作的情況')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:run -- tests/unit/public-pages.test.tsx`

Expected: FAIL because both page modules are missing.

- [ ] **Step 3: Create the exact about and fit content**

Use these statements:

- `G9G 是盛澄策略顧問聚焦 LINE 禮物品牌成長的服務品牌。`
- `我們不只協助商品上架，而是從商品、送禮場景、價格帶、檔期、版位與轉換，判斷品牌如何在 LINE 禮物建立可持續的成長方法。`
- Founder copy: `莊又丞｜創辦人暨執行總監。專注品牌策略、電商整合與 LINE 禮物營運，從商品定位、檔期規劃到站內版位，協助品牌把判斷轉成可執行的成長路線。`
- Service boundary: `G9G 不保證商城審核、特定業績或搜尋排名，也不以降價作為唯一成長方法。`

For `為什麼選擇 G9G`, use this comparison:

- 一般電商：購買者多半也是使用者，重點是需求、功能、價格與購買效率。
- 送禮電商：付錢者與收禮者可能不同，必須同時處理關係、時機、體面、祝福與收禮體驗。

Suitable brands:

- 有穩定供貨與基本客服能力。
- 願意建立主打商品，而不是把所有 SKU 原封不動搬上平台。
- 願意提供商品素材、庫存與檔期資訊。
- 願意用至少一個完整檔期驗證策略。

Not currently suitable:

- 只要求代辦上架，不願調整商品與頁面。
- 供貨、效期、物流或客服尚未穩定。
- 要求保證審核、保證業績或短期暴量。
- 只接受削價，卻不願建立送禮理由。

- [ ] **Step 4: Build both pages**

Each page uses `Breadcrumbs`, `PageHero`, semantic `<section>` blocks, and a final audit CTA. `AboutPage` includes the company logo and founder panel. `WhyG9GPage` presents the comparison with responsive cards rather than a horizontally scrolling table.

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm run test:run -- tests/unit/public-pages.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

```bash
git add src/content/about.ts src/app/'(public)'/about/page.tsx src/app/'(public)'/why-g9g/page.tsx tests/unit/public-pages.test.tsx
git commit -m "feat: add G9G company and differentiation pages"
```

---

### Task 7: Growth Blueprint, Operations Pricing, and Pricing Calculations

**Files:**
- Create: `src/content/services.ts`
- Create: `src/lib/pricing/operations.ts`
- Create: `src/app/(public)/growth-blueprint/page.tsx`
- Create: `src/app/(public)/growth-operations/page.tsx`
- Test: `tests/unit/pricing.test.ts`
- Modify: `tests/unit/public-pages.test.tsx`

**Interfaces:**
- Produces: `operationsPlans`, `blueprintDeliverables`, `calculateRevenueShareFee(completedAmount)`, and `calculateAnnualOperationsMonthlyFee(completedAmount)`.
- Consumes: pricing and page components.

- [ ] **Step 1: Write failing pricing calculation tests**

```ts
import { describe, expect, it } from 'vitest'
import {
  calculateAnnualOperationsMonthlyFee,
  calculateRevenueShareFee,
} from '@/lib/pricing/operations'

describe('operations pricing', () => {
  it('calculates the 35% completed-order revenue-share fee', () => {
    expect(calculateRevenueShareFee(200_000)).toBe(70_000)
  })

  it('does not charge the 3.5% variable fee below the monthly threshold', () => {
    expect(calculateAnnualOperationsMonthlyFee(300_000)).toBe(30_000)
  })

  it('charges 3.5% only on the amount above NT$300,000', () => {
    expect(calculateAnnualOperationsMonthlyFee(500_000)).toBe(37_000)
  })

  it('rejects negative completed amounts', () => {
    expect(() => calculateRevenueShareFee(-1)).toThrow('completedAmount must be non-negative')
  })
})
```

- [ ] **Step 2: Run the pricing test and confirm failure**

Run: `npm run test:run -- tests/unit/pricing.test.ts`

Expected: FAIL because the pricing module does not exist.

- [ ] **Step 3: Implement exact pricing functions**

```ts
function assertNonNegative(completedAmount: number) {
  if (!Number.isFinite(completedAmount) || completedAmount < 0) {
    throw new Error('completedAmount must be non-negative')
  }
}

export function calculateRevenueShareFee(completedAmount: number): number {
  assertNonNegative(completedAmount)
  return Math.round(completedAmount * 0.35)
}

export function calculateAnnualOperationsMonthlyFee(completedAmount: number): number {
  assertNonNegative(completedAmount)
  const variableBase = Math.max(0, completedAmount - 300_000)
  return 30_000 + Math.round(variableBase * 0.035)
}
```

- [ ] **Step 4: Create approved service content**

`blueprintDeliverables` contains:

- 品牌現況與通路角色。
- LINE 禮物適配性。
- 主打商品方向。
- 送禮場景與價格帶。
- 年度檔期規劃。
- 三階段成長路線。
- KPI 與執行優先順序。

Do not invent a public price for the blueprint.

`operationsPlans` contains:

1. `商城啟動方案` — `NT$30,000`, `一次性`; includes進場判斷、主打商品、價格帶、禮盒結構、檔期倒推、商城開通與後台設定。
2. `成果分潤方案` — `完成訂單成交額 35%`; 35% includes LINE Gift platform commission and G9G operations fee; cancellations and refunds excluded; platform annual fee NT$12,000 collected and paid by G9G at launch.
3. `全年代營運方案` — `NT$30,000／月`, `12 個月`; 3.5% only above monthly completed net amount NT$300,000; settled next month; platform annual fee NT$12,000 paid directly by brand; mark as recommended.

Common notes must state ad spend and LINE placement fees are not included; G9G supplies placement strategy and basic placement creative/size adaptation; photography, advanced retouching, video, full-web advertising, CIS, and SEO extensions are separately quoted; no approval, revenue, or ranking guarantee.

- [ ] **Step 5: Build the blueprint and operations pages**

`GrowthBlueprintPage` explains the position between audit and long-term operations, renders the seven deliverables, the three-stage route, and audit CTA without a made-up amount.

`GrowthOperationsPage` renders all three `PricingCard` records, a real calculation explanation using these examples:

- Revenue share: completed amount NT$200,000 → fee NT$70,000.
- Annual operations: completed amount NT$500,000 → monthly base NT$30,000 + excess NT$200,000 × 3.5% = NT$37,000.

Render common notes and a link to contact G9G. Do not use `起` after any price.

- [ ] **Step 6: Extend page tests and run**

Add assertions that the service pages show `NT$30,000`, `35%`, `3.5%`, `NT$12,000`, and the non-guarantee statement, and that no text matches `/NT\$.*起/`.

Run:

```bash
npm run test:run -- tests/unit/pricing.test.ts tests/unit/public-pages.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/content/services.ts src/lib/pricing/operations.ts src/app/'(public)'/growth-blueprint/page.tsx src/app/'(public)'/growth-operations/page.tsx tests/unit/pricing.test.ts tests/unit/public-pages.test.tsx
git commit -m "feat: add growth services and transparent pricing"
```

---

### Task 8: Brand Growth Audit Preview Form and Page

**Files:**
- Create: `src/lib/validation/growth-audit-preview.ts`
- Create: `src/components/public/audit-preview-form.tsx`
- Create: `src/app/(public)/growth-audit/page.tsx`
- Test: `tests/unit/growth-audit-form.test.tsx`
- Modify: `tests/unit/public-pages.test.tsx`

**Interfaces:**
- Produces: `growthAuditPreviewSchema`, `GrowthAuditPreviewInput`, `AuditPreviewForm`, and the audit page.
- Consumes: Zod, `Button`, page components, privacy route.

- [ ] **Step 1: Write failing schema and form tests**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuditPreviewForm } from '@/components/public/audit-preview-form'
import { growthAuditPreviewSchema } from '@/lib/validation/growth-audit-preview'

it('accepts only the approved first-stage fields', () => {
  const result = growthAuditPreviewSchema.safeParse({
    contactName: '王小明',
    brandName: '測試品牌',
    phone: '0912345678',
    email: 'owner@example.com',
    brandUrl: 'https://example.com',
    privacyAccepted: true,
    website: '',
  })
  expect(result.success).toBe(true)
})

it('rejects an invalid mobile number and a filled honeypot', () => {
  expect(
    growthAuditPreviewSchema.safeParse({
      contactName: '王小明',
      brandName: '測試品牌',
      phone: '123',
      email: 'owner@example.com',
      brandUrl: 'https://example.com',
      privacyAccepted: true,
      website: 'spam',
    }).success,
  ).toBe(false)
})

it('shows an explicit preview notice instead of fake submission success', () => {
  render(<AuditPreviewForm />)
  fireEvent.change(screen.getByLabelText('聯絡人姓名'), { target: { value: '王小明' } })
  fireEvent.change(screen.getByLabelText('品牌名稱'), { target: { value: '測試品牌' } })
  fireEvent.change(screen.getByLabelText('手機'), { target: { value: '0912345678' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'owner@example.com' } })
  fireEvent.change(screen.getByLabelText('品牌連結'), { target: { value: 'https://example.com' } })
  fireEvent.click(screen.getByLabelText(/我已閱讀並同意隱私權政策/))
  fireEvent.click(screen.getByRole('button', { name: '檢查申請資料' }))
  expect(
    screen.getByText('目前為 Preview，申請資料尚未送出或儲存。正式送出功能將在品牌成長健檢系統完成後啟用。'),
  ).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:run -- tests/unit/growth-audit-form.test.tsx`

Expected: FAIL because the schema and form do not exist.

- [ ] **Step 3: Implement the Zod schema**

```ts
import { z } from 'zod'

export const growthAuditPreviewSchema = z.object({
  contactName: z.string().trim().min(2, '請填寫聯絡人姓名').max(50),
  brandName: z.string().trim().min(2, '請填寫品牌名稱').max(80),
  phone: z.string().trim().regex(/^09\d{8}$/, '請填寫 10 碼台灣手機號碼'),
  email: z.email('請填寫有效的 Email'),
  brandUrl: z.url('請填寫包含 https:// 的品牌連結'),
  privacyAccepted: z.literal(true, { error: '請先同意隱私權政策' }),
  website: z.string().max(0, '偵測到不合法欄位'),
})

export type GrowthAuditPreviewInput = z.infer<typeof growthAuditPreviewSchema>
```

- [ ] **Step 4: Implement the preview-only client form**

Use a client component and `FormData` on submit. Convert `privacyAccepted` to a boolean, validate with `safeParse`, map `error.flatten().fieldErrors` to visible messages linked with `aria-describedby`, and focus the first invalid field. The submit button label is `檢查申請資料`, not `送出申請`.

On valid input, render exactly:

`目前為 Preview，申請資料尚未送出或儲存。正式送出功能將在品牌成長健檢系統完成後啟用。`

Keep all entered values visible. Do not call a route handler, Server Action, Supabase, email provider, analytics, or local storage.

- [ ] **Step 5: Build the audit page**

The page includes:

- H1 `品牌成長健檢`.
- Core statement `先判斷，再談合作。`.
- Six-step process from application through possible blueprint or operations.
- 24-hour contact statement.
- 30-minute online explanation and PDF report as possible inclusions, without `免費`.
- A statement that submission does not guarantee acceptance or cooperation.
- `AuditPreviewForm`.

- [ ] **Step 6: Run tests and commit**

Run:

```bash
npm run test:run -- tests/unit/growth-audit-form.test.tsx tests/unit/public-pages.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

```bash
git add src/lib/validation/growth-audit-preview.ts src/components/public/audit-preview-form.tsx src/app/'(public)'/growth-audit/page.tsx tests/unit/growth-audit-form.test.tsx tests/unit/public-pages.test.tsx
git commit -m "feat: add brand growth audit preview experience"
```

---

### Task 9: Content-Center Entry Pages and Accessible FAQ

**Files:**
- Create: `src/content/content-centers.ts`
- Create: `src/content/faq.ts`
- Create: `src/components/public/accordion.tsx`
- Create: `src/app/(public)/line-gift-academy/page.tsx`
- Create: `src/app/(public)/cases/page.tsx`
- Create: `src/app/(public)/insights/page.tsx`
- Create: `src/app/(public)/faq/page.tsx`
- Create: `src/app/(public)/resources/page.tsx`
- Test: `tests/unit/accordion.test.tsx`
- Modify: `tests/unit/public-pages.test.tsx`

**Interfaces:**
- Produces: `academyCategories`, `insightCategories`, `resourceTypes`, `faqItems`, `Accordion`.
- Consumes: `featuredCases`, page components, public routes.

- [ ] **Step 1: Write failing accordion and page tests**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Accordion } from '@/components/public/accordion'

it('toggles FAQ content with aria-expanded', () => {
  render(
    <Accordion
      items={[{ id: 'fit', question: '什麼品牌適合 LINE 禮物？', answer: '需要從商品與送禮場景一起判斷。' }]}
    />,
  )
  const trigger = screen.getByRole('button', { name: '什麼品牌適合 LINE 禮物？' })
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByText('需要從商品與送禮場景一起判斷。')).toBeVisible()
})
```

Add page tests asserting the five H1 values: `LINE 禮物研究院`, `品牌成長案例`, `品牌觀點`, `常見問題`, `品牌資源中心`.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:run -- tests/unit/accordion.test.tsx tests/unit/public-pages.test.tsx`

Expected: FAIL because the components and pages do not exist.

- [ ] **Step 3: Create exact content-center data**

Academy categories:

- 平台與用戶
- 送禮文化
- 四大送禮場景
- 商品策略
- 價格策略
- 年度檔期
- 營運實戰
- 平台趨勢
- LINE 禮物 FAQ

Insight categories:

- LINE 禮物
- 電商
- 品牌策略
- 商品策略
- 行銷與廣告
- 顧問觀點

Resource types:

- 年度檔期行事曆
- 上架檢查清單
- 商品規劃模板
- 送禮場景指南
- 品牌成長指南
- 白皮書

Render categories and types as non-clickable cards unless a real page route exists. Each entry page explains that the current page is the public index and that articles/resources will be expanded through the content system; do not render a fake detail arrow, fake download button, or disabled anchor.

- [ ] **Step 4: Create approved FAQ data**

Use these six items:

1. `什麼品牌適合進入 LINE 禮物？` — explain that stable supply, service, gifting potential, and willingness to create a hero product are evaluated.
2. `還沒進駐 LINE 禮物，可以先合作嗎？` — say audit and launch planning can begin before entry; platform approval is not guaranteed.
3. `G9G 會保證上架或業績嗎？` — explicitly say no approval, specific revenue, or ranking guarantee.
4. `廣告與站內版位費包含在服務費嗎？` — say ad budget and LINE placement fee are paid separately; strategy and basic placement creative/size adaptation are included according to the selected plan.
5. `三種代營運方案有什麼差異？` — summarize launch, revenue share, and annual operations.
6. `品牌成長健檢會怎麼進行？` — summarize first-stage application, 24-hour contact, questionnaire, 30-minute explanation, and report.

- [ ] **Step 5: Implement Accordion and five pages**

`Accordion` is a client component with per-item button state, `aria-expanded`, `aria-controls`, and matching region IDs. It supports multiple open items and does not animate height when reduced motion is requested.

`CasesPage` renders only the two approved `featuredCases` plus one plain note: `其他過往經驗包含幸福毛球、田園鮮生與保密專案；完整內容將在取得公開授權與資料後補充。` Do not imply all are current clients and do not create empty case cards.

- [ ] **Step 6: Run tests and commit**

Run:

```bash
npm run test:run -- tests/unit/accordion.test.tsx tests/unit/public-pages.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

```bash
git add src/content/content-centers.ts src/content/faq.ts src/components/public/accordion.tsx src/app/'(public)'/line-gift-academy/page.tsx src/app/'(public)'/cases/page.tsx src/app/'(public)'/insights/page.tsx src/app/'(public)'/faq/page.tsx src/app/'(public)'/resources/page.tsx tests/unit/accordion.test.tsx tests/unit/public-pages.test.tsx
git commit -m "feat: add public content center entry pages"
```

---

### Task 10: Contact, Privacy, Terms, and 404 Pages

**Files:**
- Create: `src/content/legal.ts`
- Create: `src/app/(public)/contact/page.tsx`
- Create: `src/app/(public)/privacy/page.tsx`
- Create: `src/app/(public)/terms/page.tsx`
- Create: `src/app/not-found.tsx`
- Modify: `tests/unit/public-pages.test.tsx`

**Interfaces:**
- Produces: `privacySections`, `termsSections`, and four public states.
- Consumes: `ContactMethods`, page components, `companyInfo`, `contactInfo`, `publicRoutes`.

- [ ] **Step 1: Add failing contact, legal, and 404 tests**

```tsx
import ContactPage from '@/app/(public)/contact/page'
import PrivacyPage from '@/app/(public)/privacy/page'
import TermsPage from '@/app/(public)/terms/page'
import NotFound from '@/app/not-found'

it('renders approved contact information without hidden LINE identity', () => {
  const { container } = render(<ContactPage />)
  expect(screen.getByRole('link', { name: '加入 LINE 諮詢' })).toHaveAttribute('href', 'https://lin.ee/QwORXXZ')
  expect(screen.getByText('0915-009-707')).toBeInTheDocument()
  expect(screen.getByText('g9growth@gmail.com')).toBeInTheDocument()
  expect(container.textContent).not.toContain('scrutator')
})

it('renders legal headings and a useful 404', () => {
  render(<PrivacyPage />)
  expect(screen.getByRole('heading', { level: 1, name: '隱私權政策' })).toBeInTheDocument()
  render(<TermsPage />)
  expect(screen.getByRole('heading', { level: 1, name: '網站使用條款' })).toBeInTheDocument()
  render(<NotFound />)
  expect(screen.getByRole('heading', { level: 1, name: '找不到這個頁面' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:run -- tests/unit/public-pages.test.tsx`

Expected: FAIL because these pages do not exist.

- [ ] **Step 3: Create complete legal content**

`privacySections` must cover:

1. 適用範圍。
2. 可能蒐集的資料：contact name, brand name, phone, email, brand URL, and communication records.
3. 使用目的：reply, audit evaluation, cooperation communication, service improvement, and legal obligations.
4. Data sharing: no sale; only necessary service providers or legal requests.
5. Storage and security: reasonable safeguards and deletion/anonymization when no longer needed.
6. User rights: request access, correction, deletion, or stop use through g9growth@gmail.com.
7. External links.
8. Policy changes and contact.

`termsSections` must cover:

1. Website purpose and acceptance.
2. Service descriptions and prices are public information; final scope follows signed proposal/contract.
3. No guarantee of platform approval, revenue, traffic, or ranking.
4. Intellectual property of text, design, trademark, and materials.
5. Prohibited misuse, automated extraction, impersonation, or interference.
6. External service links.
7. Reasonable limitation of liability.
8. Updates and contact.

Use `生效日期：2026 年 7 月 30 日`. Do not add an unconfirmed governing-court clause.

- [ ] **Step 4: Build pages**

`ContactPage` shows audit entry first, then `ContactMethods`, company information, and a note that LINE, phone, and email are for brand cooperation inquiries.

`PrivacyPage` and `TermsPage` render table-of-contents anchor links and semantic sections. `NotFound` renders real links to homepage, services, and audit.

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm run test:run -- tests/unit/public-pages.test.tsx
npm run lint
npm run typecheck
```

Expected: PASS.

```bash
git add src/content/legal.ts src/app/'(public)'/contact/page.tsx src/app/'(public)'/privacy/page.tsx src/app/'(public)'/terms/page.tsx src/app/not-found.tsx tests/unit/public-pages.test.tsx
git commit -m "feat: add contact legal and not-found pages"
```

---

### Task 11: Page Metadata, Canonical URLs, Sitemap, Robots, and JSON-LD

**Files:**
- Create: `src/lib/seo/metadata.ts`
- Create: `src/lib/seo/schema.ts`
- Create: `src/components/public/json-ld.tsx`
- Modify: `src/app/layout.tsx`
- Modify: every public `page.tsx` created in Tasks 5–10
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Test: `tests/unit/seo.test.ts`

**Interfaces:**
- Produces: `createPageMetadata`, `buildOrganizationSchema`, `buildWebSiteSchema`, `buildBreadcrumbSchema`, `JsonLd`.
- Consumes: `siteConfig`, `companyInfo`, `contactInfo`, `publicRoutes`, `indexablePublicRoutes`, `publicEnv`.

- [ ] **Step 1: Write failing SEO helper tests**

```ts
import { describe, expect, it } from 'vitest'
import { createPageMetadata } from '@/lib/seo/metadata'
import { buildOrganizationSchema } from '@/lib/seo/schema'

it('creates page-specific metadata with a canonical path', () => {
  const metadata = createPageMetadata({
    title: '品牌成長代營運',
    description: '公開方案與服務內容。',
    path: '/growth-operations',
  })
  expect(metadata.title).toBe('品牌成長代營運')
  expect(metadata.alternates?.canonical).toBe('/growth-operations')
  expect(metadata.openGraph?.title).toBe('品牌成長代營運｜G9G')
})

it('builds an organization schema from visible company data', () => {
  const schema = buildOrganizationSchema('https://example.com')
  expect(schema['@type']).toBe('Organization')
  expect(schema.name).toBe('盛澄策略顧問')
  expect(JSON.stringify(schema)).not.toContain('scrutator')
})
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:run -- tests/unit/seo.test.ts`

Expected: FAIL because the SEO modules do not exist.

- [ ] **Step 3: Implement metadata helper**

```ts
import type { Metadata } from 'next'

export type PageMetadataInput = {
  title: string
  description: string
  path: string
  noIndex?: boolean
}

export function createPageMetadata({ title, description, path, noIndex = false }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      title: `${title}｜G9G`,
      description,
      url: path,
      siteName: 'G9G｜LINE 禮物品牌成長平台',
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}
```

- [ ] **Step 4: Implement schema builders and JsonLd**

`buildOrganizationSchema(siteUrl)` returns visible company name, URL, email, phone, address, founder, and brand; do not add unverified social profiles.

`buildWebSiteSchema(siteUrl)` returns the G9G name, URL, and description. Do not add SearchAction because site search does not exist.

`buildBreadcrumbSchema(siteUrl, items)` accepts `{ name: string; path: string }[]`, creates absolute URLs, and uses 1-based positions.

`JsonLd` serializes with `JSON.stringify(data).replace(/</g, '\\u003c')` inside `type="application/ld+json"`.

- [ ] **Step 5: Update root and page metadata**

In `src/app/layout.tsx`, use `publicEnv().NEXT_PUBLIC_SITE_URL` for `metadataBase`, set a title template `%s｜G9G`, and update default description to the approved hero supporting copy. Keep the root layout free of public header/footer so admin pages remain unchanged.

Each public page exports `metadata = createPageMetadata(...)` with a unique title, description, and canonical route. The homepage title uses `G9G｜LINE 禮物品牌成長平台` without duplicating the title template; set its absolute title through `{ absolute: 'G9G｜LINE 禮物品牌成長平台' }` if necessary.

Render Organization and WebSite JSON-LD on the homepage. Render BreadcrumbList JSON-LD on all non-home public pages using the same breadcrumb labels visible in the UI.

- [ ] **Step 6: Add sitemap and robots routes**

`sitemap.ts` maps every `indexablePublicRoutes` entry to an absolute URL based on `publicEnv().NEXT_PUBLIC_SITE_URL`, `lastModified: new Date('2026-07-30')`, `changeFrequency: 'weekly'` for content centers and `'monthly'` for corporate/legal pages, and priority `1` for home, `0.9` for service pages, `0.7` for content centers, and `0.4` for legal pages.

`robots.ts` allows `/`, disallows `/admin/` and `/auth/`, and points to the absolute sitemap URL.

- [ ] **Step 7: Run SEO tests, build, and commit**

Run:

```bash
npm run test:run -- tests/unit/seo.test.ts
npm run lint
npm run typecheck
npm run build
```

Expected: PASS and all public routes generated successfully.

```bash
git add src/lib/seo/metadata.ts src/lib/seo/schema.ts src/components/public/json-ld.tsx src/app/layout.tsx src/app/'(public)' src/app/sitemap.ts src/app/robots.ts tests/unit/seo.test.ts
git commit -m "feat: add public metadata and structured data"
```

---

### Task 12: Public E2E Coverage, Responsive Checks, and Full Quality Gate

**Files:**
- Modify: `tests/e2e/foundation.spec.ts`
- Create: `tests/e2e/public-site.spec.ts`
- Modify: `.github/workflows/quality.yml` only if the existing workflow does not already run the unchanged lint, typecheck, unit, build, and Playwright commands.

**Interfaces:**
- Produces: browser-level acceptance coverage for desktop and mobile public journeys.
- Consumes: all public routes and components from Tasks 1–11.

- [ ] **Step 1: Update the foundation homepage smoke assertion**

Replace the old `G9G` H1 assertion with:

```ts
await expect(
  page.getByRole('heading', {
    level: 1,
    name: '讓商品不只上架，而是成為別人想送的理由。',
  }),
).toBeVisible()
```

Keep both admin tests unchanged.

- [ ] **Step 2: Add desktop public-site E2E tests**

```ts
import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/about',
  '/why-g9g',
  '/growth-audit',
  '/growth-blueprint',
  '/growth-operations',
  '/line-gift-academy',
  '/cases',
  '/insights',
  '/faq',
  '/resources',
  '/contact',
  '/privacy',
  '/terms',
]

test('every approved public page renders one visible h1 without horizontal overflow', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow, `${route} has horizontal overflow`).toBe(false)
  }
})

test('homepage audit CTA reaches the audit page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '申請品牌成長健檢' }).first().click()
  await expect(page).toHaveURL('/growth-audit')
  await expect(page.getByRole('heading', { level: 1, name: '品牌成長健檢' })).toBeVisible()
})

test('public pages do not expose prohibited copy', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route)
    const body = await page.locator('body').innerText()
    expect(body).not.toContain('scrutator')
    expect(body).not.toContain('免費品牌健檢')
    expect(body).not.toContain('免費健檢')
  }
})

test('unknown routes show the custom 404 path forward', async ({ page }) => {
  const response = await page.goto('/not-a-real-g9g-page')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: '找不到這個頁面' })).toBeVisible()
  await expect(page.getByRole('link', { name: '申請品牌成長健檢' })).toBeVisible()
})
```

- [ ] **Step 3: Add mobile navigation E2E coverage**

```ts
test('mobile drawer reaches every major destination and restores page scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: '開啟網站選單' }).click()
  await expect(page.getByRole('dialog', { name: '網站選單' })).toBeVisible()
  await page.getByRole('link', { name: '關於 G9G' }).click()
  await expect(page).toHaveURL('/about')
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})
```

Add a second mobile test that opens the service `<details>` group and reaches `/growth-operations`.

- [ ] **Step 4: Run the complete local quality gate**

Run in this exact order:

```bash
npm ci
npm run lint
npm run typecheck
npm run test:run
npm run build
npx playwright install chromium
npm run test:e2e
```

Expected:

- zero lint warnings or errors;
- zero TypeScript errors;
- all unit tests pass;
- production build succeeds;
- all Foundation and public Playwright tests pass.

- [ ] **Step 5: Perform visual and accessibility review at three widths**

Open the production build or Preview at:

- 390 × 844
- 768 × 1024
- 1440 × 1000

Check every route for:

- bright visual system and no unintended full-width dark section;
- header and sticky CTA do not cover content;
- keyboard Tab order follows visual order;
- visible focus on links, buttons, summary controls, form fields, and accordion triggers;
- no text clipped at 200% browser zoom;
- reduced-motion setting removes decorative movement;
- company logo has meaningful alt text and decorative illustration is hidden from assistive technology;
- LINE button opens the approved URL and no account name or QR appears.

When a Vercel Preview URL exists, run Lighthouse against `/`, `/growth-audit`, and `/growth-operations`; Accessibility and SEO must each score at least 90 before the phase is marked complete. Do not create or claim a production deployment.

- [ ] **Step 6: Commit final test coverage**

```bash
git add tests/e2e/foundation.spec.ts tests/e2e/public-site.spec.ts .github/workflows/quality.yml
git commit -m "test: cover public website journeys"
```

- [ ] **Step 7: Request code review before integration**

Use `superpowers:requesting-code-review` against the complete `feature/public-website` diff. Resolve findings with TDD, rerun the full quality gate, and then use `superpowers:finishing-a-development-branch` to present the integration choice. The only allowed integration target for this phase is `develop`; do not merge to `main` and do not publish the production site.

---

## Plan Self-Review Record

- **Spec coverage:** Every approved route, visual rule, CTA rule, company detail, LINE restriction, price, case attribution, preview-form limitation, accessibility requirement, SEO baseline, legal page, and 404 state maps to a task above.
- **Scope boundary:** Database-backed audit submission, email, CMS, revisions, analytics, production Supabase, production Vercel, and production domain work remain outside this plan.
- **Placeholder scan:** The plan contains no implementation placeholders, fake links, undefined task dependencies, or unspecified copy decisions.
- **Type consistency:** Route, content, pricing, validation, metadata, schema, navigation, and component interfaces are defined before consuming tasks and use the same names throughout.
