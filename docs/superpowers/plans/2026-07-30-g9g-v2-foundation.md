# G9G V2 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 G9G V2 可持續開發的 Next.js／Supabase 基礎，包括版本鎖定、測試、Design System、環境驗證、Auth、RBAC、RLS、管理後台 shell 與 CI quality gate。

**Architecture:** 公開網站與 `/admin` 後台共用一個 Next.js App Router 專案；Supabase SSR client 使用 cookie session，`proxy.ts` 只處理 session refresh 與登入導向，真正授權由 server layout／service 與 RLS 執行。基礎資料表只涵蓋 profiles、roles、profile_roles、audit_events，內容與頁面資料表留給後續子計畫。

**Tech Stack:** Node.js 24 LTS、npm、Next.js 16.2.12、React 19.2.8、TypeScript 7.0.2、Tailwind CSS 4.3.3、Supabase JS 2.110.8、Supabase SSR 0.12.3、Zod 4.4.3、Vitest 4.1.10、Testing Library 16.3.2、Playwright 1.62.0、GitHub Actions。

## Global Constraints

- Repository：`leozheng0201/g9g-official-website`。
- 從 `main` 建立 `develop`，再從 `develop` 建立 `feature/foundation`。
- 全站不得使用「免費」形容品牌成長健檢。
- 品牌健檢統一名稱為「品牌成長健檢」，主要 CTA 為「申請品牌成長健檢」。
- 權限不能只靠 UI；必須同時由 server-side guard 與 Supabase RLS 保護。
- Proxy 只做 session refresh 與樂觀導向，不作為完整授權來源。
- Service role key 只能在 server-only module、CLI script 與 CI secret／local env 使用，不能進入 client bundle。
- 未取得真實資料時，Dashboard 只顯示功能狀態，不顯示虛構流量。
- 所有新功能先寫失敗測試，再做最小實作。
- 每一個 task 完成後獨立 commit；不得把多個 task 壓成一個大型 commit。

---

## File Structure

```text
.
├── .env.example
├── .github/workflows/quality.yml
├── .gitignore
├── .nvmrc
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.mts
├── docs/development/local-setup.md
├── scripts/grant-role.ts
├── src
│   ├── app
│   │   ├── (public)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── admin
│   │   │   ├── (protected)
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   └── login
│   │   │       ├── actions.ts
│   │   │       └── page.tsx
│   │   ├── auth/callback/route.ts
│   │   └── globals.css
│   ├── components
│   │   ├── admin/admin-shell.tsx
│   │   ├── brand/brand-mark.tsx
│   │   └── ui/button.tsx
│   ├── lib
│   │   ├── auth/access.ts
│   │   ├── auth/roles.ts
│   │   ├── env/public.ts
│   │   ├── env/server.ts
│   │   ├── routes/admin.ts
│   │   ├── supabase/admin.ts
│   │   ├── supabase/client.ts
│   │   ├── supabase/proxy.ts
│   │   └── supabase/server.ts
│   ├── proxy.ts
│   └── test/setup.ts
├── supabase
│   ├── config.toml
│   ├── migrations/202607300001_foundation_auth_rbac.sql
│   └── tests/0001_foundation_auth_rbac.test.sql
└── tests
    ├── e2e/foundation.spec.ts
    └── unit
        ├── access.test.ts
        ├── admin-routes.test.ts
        ├── button.test.tsx
        ├── env.test.ts
        └── home.test.tsx
```

## Shared Interfaces

The following names are fixed for all tasks in this plan:

```ts
export type AppRole = 'super_admin' | 'editor' | 'marketing' | 'service'

export type CurrentAccess = {
  userId: string
  email: string
  roles: AppRole[]
}

export function hasAnyRole(
  roles: readonly AppRole[],
  allowed: readonly AppRole[],
): boolean

export async function getCurrentAccess(): Promise<CurrentAccess | null>

export async function requireRole(
  allowed: readonly AppRole[],
): Promise<CurrentAccess>
```

Environment interfaces:

```ts
export type PublicEnv = {
  NEXT_PUBLIC_SITE_URL: string
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string
}

export type ServerEnv = PublicEnv & {
  SUPABASE_SERVICE_ROLE_KEY: string
}
```

---

### Task 1: Repository and Next.js baseline

**Files:**
- Create: `.nvmrc`
- Create: `.gitignore`
- Create: `package.json`
- Create: `package-lock.json` through `npm install`
- Create: `next-env.d.ts`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/app/(public)/layout.tsx`
- Create: `src/app/(public)/page.tsx`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:run`, `test:e2e`, `db:start`, `db:stop`, `db:reset`, `db:test`, `admin:grant`.
- Produces: a working public route `/` with visible brand name `G9G` and positioning `LINE 禮物品牌成長平台`.

- [ ] **Step 1: Create the branch structure**

```bash
git checkout main
git pull --ff-only
git checkout -b develop
git push -u origin develop
git checkout -b feature/foundation
```

Expected: current branch is `feature/foundation`, based on `develop`.

- [ ] **Step 2: Create `.nvmrc`**

```text
24
```

- [ ] **Step 3: Create `package.json` with pinned core versions**

```json
{
  "name": "g9g-official-website",
  "version": "2.0.0-alpha.1",
  "private": true,
  "engines": {
    "node": ">=24 <25"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "db:start": "supabase start",
    "db:stop": "supabase stop",
    "db:reset": "supabase db reset",
    "db:test": "supabase test db",
    "admin:grant": "tsx scripts/grant-role.ts"
  },
  "dependencies": {
    "@supabase/ssr": "0.12.3",
    "@supabase/supabase-js": "2.110.8",
    "clsx": "latest",
    "next": "16.2.12",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "tailwind-merge": "latest",
    "zod": "4.4.3"
  },
  "devDependencies": {
    "@playwright/test": "1.62.0",
    "@tailwindcss/postcss": "4.3.3",
    "@testing-library/dom": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "16.3.2",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@vitejs/plugin-react": "latest",
    "eslint": "latest",
    "eslint-config-next": "16.2.12",
    "jsdom": "latest",
    "supabase": "latest",
    "tailwindcss": "4.3.3",
    "tsx": "latest",
    "typescript": "7.0.2",
    "vite-tsconfig-paths": "latest",
    "vitest": "4.1.10"
  }
}
```

`latest` is allowed only for secondary tooling in this first install; `package-lock.json` becomes the exact immutable dependency record and must be committed. Core runtime versions are explicitly pinned.

- [ ] **Step 4: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` exists and `npm ls --depth=0` exits 0.

- [ ] **Step 5: Create the TypeScript and Next.js configuration**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

`next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

`next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
```

`postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

`eslint.config.mjs`:

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores(['.next/**', 'coverage/**', 'playwright-report/**', 'test-results/**']),
])
```

- [ ] **Step 6: Create the minimum public application**

`src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
  --g9g-ink: #151a17;
  --g9g-paper: #fffdf8;
  --g9g-surface: #f4f0e7;
  --g9g-line: #d8ddd8;
  --g9g-green: #06c755;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--g9g-surface);
}

body {
  margin: 0;
  color: var(--g9g-ink);
  background: var(--g9g-paper);
  font-family: Arial, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
}
```

`src/app/(public)/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'G9G｜LINE 禮物品牌成長平台',
  description: '讓品牌成長，不只是把商品上架。',
}

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children
}
```

`src/app/(public)/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>G9G</h1>
      <p>LINE 禮物品牌成長平台</p>
    </main>
  )
}
```

- [ ] **Step 7: Create `.gitignore`**

```text
node_modules
.next
out
coverage
playwright-report
test-results
.env
.env.local
.env.*.local
!.env.example
.supabase
.DS_Store
*.log
```

- [ ] **Step 8: Run the baseline checks**

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

Expected: all commands exit 0 and the build lists `/` as a route.

- [ ] **Step 9: Commit**

```bash
git add .nvmrc .gitignore package.json package-lock.json next-env.d.ts next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs src/app
git commit -m "chore: bootstrap G9G Next.js foundation"
```

---

### Task 2: Test harness and first public smoke test

**Files:**
- Create: `vitest.config.mts`
- Create: `src/test/setup.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/home.test.tsx`
- Create: `tests/e2e/foundation.spec.ts`

**Interfaces:**
- Produces: Vitest `jsdom` environment with Testing Library matchers.
- Produces: Playwright Chromium project with `baseURL=http://127.0.0.1:3000`.

- [ ] **Step 1: Write the unit test before test configuration exists**

`tests/unit/home.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HomePage from '@/app/(public)/page'

describe('HomePage', () => {
  it('states the G9G LINE Gift positioning', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'G9G' })).toBeInTheDocument()
    expect(screen.getByText('LINE 禮物品牌成長平台')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the unit test and verify configuration failure**

Run:

```bash
npm run test:run -- tests/unit/home.test.tsx
```

Expected: FAIL because Vitest cannot resolve the Next.js alias or `toBeInTheDocument` is unavailable.

- [ ] **Step 3: Add Vitest configuration**

`vitest.config.mts`:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
})
```

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Run the unit test**

Run:

```bash
npm run test:run -- tests/unit/home.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Write the E2E smoke test**

`tests/e2e/foundation.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('public home identifies G9G as a LINE Gift growth platform', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'G9G' })).toBeVisible()
  await expect(page.getByText('LINE 禮物品牌成長平台')).toBeVisible()
})
```

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] **Step 6: Install the Playwright browser and run smoke test**

Run:

```bash
npx playwright install chromium
npm run test:e2e -- tests/e2e/foundation.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.mts playwright.config.ts src/test tests
git commit -m "test: establish unit and browser smoke tests"
```

---

### Task 3: Environment validation

**Files:**
- Create: `.env.example`
- Create: `src/lib/env/public.ts`
- Create: `src/lib/env/server.ts`
- Create: `tests/unit/env.test.ts`

**Interfaces:**
- Produces: `parsePublicEnv(input: Record<string, string | undefined>): PublicEnv`.
- Produces: `parseServerEnv(input: Record<string, string | undefined>): ServerEnv`.
- Produces: `publicEnv()` and `serverEnv()` memoized accessors.

- [ ] **Step 1: Write failing environment tests**

`tests/unit/env.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { parsePublicEnv } from '@/lib/env/public'
import { parseServerEnv } from '@/lib/env/server'

const validPublic = {
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
}

describe('environment parsing', () => {
  it('parses valid public configuration', () => {
    expect(parsePublicEnv(validPublic)).toEqual(validPublic)
  })

  it('rejects an invalid site URL', () => {
    expect(() => parsePublicEnv({ ...validPublic, NEXT_PUBLIC_SITE_URL: 'g9g' })).toThrow()
  })

  it('requires the server-only service role key', () => {
    expect(() => parseServerEnv(validPublic)).toThrow('SUPABASE_SERVICE_ROLE_KEY')
  })
})
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm run test:run -- tests/unit/env.test.ts
```

Expected: FAIL because the env modules do not exist.

- [ ] **Step 3: Implement public env parsing**

`src/lib/env/public.ts`:

```ts
import { z } from 'zod'

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})

export type PublicEnv = z.infer<typeof publicEnvSchema>

export function parsePublicEnv(input: Record<string, string | undefined>): PublicEnv {
  return publicEnvSchema.parse(input)
}

let cached: PublicEnv | undefined

export function publicEnv(): PublicEnv {
  cached ??= parsePublicEnv(process.env)
  return cached
}
```

- [ ] **Step 4: Implement server env parsing without leaking secrets**

`src/lib/env/server.ts`:

```ts
import 'server-only'
import { z } from 'zod'
import { parsePublicEnv, type PublicEnv } from './public'

const serverOnlySchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

export type ServerEnv = PublicEnv & z.infer<typeof serverOnlySchema>

export function parseServerEnv(input: Record<string, string | undefined>): ServerEnv {
  return {
    ...parsePublicEnv(input),
    ...serverOnlySchema.parse(input),
  }
}

let cached: ServerEnv | undefined

export function serverEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env)
  return cached
}
```

- [ ] **Step 5: Add `.env.example`**

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=replace-with-local-publishable-key
SUPABASE_SERVICE_ROLE_KEY=replace-with-local-service-role-key
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm run test:run -- tests/unit/env.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add .env.example src/lib/env tests/unit/env.test.ts
git commit -m "feat: validate public and server environment"
```

---

### Task 4: Design tokens and UI primitives

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/utils/cn.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/brand/brand-mark.tsx`
- Create: `tests/unit/button.test.tsx`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string`.
- Produces: `<Button variant="primary|secondary|ghost" size="sm|md|lg" />`.
- Produces: `<BrandMark compact?: boolean />`.

- [ ] **Step 1: Write failing component tests**

`tests/unit/button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'

describe('foundation UI', () => {
  it('renders an accessible primary button', () => {
    render(<Button>申請品牌成長健檢</Button>)
    const button = screen.getByRole('button', { name: '申請品牌成長健檢' })
    expect(button).toHaveAttribute('data-variant', 'primary')
  })

  it('renders the official positioning in the full brand mark', () => {
    render(<BrandMark />)
    expect(screen.getByText('LINE 禮物品牌成長平台')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm run test:run -- tests/unit/button.test.tsx
```

Expected: FAIL because components do not exist.

- [ ] **Step 3: Implement class merging**

`src/lib/utils/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Implement the Button primitive**

`src/components/ui/button.tsx`:

```tsx
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-ink border-ink hover:translate-x-0.5 hover:translate-y-0.5',
  secondary: 'bg-paper text-ink border-ink',
  ghost: 'bg-transparent text-ink border-transparent',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-base',
  lg: 'min-h-12 px-5 text-lg',
}

export function Button({ className, variant = 'primary', size = 'md', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      className={cn(
        'inline-flex items-center justify-center border font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 5: Implement the brand mark**

`src/components/brand/brand-mark.tsx`:

```tsx
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div aria-label="G9G LINE 禮物品牌成長平台" className="inline-flex items-center gap-3">
      <span aria-hidden="true" className="grid size-11 place-items-center bg-ink font-black text-paper shadow-[5px_5px_0_var(--g9g-green)]">
        G9G
      </span>
      {!compact && (
        <span className="grid leading-tight">
          <strong>G9G</strong>
          <small className="text-xs tracking-wide text-muted">LINE 禮物品牌成長平台</small>
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Replace global CSS with named tokens and Tailwind theme mapping**

`src/app/globals.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
  --g9g-ink: #151a17;
  --g9g-paper: #fffdf8;
  --g9g-surface: #f4f0e7;
  --g9g-muted: #687069;
  --g9g-line: #d8ddd8;
  --g9g-green: #06c755;
  --g9g-green-dark: #075c2b;
  --g9g-warning: #f2d79a;
  --g9g-danger: #b42318;
  --g9g-radius-sm: 0.25rem;
  --g9g-radius-md: 0.5rem;
  --g9g-shadow: 6px 6px 0 #151a17;
}

@theme inline {
  --color-ink: var(--g9g-ink);
  --color-paper: var(--g9g-paper);
  --color-surface: var(--g9g-surface);
  --color-muted: var(--g9g-muted);
  --color-line: var(--g9g-line);
  --color-brand: var(--g9g-green);
  --color-brand-dark: var(--g9g-green-dark);
  --color-warning: var(--g9g-warning);
  --color-danger: var(--g9g-danger);
}

* {
  box-sizing: border-box;
}

html {
  background: var(--g9g-surface);
}

body {
  margin: 0;
  color: var(--g9g-ink);
  background: var(--g9g-paper);
  font-family: Arial, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
}

::selection {
  color: var(--g9g-ink);
  background: var(--g9g-green);
}
```

- [ ] **Step 7: Run tests and build**

Run:

```bash
npm run test:run -- tests/unit/button.test.tsx
npm run lint
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/components src/lib/utils tests/unit/button.test.tsx
git commit -m "feat: add G9G design tokens and UI primitives"
```

---

### Task 5: Supabase local schema, RBAC functions, and RLS tests

**Files:**
- Create: `supabase/config.toml` through `npx supabase init`
- Create: `supabase/migrations/202607300001_foundation_auth_rbac.sql`
- Create: `supabase/tests/0001_foundation_auth_rbac.test.sql`

**Interfaces:**
- Produces database function: `public.has_role(role_key text) returns boolean`.
- Produces database function: `public.handle_new_user() returns trigger`.
- Produces roles: `super_admin`, `editor`, `marketing`, `service`.
- Produces tables: `profiles`, `roles`, `profile_roles`, `audit_events`.

- [ ] **Step 1: Initialize Supabase**

Run:

```bash
npx supabase init
```

Expected: `supabase/config.toml` exists.

- [ ] **Step 2: Write the database test before the migration**

`supabase/tests/0001_foundation_auth_rbac.test.sql`:

```sql
begin;

select plan(10);

select ok(to_regclass('public.profiles') is not null, 'profiles exists');
select ok(to_regclass('public.roles') is not null, 'roles exists');
select ok(to_regclass('public.profile_roles') is not null, 'profile_roles exists');
select ok(to_regclass('public.audit_events') is not null, 'audit_events exists');

select is(
  (select count(*)::integer from public.roles),
  4,
  'four fixed roles are seeded'
);

select results_eq(
  $$select key from public.roles order by key$$,
  $$values ('editor'), ('marketing'), ('service'), ('super_admin')$$,
  'role keys match the application contract'
);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'profiles RLS is enabled'
);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.profile_roles'::regclass),
  'profile_roles RLS is enabled'
);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.audit_events'::regclass),
  'audit_events RLS is enabled'
);

select has_function('public', 'has_role', array['text'], 'has_role exists');

select * from finish();
rollback;
```

- [ ] **Step 3: Run the DB test to verify failure**

Run:

```bash
npm run db:start
npm run db:test
```

Expected: FAIL because the tables and function do not exist.

- [ ] **Step 4: Create the foundation migration**

`supabase/migrations/202607300001_foundation_auth_rbac.sql`:

```sql
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('super_admin', 'editor', 'marketing', 'service')),
  label text not null,
  created_at timestamptz not null default now()
);

create table public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles(id),
  primary key (profile_id, role_id)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.roles (key, label)
values
  ('super_admin', '超級管理員'),
  ('editor', '編輯'),
  ('marketing', '行銷'),
  ('service', '客服')
on conflict (key) do update set label = excluded.label;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name),
        updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.has_role(role_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profile_roles pr
    join public.roles r on r.id = pr.role_id
    where pr.profile_id = auth.uid()
      and r.key = role_key
  );
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.profile_roles enable row level security;
alter table public.audit_events enable row level security;

revoke all on public.profiles, public.roles, public.profile_roles, public.audit_events from anon;
grant select on public.profiles, public.roles, public.profile_roles, public.audit_events to authenticated;

action_policy_placeholder:

create policy profiles_select_self_or_super_admin
on public.profiles for select to authenticated
using (id = auth.uid() or public.has_role('super_admin'));

create policy roles_select_authenticated
on public.roles for select to authenticated
using (true);

create policy profile_roles_select_self_or_super_admin
on public.profile_roles for select to authenticated
using (profile_id = auth.uid() or public.has_role('super_admin'));

create policy audit_events_select_super_admin
on public.audit_events for select to authenticated
using (public.has_role('super_admin'));
```

Before saving the file, remove the literal line `action_policy_placeholder:`. It is included here solely as a visual separator and must not exist in SQL.

- [ ] **Step 5: Reset the local database and run tests**

Run:

```bash
npm run db:reset
npm run db:test
```

Expected: all 10 pgTAP assertions PASS.

- [ ] **Step 6: Verify unauthenticated access is denied**

Run:

```bash
npx supabase db lint
```

Expected: no security errors for the four new tables.

- [ ] **Step 7: Commit**

```bash
git add supabase
git commit -m "feat: add Supabase auth profile and RBAC schema"
```

---

### Task 6: Supabase clients and Next.js session proxy

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/admin.ts`
- Create: `src/lib/supabase/proxy.ts`
- Create: `src/lib/routes/admin.ts`
- Create: `src/proxy.ts`
- Create: `tests/unit/admin-routes.test.ts`

**Interfaces:**
- Produces: `createBrowserSupabaseClient()`.
- Produces: `createServerSupabaseClient()`.
- Produces: `createAdminSupabaseClient()`.
- Produces: `updateSession(request: NextRequest): Promise<NextResponse>`.
- Produces: `isPublicAdminPath(pathname: string): boolean`.

- [ ] **Step 1: Write failing route-classification tests**

`tests/unit/admin-routes.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { isPublicAdminPath } from '@/lib/routes/admin'

describe('admin route classification', () => {
  it.each(['/admin/login', '/auth/callback'])('treats %s as public', (pathname) => {
    expect(isPublicAdminPath(pathname)).toBe(true)
  })

  it.each(['/admin', '/admin/content', '/admin/settings'])('protects %s', (pathname) => {
    expect(isPublicAdminPath(pathname)).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm run test:run -- tests/unit/admin-routes.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement route classification**

`src/lib/routes/admin.ts`:

```ts
const publicAdminPaths = new Set(['/admin/login', '/auth/callback'])

export function isPublicAdminPath(pathname: string): boolean {
  return publicAdminPaths.has(pathname)
}
```

- [ ] **Step 4: Implement Supabase browser, server, and admin clients**

`src/lib/supabase/client.ts`:

```ts
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { publicEnv } from '@/lib/env/public'

export function createBrowserSupabaseClient() {
  const env = publicEnv()
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
}
```

`src/lib/supabase/server.ts`:

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { publicEnv } from '@/lib/env/public'

export async function createServerSupabaseClient() {
  const env = publicEnv()
  const cookieStore = await cookies()

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Server Components cannot always write cookies; proxy.ts performs refresh.
        }
      },
    },
  })
}
```

`src/lib/supabase/admin.ts`:

```ts
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { serverEnv } from '@/lib/env/server'

export function createAdminSupabaseClient() {
  const env = serverEnv()
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
```

- [ ] **Step 5: Implement session refresh and login redirect**

`src/lib/supabase/proxy.ts`:

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { publicEnv } from '@/lib/env/public'
import { isPublicAdminPath } from '@/lib/routes/admin'

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const env = publicEnv()
  let response = NextResponse.next({ request })

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  const { data } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin') && !isPublicAdminPath(pathname) && !data.user) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/admin/login' && data.user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}
```

`src/proxy.ts`:

```ts
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*', '/auth/callback'],
}
```

- [ ] **Step 6: Run unit, type, and build checks**

Create `.env.local` from the running local Supabase values before the build:

```bash
cp .env.example .env.local
npx supabase status -o env
```

Copy `API_URL` to `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY` or publishable key to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SERVICE_ROLE_KEY` to `SUPABASE_SERVICE_ROLE_KEY`.

Run:

```bash
npm run test:run -- tests/unit/admin-routes.test.ts
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/routes src/lib/supabase src/proxy.ts tests/unit/admin-routes.test.ts
git commit -m "feat: add Supabase SSR clients and session proxy"
```

---

### Task 7: Authentication, role guards, admin shell, and grant-role CLI

**Files:**
- Create: `src/lib/auth/roles.ts`
- Create: `src/lib/auth/access.ts`
- Create: `src/app/admin/login/actions.ts`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/auth/callback/route.ts`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/app/admin/(protected)/layout.tsx`
- Create: `src/app/admin/(protected)/page.tsx`
- Create: `scripts/grant-role.ts`
- Create: `tests/unit/access.test.ts`
- Modify: `tests/e2e/foundation.spec.ts`

**Interfaces:**
- Produces the fixed `AppRole`, `CurrentAccess`, `hasAnyRole`, `getCurrentAccess`, `requireRole` interfaces.
- Produces login actions: `signInWithPassword(formData: FormData)` and `signInWithGoogle()`.
- Produces CLI: `npm run admin:grant -- --email <email> --role <role>`.

- [ ] **Step 1: Write failing role tests**

`tests/unit/access.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { hasAnyRole, type AppRole } from '@/lib/auth/roles'

describe('hasAnyRole', () => {
  it('allows a matching role', () => {
    expect(hasAnyRole(['editor'], ['super_admin', 'editor'])).toBe(true)
  })

  it('denies non-matching roles', () => {
    expect(hasAnyRole(['service'], ['super_admin', 'marketing'])).toBe(false)
  })

  it('denies an empty role list', () => {
    expect(hasAnyRole([] as AppRole[], ['super_admin'])).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify failure**

Run:

```bash
npm run test:run -- tests/unit/access.test.ts
```

Expected: FAIL because role module does not exist.

- [ ] **Step 3: Implement role types and pure authorization**

`src/lib/auth/roles.ts`:

```ts
export type AppRole = 'super_admin' | 'editor' | 'marketing' | 'service'

export type CurrentAccess = {
  userId: string
  email: string
  roles: AppRole[]
}

export function hasAnyRole(roles: readonly AppRole[], allowed: readonly AppRole[]): boolean {
  return roles.some((role) => allowed.includes(role))
}
```

- [ ] **Step 4: Implement server-side access guards**

`src/lib/auth/access.ts`:

```ts
import 'server-only'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { hasAnyRole, type AppRole, type CurrentAccess } from './roles'

export async function getCurrentAccess(): Promise<CurrentAccess | null> {
  const supabase = await createServerSupabaseClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user?.email) return null

  const { data, error } = await supabase
    .from('profile_roles')
    .select('roles!inner(key)')
    .eq('profile_id', user.id)

  if (error) throw new Error(`Unable to read user roles: ${error.message}`)

  const roles = (data ?? [])
    .map((row) => {
      const role = row.roles as unknown as { key: AppRole }
      return role.key
    })

  return { userId: user.id, email: user.email, roles }
}

export async function requireRole(allowed: readonly AppRole[]): Promise<CurrentAccess> {
  const access = await getCurrentAccess()
  if (!access) redirect('/admin/login')
  if (!hasAnyRole(access.roles, allowed)) redirect('/admin/forbidden')
  return access
}
```

Also create `src/app/admin/forbidden/page.tsx`:

```tsx
export default function ForbiddenPage() {
  return (
    <main>
      <h1>沒有權限</h1>
      <p>此帳號沒有進入這個管理區域的權限。</p>
    </main>
  )
}
```

- [ ] **Step 5: Implement email/password and Google login actions**

`src/app/admin/login/actions.ts`:

```ts
'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { publicEnv } from '@/lib/env/public'

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) redirect(`/admin/login?error=${encodeURIComponent('登入失敗，請確認帳號與密碼。')}`)
  redirect('/admin')
}

export async function signInWithGoogle() {
  const supabase = await createServerSupabaseClient()
  const { NEXT_PUBLIC_SITE_URL } = publicEnv()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin` },
  })

  if (error || !data.url) redirect(`/admin/login?error=${encodeURIComponent('Google 登入暫時無法使用。')}`)
  redirect(data.url)
}
```

- [ ] **Step 6: Implement login page and callback**

`src/app/admin/login/page.tsx`:

```tsx
import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'
import { signInWithGoogle, signInWithPassword } from './actions'

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <main className="grid min-h-screen place-items-center bg-surface p-6">
      <section className="w-full max-w-md border border-ink bg-paper p-8 shadow-[8px_8px_0_var(--g9g-ink)]">
        <BrandMark />
        <h1 className="mt-8 text-3xl font-black">G9G Admin</h1>
        <p className="text-muted">登入後管理官方網站與品牌成長內容。</p>
        {error && <p role="alert" className="mt-4 text-danger">{error}</p>}
        <form action={signInWithPassword} className="mt-6 grid gap-4">
          <label className="grid gap-1 font-bold">Email<input className="min-h-11 border border-line px-3" name="email" type="email" required /></label>
          <label className="grid gap-1 font-bold">密碼<input className="min-h-11 border border-line px-3" name="password" type="password" required /></label>
          <Button type="submit">登入</Button>
        </form>
        <form action={signInWithGoogle} className="mt-3">
          <Button className="w-full" variant="secondary" type="submit">使用 Google 登入</Button>
        </form>
      </section>
    </main>
  )
}
```

`src/app/auth/callback/route.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = request.nextUrl.searchParams.get('next') ?? '/admin'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, request.url))
  }

  return NextResponse.redirect(new URL('/admin/login?error=登入驗證失敗', request.url))
}
```

- [ ] **Step 7: Implement admin shell and protected dashboard**

`src/components/admin/admin-shell.tsx`:

```tsx
import Link from 'next/link'
import type { CurrentAccess } from '@/lib/auth/roles'
import { BrandMark } from '@/components/brand/brand-mark'

export function AdminShell({ access, children }: { access: CurrentAccess; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-ink lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-line bg-ink p-6 text-paper lg:min-h-screen lg:border-b-0 lg:border-r">
        <BrandMark compact />
        <nav aria-label="後台導覽" className="mt-8 grid gap-2">
          <Link href="/admin">Dashboard</Link>
        </nav>
        <p className="mt-8 break-all text-sm text-line">{access.email}</p>
      </aside>
      <div>{children}</div>
    </div>
  )
}
```

`src/app/admin/(protected)/layout.tsx`:

```tsx
import { AdminShell } from '@/components/admin/admin-shell'
import { requireRole } from '@/lib/auth/access'

const adminRoles = ['super_admin', 'editor', 'marketing', 'service'] as const

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const access = await requireRole(adminRoles)
  return <AdminShell access={access}>{children}</AdminShell>
}
```

`src/app/admin/(protected)/page.tsx`:

```tsx
export default function AdminDashboardPage() {
  return (
    <main className="p-6 lg:p-10">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-dark">Foundation</p>
      <h1 className="mt-2 text-4xl font-black">Dashboard</h1>
      <p className="mt-4 max-w-2xl text-muted">系統基礎已連線。內容、健檢、SEO 與分析模組將依後續計畫逐步啟用；目前不顯示任何虛構營運數據。</p>
    </main>
  )
}
```

- [ ] **Step 8: Implement role grant CLI**

`scripts/grant-role.ts`:

```ts
import { createClient } from '@supabase/supabase-js'
import { parseArgs } from 'node:util'
import { parseServerEnv } from '../src/lib/env/server'

const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    role: { type: 'string' },
  },
})

const email = values.email?.trim().toLowerCase()
const role = values.role
const allowed = new Set(['super_admin', 'editor', 'marketing', 'service'])

if (!email || !role || !allowed.has(role)) {
  throw new Error('Usage: npm run admin:grant -- --email user@example.com --role super_admin')
}

const env = parseServerEnv(process.env)
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data: users, error: usersError } = await supabase.auth.admin.listUsers({ perPage: 1000 })
if (usersError) throw usersError

const user = users.users.find((candidate) => candidate.email?.toLowerCase() === email)
if (!user) throw new Error(`No Supabase Auth user found for ${email}`)

const { data: roleRow, error: roleError } = await supabase.from('roles').select('id').eq('key', role).single()
if (roleError) throw roleError

const { error: grantError } = await supabase.from('profile_roles').upsert({
  profile_id: user.id,
  role_id: roleRow.id,
})
if (grantError) throw grantError

const { error: auditError } = await supabase.from('audit_events').insert({
  actor_id: null,
  event_type: 'role.granted.cli',
  entity_type: 'profile',
  entity_id: user.id,
  metadata: { email, role },
})
if (auditError) throw auditError

console.log(`Granted ${role} to ${email}`)
```

- [ ] **Step 9: Add E2E checks for login and protected route**

Append to `tests/e2e/foundation.spec.ts`:

```ts
test('admin login page is available', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(page.getByRole('heading', { name: 'G9G Admin' })).toBeVisible()
  await expect(page.getByRole('button', { name: '登入' })).toBeVisible()
})

test('anonymous visitor is redirected from admin dashboard', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin$/)
})
```

- [ ] **Step 10: Run all checks**

Run:

```bash
npm run test:run
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

Expected: PASS. The anonymous `/admin` test requires local Supabase to be running with valid `.env.local` values.

- [ ] **Step 11: Create an Auth user and grant the initial super admin role**

Create or invite the admin account in local Supabase Studio, sign in once so `profiles` is created, then run:

```bash
npm run admin:grant -- --email g9growth@gmail.com --role super_admin
```

Expected output:

```text
Granted super_admin to g9growth@gmail.com
```

- [ ] **Step 12: Commit**

```bash
git add src/app/admin src/app/auth src/components/admin src/lib/auth scripts tests
git commit -m "feat: add admin authentication and role guards"
```

---

### Task 8: GitHub Actions quality gate and local development guide

**Files:**
- Create: `.github/workflows/quality.yml`
- Create: `docs/development/local-setup.md`
- Modify: `README.md` if it exists; otherwise create it.

**Interfaces:**
- Produces CI jobs: `application` and `database`.
- Produces developer commands documented exactly as package scripts.

- [ ] **Step 1: Create the CI workflow**

`.github/workflows/quality.yml`:

```yaml
name: Quality

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop, main]

permissions:
  contents: read

jobs:
  application:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx supabase start
      - name: Export local Supabase environment
        shell: bash
        run: |
          eval "$(npx supabase status -o env)"
          echo "NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000" >> "$GITHUB_ENV"
          echo "NEXT_PUBLIC_SUPABASE_URL=$API_URL" >> "$GITHUB_ENV"
          echo "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$ANON_KEY" >> "$GITHUB_ENV"
          echo "SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY" >> "$GITHUB_ENV"
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:run
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - if: always()
        run: npx supabase stop --no-backup

  database:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx supabase start
      - run: npm run db:reset
      - run: npm run db:test
      - run: npx supabase db lint
      - if: always()
        run: npx supabase stop --no-backup
```

- [ ] **Step 2: Create the local development guide**

`docs/development/local-setup.md`:

```markdown
# G9G V2 本機開發

## 需求

- Node.js 24 LTS
- Docker Desktop
- Git

## 啟動

```bash
nvm use
npm install
npm run db:start
npx supabase status -o env
cp .env.example .env.local
```

將 Supabase 輸出的 `API_URL`、`ANON_KEY`、`SERVICE_ROLE_KEY` 分別填入 `.env.local` 的 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`、`SUPABASE_SERVICE_ROLE_KEY`。

```bash
npm run db:reset
npm run dev
```

公開網站：`http://localhost:3000`  
後台登入：`http://localhost:3000/admin/login`  
Supabase Studio：由 `npx supabase status` 顯示。

## 建立第一位管理員

1. 在 Supabase Studio 建立或邀請 `g9growth@gmail.com`。
2. 登入一次，確認 `public.profiles` 已產生資料。
3. 執行：

```bash
npm run admin:grant -- --email g9growth@gmail.com --role super_admin
```

## 完整驗證

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run db:test
npm run test:e2e
```

所有命令通過前，不得宣告 Foundation 完成。
```

- [ ] **Step 3: Create or update README**

`README.md`:

```markdown
# G9G Official Website V2

G9G｜LINE 禮物品牌成長平台的正式官網與專屬 CMS。

## 目前階段

Foundation：Next.js、Design System、Supabase Auth／RBAC／RLS、管理後台 shell、測試與 CI。

## 文件

- [V2 設計規格](docs/superpowers/specs/2026-07-30-g9g-official-website-v2-design.md)
- [V2 實作總藍圖](docs/superpowers/plans/2026-07-30-g9g-v2-roadmap.md)
- [Foundation 實作計畫](docs/superpowers/plans/2026-07-30-g9g-v2-foundation.md)
- [本機開發](docs/development/local-setup.md)
```

- [ ] **Step 4: Run the same commands locally before pushing**

Run:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run db:reset
npm run db:test
npm run test:e2e
```

Expected: every command exits 0.

- [ ] **Step 5: Commit and push**

```bash
git add .github README.md docs/development
git commit -m "ci: enforce Foundation quality gates"
git push -u origin feature/foundation
```

- [ ] **Step 6: Open a pull request to `develop`**

PR title:

```text
feat: establish G9G V2 foundation
```

PR body:

```markdown
## Summary

- bootstraps Next.js 16 and the G9G design foundation
- adds Supabase Auth, RBAC, RLS and admin shell
- adds unit, database and Playwright smoke tests
- adds CI and local setup documentation

## Verification

- [ ] npm run lint
- [ ] npm run typecheck
- [ ] npm run test:run
- [ ] npm run build
- [ ] npm run db:test
- [ ] npm run test:e2e
```

Expected: CI jobs `application` and `database` pass before merge.

---

## Foundation Acceptance Checklist

- [ ] Node 24、Next 16.2.12、React 19.2.8、TypeScript 7.0.2 與 Tailwind 4.3.3 已鎖定。
- [ ] 公開首頁顯示 `G9G` 與 `LINE 禮物品牌成長平台`。
- [ ] Design tokens 與 Button／BrandMark primitives 有自動測試。
- [ ] 環境變數以 Zod 驗證，service role 不會進入 client module。
- [ ] Supabase local migration 可重建 profiles、roles、profile_roles、audit_events。
- [ ] 四個固定角色已 seed，RLS 已啟用並有 pgTAP 測試。
- [ ] `proxy.ts` 只處理 session refresh／登入導向，server layout 執行角色授權。
- [ ] `/admin/login` 可顯示 Email／Password 與 Google 登入。
- [ ] 匿名使用者進入 `/admin` 會被導向登入頁。
- [ ] 無角色登入者無法進入管理區。
- [ ] super admin 能看見 Dashboard shell，且 Dashboard 不顯示假數據。
- [ ] `g9growth@gmail.com` 可透過 CLI 被授予 `super_admin`。
- [ ] GitHub Actions application／database jobs 全部通過。
- [ ] Foundation PR 合併至 `develop`，不直接合併 `main`。

## Self-Review Notes

- Scope is limited to framework, design foundation, Auth/RBAC/RLS, admin shell, tests and CI. No content CMS tables or business pages are introduced here.
- Every implementation task ends in a testable deliverable and separate commit.
- All interfaces consumed by later tasks are named in this plan.
- No production deployment is performed in Foundation; deployment belongs to Hardening & Release.
