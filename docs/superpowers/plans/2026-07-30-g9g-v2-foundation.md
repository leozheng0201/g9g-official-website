# G9G V2 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 G9G V2 可持續開發的 Next.js／Supabase 基礎，包括版本鎖定、測試、Design System、環境驗證、Auth、RBAC、RLS、管理後台 shell 與 CI quality gate。

**Architecture:** 公開網站與 `/admin` 後台共用一個 Next.js App Router 專案；Supabase SSR client 使用 cookie session。`proxy.ts` 只負責 session refresh 與登入導向，真正授權由 server layout／service 與 RLS 執行。Foundation 只建立 profiles、roles、profile_roles、audit_events，不提前建立內容 CMS 資料表。

**Tech Stack:** Node.js 24 LTS、npm、Next.js 16.2.12、React 19.2.8、TypeScript 7.0.2、Tailwind CSS 4.3.3、Supabase JS 2.110.8、Supabase SSR 0.12.3、Zod 4.4.3、Vitest 4.1.10、Testing Library 16.3.2、Playwright 1.62.0、GitHub Actions。

## Global Constraints

- Repository：`leozheng0201/g9g-official-website`。
- 從 `main` 建立 `develop`，再從 `develop` 建立 `feature/foundation`。
- 全站不得使用「免費」形容品牌成長健檢。
- 品牌健檢統一名稱為「品牌成長健檢」，主要 CTA 為「申請品牌成長健檢」。
- 權限不能只靠 UI；必須同時由 server-side guard 與 Supabase RLS 保護。
- Proxy 只做 session refresh 與樂觀導向，不作為完整授權來源。
- Service role key 只能在 server-only module、CLI script 與 CI／local env 使用，不能進入 client bundle。
- Dashboard 未取得真實資料時只顯示系統狀態，不顯示虛構流量。
- 所有行為邏輯先寫失敗測試，再做最小實作。
- 每一個 task 完成後獨立 commit。

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
├── package.json
├── package-lock.json
├── playwright.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.mts
├── docs/development/local-setup.md
├── scripts/grant-role.ts
├── src
│   ├── app
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── (public)/page.tsx
│   │   ├── admin
│   │   │   ├── (protected)/layout.tsx
│   │   │   ├── (protected)/page.tsx
│   │   │   ├── forbidden/page.tsx
│   │   │   └── login/actions.ts
│   │   │   └── login/page.tsx
│   │   └── auth/callback/route.ts
│   ├── components
│   │   ├── admin/admin-shell.tsx
│   │   ├── brand/brand-mark.tsx
│   │   └── ui/button.tsx
│   ├── lib
│   │   ├── auth/access.ts
│   │   ├── auth/roles.ts
│   │   ├── env/schema.ts
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

## Fixed Interfaces

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

### Task 1: Bootstrap repository and Next.js application

**Files:**
- Create: `.nvmrc`, `.gitignore`, `package.json`, `package-lock.json`
- Create: `next-env.d.ts`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/(public)/page.tsx`

**Produces:** working `/` route and npm scripts used by all later tasks.

- [ ] **Step 1: Create branches**

```bash
git checkout main
git pull --ff-only
git checkout -b develop
git push -u origin develop
git checkout -b feature/foundation
```

Expected: current branch is `feature/foundation`.

- [ ] **Step 2: Pin Node and dependencies**

`.nvmrc`:

```text
24
```

`package.json`:

```json
{
  "name": "g9g-official-website",
  "version": "2.0.0-alpha.1",
  "private": true,
  "engines": { "node": ">=24 <25" },
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
    "next": "16.2.12",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "server-only": "0.0.1",
    "zod": "4.4.3"
  },
  "devDependencies": {
    "@playwright/test": "1.62.0",
    "@tailwindcss/postcss": "4.3.3",
    "@testing-library/react": "16.3.2",
    "tailwindcss": "4.3.3",
    "typescript": "7.0.2",
    "vitest": "4.1.10"
  }
}
```

Install runtime and secondary tooling, then commit the generated lockfile:

```bash
npm install
npm install clsx tailwind-merge
npm install -D @testing-library/dom @testing-library/jest-dom @types/node @types/react @types/react-dom @vitejs/plugin-react eslint eslint-config-next@16.2.12 jsdom supabase tsx vite-tsconfig-paths
```

Expected: `npm ls --depth=0` exits 0 and `package-lock.json` exists.

- [ ] **Step 3: Add framework configuration**

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
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx", "**/*.mts"],
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
export default { plugins: { '@tailwindcss/postcss': {} } }
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

- [ ] **Step 4: Create the required root layout and home page**

`src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'G9G｜LINE 禮物品牌成長平台',
  description: '讓品牌成長，不只是把商品上架。',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  )
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
}

* { box-sizing: border-box; }
html { background: var(--g9g-surface); }
body {
  margin: 0;
  color: var(--g9g-ink);
  background: var(--g9g-paper);
  font-family: Arial, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
}
```

- [ ] **Step 5: Add `.gitignore`**

```text
node_modules
.next
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

- [ ] **Step 6: Verify and commit**

```bash
npm run lint
npm run typecheck
npm run build
git add .
git commit -m "chore: bootstrap G9G Next.js foundation"
```

Expected: all commands exit 0 and build includes `/`.

---

### Task 2: Add unit, component, and browser test harnesses

**Files:**
- Create: `vitest.config.mts`, `src/test/setup.ts`, `playwright.config.ts`
- Create: `tests/unit/home.test.tsx`, `tests/e2e/foundation.spec.ts`

- [ ] **Step 1: Write the failing home test**

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

Run:

```bash
npm run test:run -- tests/unit/home.test.tsx
```

Expected: FAIL because Vitest alias and DOM matchers are not configured.

- [ ] **Step 2: Configure Vitest**

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
  },
})
```

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Run the test again; expected PASS.

- [ ] **Step 3: Configure Playwright and write the smoke test**

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

`tests/e2e/foundation.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('public home identifies G9G', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'G9G' })).toBeVisible()
  await expect(page.getByText('LINE 禮物品牌成長平台')).toBeVisible()
})
```

Run:

```bash
npx playwright install chromium
npm run test:e2e -- tests/e2e/foundation.spec.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.mts playwright.config.ts src/test tests
git commit -m "test: establish unit and browser smoke tests"
```

---

### Task 3: Validate environment variables without exposing server secrets

**Files:**
- Create: `.env.example`
- Create: `src/lib/env/schema.ts`, `src/lib/env/public.ts`, `src/lib/env/server.ts`
- Create: `tests/unit/env.test.ts`

- [ ] **Step 1: Write failing env tests**

```ts
import { describe, expect, it } from 'vitest'
import { parsePublicEnv, parseServerEnv } from '@/lib/env/schema'

const valid = {
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
}

describe('environment parsing', () => {
  it('accepts valid public values', () => {
    expect(parsePublicEnv(valid)).toEqual(valid)
  })

  it('rejects invalid URLs', () => {
    expect(() => parsePublicEnv({ ...valid, NEXT_PUBLIC_SITE_URL: 'g9g' })).toThrow()
  })

  it('requires the service role key for server access', () => {
    expect(() => parseServerEnv(valid)).toThrow('SUPABASE_SERVICE_ROLE_KEY')
  })
})
```

Run; expected FAIL because modules do not exist.

- [ ] **Step 2: Implement shared schemas and separate accessors**

`src/lib/env/schema.ts`:

```ts
import { z } from 'zod'

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})

const serverSchema = publicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})

export type PublicEnv = z.infer<typeof publicSchema>
export type ServerEnv = z.infer<typeof serverSchema>

export const parsePublicEnv = (input: Record<string, string | undefined>) => publicSchema.parse(input)
export const parseServerEnv = (input: Record<string, string | undefined>) => serverSchema.parse(input)
```

`src/lib/env/public.ts`:

```ts
import { parsePublicEnv, type PublicEnv } from './schema'

let cached: PublicEnv | undefined
export function publicEnv(): PublicEnv {
  cached ??= parsePublicEnv(process.env)
  return cached
}
```

`src/lib/env/server.ts`:

```ts
import 'server-only'
import { parseServerEnv, type ServerEnv } from './schema'

let cached: ServerEnv | undefined
export function serverEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env)
  return cached
}
```

`.env.example`:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=replace-with-local-publishable-key
SUPABASE_SERVICE_ROLE_KEY=replace-with-local-service-role-key
```

Run:

```bash
npm run test:run -- tests/unit/env.test.ts
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add .env.example src/lib/env tests/unit/env.test.ts
git commit -m "feat: validate public and server environment"
```

---

### Task 4: Add G9G design tokens and reusable primitives

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/utils/cn.ts`, `src/components/ui/button.tsx`, `src/components/brand/brand-mark.tsx`
- Create: `tests/unit/button.test.tsx`

- [ ] **Step 1: Write failing component tests**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'

describe('foundation UI', () => {
  it('renders the approved CTA', () => {
    render(<Button>申請品牌成長健檢</Button>)
    expect(screen.getByRole('button', { name: '申請品牌成長健檢' })).toHaveAttribute('data-variant', 'primary')
  })

  it('renders the official positioning', () => {
    render(<BrandMark />)
    expect(screen.getByText('LINE 禮物品牌成長平台')).toBeInTheDocument()
  })
})
```

Run; expected FAIL because components do not exist.

- [ ] **Step 2: Implement `cn`, Button, and BrandMark**

`src/lib/utils/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
```

`src/components/ui/button.tsx`:

```tsx
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variants = {
  primary: 'border-ink bg-brand text-ink',
  secondary: 'border-ink bg-paper text-ink',
  ghost: 'border-transparent bg-transparent text-ink',
} as const

export function Button({ className, variant = 'primary', type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      data-variant={variant}
      className={cn('inline-flex min-h-11 items-center justify-center border px-4 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50', variants[variant], className)}
      {...props}
    />
  )
}
```

`src/components/brand/brand-mark.tsx`:

```tsx
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div aria-label="G9G LINE 禮物品牌成長平台" className="inline-flex items-center gap-3">
      <span aria-hidden="true" className="grid size-11 place-items-center bg-ink font-black text-paper shadow-[5px_5px_0_var(--g9g-green)]">G9G</span>
      {!compact && <span className="grid"><strong>G9G</strong><small className="text-muted">LINE 禮物品牌成長平台</small></span>}
    </div>
  )
}
```

- [ ] **Step 3: Map CSS variables into Tailwind**

Replace `src/app/globals.css` with tokens for ink, paper, surface, muted, line, brand, brand-dark, warning, danger, radius and shadow. Map the color variables using `@theme inline` so classes such as `bg-brand`, `text-muted`, and `border-line` compile. Keep LINE green as an accent rather than a full-page background.

Run:

```bash
npm run test:run -- tests/unit/button.test.tsx
npm run lint
npm run typecheck
npm run build
```

Expected: PASS and no contrast-breaking default text styles.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components src/lib/utils tests/unit/button.test.tsx
git commit -m "feat: add G9G design tokens and UI primitives"
```

---

### Task 5: Create Supabase Auth profile, RBAC schema, and RLS tests

**Files:**
- Create: `supabase/config.toml`
- Create: `supabase/migrations/202607300001_foundation_auth_rbac.sql`
- Create: `supabase/tests/0001_foundation_auth_rbac.test.sql`

**Produces:** `profiles`, `roles`, `profile_roles`, `audit_events`, `public.has_role(text)`, four fixed roles.

- [ ] **Step 1: Initialize Supabase**

```bash
npx supabase init
```

Expected: `supabase/config.toml` exists.

- [ ] **Step 2: Write failing pgTAP tests**

```sql
begin;
select plan(11);

select ok(to_regclass('public.profiles') is not null, 'profiles exists');
select ok(to_regclass('public.roles') is not null, 'roles exists');
select ok(to_regclass('public.profile_roles') is not null, 'profile_roles exists');
select ok(to_regclass('public.audit_events') is not null, 'audit_events exists');
select is((select count(*)::integer from public.roles), 4, 'four roles are seeded');
select results_eq(
  $$select key from public.roles order by key$$,
  $$values ('editor'), ('marketing'), ('service'), ('super_admin')$$,
  'role keys match contract'
);
select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.profile_roles'::regclass), 'profile_roles RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.audit_events'::regclass), 'audit_events RLS enabled');
select ok(to_regprocedure('public.has_role(text)') is not null, 'has_role exists');

set local role authenticated;
select throws_ok(
  $$insert into public.profile_roles (profile_id, role_id)
    select gen_random_uuid(), id from public.roles where key = 'super_admin'$$,
  '42501',
  'authenticated user cannot grant roles'
);
reset role;

select * from finish();
rollback;
```

Run:

```bash
npm run db:start
npm run db:test
```

Expected: FAIL because schema does not exist.

- [ ] **Step 3: Implement migration**

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

insert into public.roles (key, label) values
  ('super_admin', '超級管理員'),
  ('editor', '編輯'),
  ('marketing', '行銷'),
  ('service', '客服')
on conflict (key) do update set label = excluded.label;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, coalesce(new.email, ''), nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.has_role(role_key text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.profile_roles pr
    join public.roles r on r.id = pr.role_id
    where pr.profile_id = auth.uid() and r.key = role_key
  );
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.profile_roles enable row level security;
alter table public.audit_events enable row level security;

revoke all on public.profiles, public.roles, public.profile_roles, public.audit_events from anon;
grant select on public.profiles, public.roles, public.profile_roles, public.audit_events to authenticated;

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

- [ ] **Step 4: Reset, test, lint, and commit**

```bash
npm run db:reset
npm run db:test
npx supabase db lint
git add supabase
git commit -m "feat: add Supabase auth profile and RBAC schema"
```

Expected: 11 pgTAP assertions pass; authenticated role cannot insert `profile_roles`.

---

### Task 6: Add Supabase SSR clients and session proxy

**Files:**
- Create: `src/lib/supabase/client.ts`, `server.ts`, `admin.ts`, `proxy.ts`
- Create: `src/lib/routes/admin.ts`, `src/proxy.ts`
- Create: `tests/unit/admin-routes.test.ts`

- [ ] **Step 1: Write failing route tests**

```ts
import { describe, expect, it } from 'vitest'
import { isPublicAdminPath } from '@/lib/routes/admin'

describe('admin routes', () => {
  it.each(['/admin/login', '/auth/callback'])('allows %s without an admin role', (path) => {
    expect(isPublicAdminPath(path)).toBe(true)
  })

  it.each(['/admin', '/admin/content', '/admin/settings'])('protects %s', (path) => {
    expect(isPublicAdminPath(path)).toBe(false)
  })
})
```

Run; expected FAIL.

- [ ] **Step 2: Implement route classifier and clients**

`src/lib/routes/admin.ts`:

```ts
const publicPaths = new Set(['/admin/login', '/auth/callback'])
export const isPublicAdminPath = (pathname: string) => publicPaths.has(pathname)
```

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
  const store = await cookies()
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          // Session refresh is performed by proxy.ts when Server Components cannot set cookies.
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
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
```

- [ ] **Step 3: Implement `updateSession` and Next.js 16 `proxy.ts`**

`src/lib/supabase/proxy.ts` must create a Supabase SSR client from request cookies, call `auth.getUser()`, copy refreshed cookies to the response, redirect anonymous `/admin/*` requests to `/admin/login?next=<path>`, and redirect an already authenticated `/admin/login` request to `/admin`.

`src/proxy.ts`:

```ts
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = { matcher: ['/admin/:path*', '/auth/callback'] }
```

Run:

```bash
npm run test:run -- tests/unit/admin-routes.test.ts
npm run typecheck
npm run build
```

Expected: PASS with valid `.env.local` values from `npx supabase status -o env`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/routes src/lib/supabase src/proxy.ts tests/unit/admin-routes.test.ts
git commit -m "feat: add Supabase SSR clients and session proxy"
```

---

### Task 7: Add authentication, RBAC guards, admin shell, and initial role grant

**Files:**
- Create: `src/lib/auth/roles.ts`, `src/lib/auth/access.ts`
- Create: `src/app/admin/login/actions.ts`, `page.tsx`
- Create: `src/app/auth/callback/route.ts`
- Create: `src/app/admin/forbidden/page.tsx`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/app/admin/(protected)/layout.tsx`, `page.tsx`
- Create: `scripts/grant-role.ts`
- Create: `tests/unit/access.test.ts`
- Modify: `tests/e2e/foundation.spec.ts`

- [ ] **Step 1: Write failing role tests**

```ts
import { describe, expect, it } from 'vitest'
import { hasAnyRole } from '@/lib/auth/roles'

describe('hasAnyRole', () => {
  it('allows matching roles', () => expect(hasAnyRole(['editor'], ['super_admin', 'editor'])).toBe(true))
  it('denies non-matching roles', () => expect(hasAnyRole(['service'], ['marketing'])).toBe(false))
  it('denies users without roles', () => expect(hasAnyRole([], ['super_admin'])).toBe(false))
})
```

Run; expected FAIL.

- [ ] **Step 2: Implement role types and server guards**

`src/lib/auth/roles.ts`:

```ts
export type AppRole = 'super_admin' | 'editor' | 'marketing' | 'service'
export type CurrentAccess = { userId: string; email: string; roles: AppRole[] }
export const hasAnyRole = (roles: readonly AppRole[], allowed: readonly AppRole[]) => roles.some((role) => allowed.includes(role))
```

`src/lib/auth/access.ts` must:

1. call `createServerSupabaseClient().auth.getUser()`;
2. return `null` when there is no authenticated email;
3. query `profile_roles` joined with `roles(key)` for the current user;
4. return `CurrentAccess`;
5. make `requireRole()` redirect unauthenticated users to `/admin/login` and unauthorized users to `/admin/forbidden`.

Run `tests/unit/access.test.ts`; expected PASS.

- [ ] **Step 3: Implement admin login and OAuth callback**

- Email/password action uses `supabase.auth.signInWithPassword`.
- Google action uses `supabase.auth.signInWithOAuth` and redirects to `${NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin`.
- Callback exchanges `code` with `exchangeCodeForSession` and redirects to the validated internal `next` path.
- Login page shows `G9G Admin`, Email, password, `登入`, and `使用 Google 登入`.
- Error messages are displayed with `role="alert"` and never reveal whether a specific account exists.

- [ ] **Step 4: Implement protected shell**

`src/app/admin/(protected)/layout.tsx` calls:

```ts
await requireRole(['super_admin', 'editor', 'marketing', 'service'])
```

`AdminShell` shows only a Dashboard link in Foundation. Dashboard copy states that content,健檢, SEO and analytics modules will be activated later and that no fictitious data is displayed.

- [ ] **Step 5: Implement `scripts/grant-role.ts`**

The script imports `parseServerEnv` from `src/lib/env/schema.ts`, not from the server-only accessor. It accepts exactly `--email` and `--role`, rejects roles outside the four fixed values, finds the Auth user through `supabase.auth.admin.listUsers`, upserts `profile_roles`, inserts an `audit_events` record, and prints:

```text
Granted super_admin to g9growth@gmail.com
```

Run after the user has signed in once:

```bash
npm run admin:grant -- --email g9growth@gmail.com --role super_admin
```

- [ ] **Step 6: Add browser tests**

Append:

```ts
test('admin login is visible', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(page.getByRole('heading', { name: 'G9G Admin' })).toBeVisible()
  await expect(page.getByRole('button', { name: '登入' })).toBeVisible()
})

test('anonymous admin request redirects to login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin$/)
})
```

Run:

```bash
npm run test:run
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin src/app/auth src/components/admin src/lib/auth scripts tests
git commit -m "feat: add admin authentication and role guards"
```

---

### Task 8: Add CI quality gates and local development documentation

**Files:**
- Create: `.github/workflows/quality.yml`
- Create: `README.md`, `docs/development/local-setup.md`

- [ ] **Step 1: Add GitHub Actions workflow**

The `application` job must:

1. use Node from `.nvmrc`;
2. run `npm ci`;
3. start local Supabase;
4. export `API_URL`, `ANON_KEY`, and `SERVICE_ROLE_KEY` into the four app env variables;
5. run lint, typecheck, unit tests, build, Chromium E2E;
6. stop Supabase in an `always()` step.

The `database` job must run `npm ci`, `supabase start`, `db:reset`, `db:test`, `supabase db lint`, and stop Supabase in `always()`.

Trigger on pull requests and pushes to `develop` and `main`.

- [ ] **Step 2: Document exact local setup**

`docs/development/local-setup.md` must include:

```bash
nvm use
npm install
npm run db:start
npx supabase status -o env
cp .env.example .env.local
npm run db:reset
npm run dev
```

It must explain mapping `API_URL`, `ANON_KEY`, and `SERVICE_ROLE_KEY` to app env names, creating or inviting `g9growth@gmail.com`, signing in once, granting `super_admin`, and running the full verification commands.

`README.md` links the design spec, roadmap, Foundation plan, and local setup guide.

- [ ] **Step 3: Run the full quality gate**

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

- [ ] **Step 4: Commit, push, and open PR**

```bash
git add .github README.md docs/development
git commit -m "ci: enforce Foundation quality gates"
git push -u origin feature/foundation
```

Open PR from `feature/foundation` to `develop` with title:

```text
feat: establish G9G V2 foundation
```

The PR cannot merge until `application` and `database` jobs pass.

---

## Foundation Acceptance Checklist

- [ ] Node 24、Next 16.2.12、React 19.2.8、TypeScript 7.0.2、Tailwind 4.3.3 已鎖定。
- [ ] `/` 顯示 `G9G` 與 `LINE 禮物品牌成長平台`。
- [ ] Unit、component、database、E2E harness 可執行。
- [ ] 公開與 server-only 環境變數分離；service role 不進 client bundle。
- [ ] Design tokens、Button、BrandMark 有測試。
- [ ] Supabase migration 可重建四個基礎資料表與四個固定角色。
- [ ] RLS 已啟用；一般 authenticated user 不能寫入 `profile_roles`。
- [ ] Proxy 只做 session refresh／登入導向；server layout 執行角色授權。
- [ ] `/admin/login` 支援 Email／Password 與 Google 登入。
- [ ] 匿名使用者進入 `/admin` 會導向登入頁；無角色使用者會導向 forbidden。
- [ ] `g9growth@gmail.com` 可透過 CLI 被授予 `super_admin`，且動作寫入 audit event。
- [ ] Dashboard shell 不顯示虛構營運數據。
- [ ] GitHub Actions application／database jobs 全部通過。
- [ ] Foundation PR 合併至 `develop`，不直接合併 `main`。

## Self-Review

- Scope只包含 framework、Design System、Auth、RBAC、RLS、admin shell、tests、CI。
- 內容 CMS、品牌成長健檢業務流程、SEO schema、版本發布與正式部署均留在各自子計畫。
- Root layout、server-only env、CLI env parsing、Next.js 16 proxy 命名與 RLS privilege escalation test 均已明確處理。
- 文件沒有未定義的介面、未決欄位或會被當成程式碼執行的示意標記。
