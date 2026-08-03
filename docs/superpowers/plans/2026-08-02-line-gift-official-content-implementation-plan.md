# LINE 禮物官方資料整合與私人預覽 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 `/about-line-gift` 獨立頁、首頁官方數據信任區與研究院入口，所有公開內容由 CMS publication snapshot 單一維護，並提供禁止索引的私人預覽。

**Architecture:** 使用既有 Content CMS 與 `line_gift_academy` article subtype，新增一筆 slug 為 `about-line-gift` 的正式內容與 `type_fields` 首頁精選資料。公開固定頁透過既有 `public-reader` 讀取 publication snapshot；首頁與研究院共用同一份官方資料模型，避免雙重維護。

**Tech Stack:** Next.js 16 App Router、TypeScript 6、React、Tailwind CSS 4、Supabase/PostgreSQL、Zod、Vitest、Testing Library、Playwright。

## Global Constraints

- 主要依據為使用者上傳的《2026 LINE 禮物資訊分享》，不得補寫來源未支持的官方結論。
- 官方資料、老莊營運解讀、G9G 可以協助必須分層呈現。
- 必須明示「G9G／盛澄策略顧問非 LINE 官方或官方代理商」。
- 不得出現「免費品牌健檢」、`scrutator` 或 QR Code。
- `/about-line-gift` 只讀已發布 publication snapshot；草稿不得公開或進 sitemap。
- 私人 Preview 必須 `noindex, nofollow`，並顯示「未公開預覽」。
- 只合併至 `develop`；不得修改 `main` 或發布 Production。

---

### Task 1: 定義官方資料內容契約

**Files:**
- Create: `src/content/line-gift-official.ts`
- Create: `tests/unit/line-gift-official-content.test.ts`

**Interfaces:**
- Produces: `lineGiftOfficialContent`, `LineGiftOfficialContent`, `getFeaturedOfficialStats()`。
- Consumers: CMS seed、首頁信任區、獨立頁測試。

- [ ] **Step 1: Write the failing test**

測試固定資料契約：900 萬、8,000 萬、20–44 超過八成、34 歲以下超過 55%、60/40、四大場景順序、商品 × 流量 × 轉換、來源聲明與非官方聲明。

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- tests/unit/line-gift-official-content.test.ts`
Expected: FAIL because `@/content/line-gift-official` does not exist.

- [ ] **Step 3: Write minimal implementation**

建立 readonly typed object：

```ts
export const lineGiftOfficialContent = {
  sourceTitle: '2026 LINE 禮物資訊分享',
  stats: [
    { id: 'users', value: '900 萬以上', label: 'LINE 禮物用戶' },
    { id: 'gifts', value: '8,000 萬以上', label: '2021–2025 累積送禮份數' },
    { id: 'age-20-44', value: '超過八成', label: '20–44 歲用戶占比' },
    { id: 'under-34', value: '超過 55%', label: '34 歲以下族群' },
    { id: 'gender', value: '女性約 60%／男性約 40%', label: '用戶性別比例' },
  ],
  scenes: ['儀式禮物', '商務禮物', '吉時禮物', '情緒禮物'],
  growthFormula: ['商品', '流量', '轉換'],
  platformDirections: ['更好逛', '更心動', '更好送'],
  disclaimer: '資料來源：《2026 LINE 禮物資訊分享》。G9G／盛澄策略顧問非 LINE 官方或官方代理商；本頁將官方資料、營運解讀與 G9G 服務分開呈現。',
} as const
```

`getFeaturedOfficialStats()` 只回傳 users、gifts、age-20-44、scenes 四項核准資料。

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- tests/unit/line-gift-official-content.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/line-gift-official.ts tests/unit/line-gift-official-content.test.ts
git commit -m "feat: define LINE Gift official content contract"
```

### Task 2: 建立 CMS seed 與 publication snapshot

**Files:**
- Create: `supabase/migrations/202608020001_seed_line_gift_official_content.sql`
- Modify: `supabase/tests/03_content_cms.sql`
- Modify: `src/content/migrations/content-cms-seed.ts`

**Interfaces:**
- Produces: 固定 UUID 的 `content_items`、`content_revisions`、`content_publications`，slug `about-line-gift`。
- Snapshot fields: `content_type='article'`, `article_subtype='line_gift_academy'`, `status='published'`, `type_fields.featured_stats`。

- [ ] **Step 1: Write failing pgTAP assertions**

新增 assertions 驗證：內容存在、正式 publication 存在、slug 唯一、`type_fields` 包含官方來源與首頁精選資料、snapshot 狀態為 published。

- [ ] **Step 2: Run database tests to verify RED**

Run: `npm run db:reset && npm run db:test`
Expected: FAIL because official content seed does not exist.

- [ ] **Step 3: Add deterministic SQL seed**

使用固定 UUID、`ON CONFLICT (id) DO NOTHING` 與 `NOT EXISTS` 建立 item、revision、publication。blocks 必須包含：Hero 說明、老莊解讀、官方數據、四大場景、成長公式、2026 方向、三層信任架構、來源聲明。

- [ ] **Step 4: Run database verification**

Run: `npm run db:reset && npm run db:test && npx supabase db lint`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/202608020001_seed_line_gift_official_content.sql supabase/tests/03_content_cms.sql src/content/migrations/content-cms-seed.ts
git commit -m "feat: seed official LINE Gift foundation content"
```

### Task 3: 建立 `/about-line-gift` 公開頁

**Files:**
- Create: `src/app/(public)/about-line-gift/page.tsx`
- Create: `src/components/public/line-gift/source-label.tsx`
- Create: `src/components/public/line-gift/official-stats.tsx`
- Create: `src/components/public/line-gift/scene-card.tsx`
- Modify: `src/lib/routes/public.ts`
- Modify: `tests/unit/public-pages.test.tsx`

**Interfaces:**
- Consumes: `getPublishedContentBySlug({ contentType: 'article', articleSubtype: 'line_gift_academy', slug: 'about-line-gift' })`。
- Produces: 固定公開路由 `/about-line-gift`，唯一 H1、官方／解讀／協助視覺標籤。

- [ ] **Step 1: Write failing public-page tests**

測試唯一 H1、官方數據、四大場景順序、三層標籤、來源與非官方聲明、CTA、不得出現「免費品牌健檢」與 `scrutator`。

- [ ] **Step 2: Run tests to verify RED**

Run: `npm run test:run -- tests/unit/public-pages.test.tsx`
Expected: FAIL because route/page does not exist.

- [ ] **Step 3: Implement components and page**

頁面由 publication snapshot 取得資料；無正式內容時使用 `notFound()`。使用現有 `PageHero`、`Container`、`Breadcrumbs`、`CtaBand` 與共用內容 renderer；官方資料區與 G9G 解讀區使用不同 label 元件。

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- tests/unit/public-pages.test.tsx tests/unit/line-gift-official-content.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/'(public)'/about-line-gift src/components/public/line-gift src/lib/routes/public.ts tests/unit/public-pages.test.tsx
git commit -m "feat: add about LINE Gift public page"
```

### Task 4: 首頁信任區與研究院入口

**Files:**
- Create: `src/components/public/line-gift/official-trust-section.tsx`
- Modify: `src/app/(public)/page.tsx`
- Modify: `src/app/(public)/line-gift-academy/page.tsx`
- Modify: `tests/unit/home.test.tsx`
- Modify: `tests/unit/public-pages.test.tsx`

**Interfaces:**
- Consumes: `getFeaturedOfficialStats()` and `publicRoutes.aboutLineGift`。
- Produces: 首頁最多四項官方資訊；研究院「先認識 LINE 禮物」入口卡。

- [ ] **Step 1: Write failing tests**

首頁測試只允許四項核准資料、顯示來源、正確連到 `/about-line-gift`；研究院測試驗證入口卡與文章列表共存。

- [ ] **Step 2: Run tests to verify RED**

Run: `npm run test:run -- tests/unit/home.test.tsx tests/unit/public-pages.test.tsx`
Expected: FAIL because trust section and academy entry do not exist.

- [ ] **Step 3: Implement minimal UI**

將 trust section 放在 G9G 方法論附近，不改原 Hero CTA。研究院入口置於文章列表之前；沒有文章時仍保留入口。

- [ ] **Step 4: Run tests**

Run: `npm run test:run -- tests/unit/home.test.tsx tests/unit/public-pages.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/public/line-gift/official-trust-section.tsx src/app/'(public)'/page.tsx src/app/'(public)'/line-gift-academy/page.tsx tests/unit/home.test.tsx tests/unit/public-pages.test.tsx
git commit -m "feat: surface official LINE Gift trust signals"
```

### Task 5: SEO、sitemap 與私人 Preview

**Files:**
- Modify: `src/app/(public)/about-line-gift/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/(preview)/preview/content/[token]/page.tsx`
- Modify: `tests/unit/seo.test.tsx`
- Modify: `tests/e2e/content-cms.spec.ts`

**Interfaces:**
- Produces: canonical `/about-line-gift`、BreadcrumbList、WebPage/Article JSON-LD、公開 sitemap 條目、Preview `noindex,nofollow` 與「未公開預覽」。

- [ ] **Step 1: Write failing SEO and E2E tests**

單元測試驗證 canonical 與 sitemap；Playwright 驗證桌機、390px 手機無橫向溢出、首頁與研究院內部連結、來源聲明、非官方聲明、Preview robots meta。

- [ ] **Step 2: Run tests to verify RED**

Run: `npm run test:run -- tests/unit/seo.test.tsx && npm run test:e2e -- tests/e2e/content-cms.spec.ts`
Expected: FAIL on missing metadata/link/preview assertions.

- [ ] **Step 3: Implement SEO and preview behavior**

使用 `createPageMetadata`、`JsonLd`、existing preview token flow；公開頁只有已發布 snapshot 才進 sitemap。Preview banner 文案固定為「未公開預覽」，metadata robots 設為 noindex/nofollow。

- [ ] **Step 4: Run targeted verification**

Run: `npm run test:run -- tests/unit/seo.test.tsx && npm run test:e2e -- tests/e2e/content-cms.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/'(public)'/about-line-gift/page.tsx src/app/sitemap.ts src/app/'(preview)'/preview/content/'[token]'/page.tsx tests/unit/seo.test.tsx tests/e2e/content-cms.spec.ts
git commit -m "feat: add LINE Gift content SEO and private preview gates"
```

### Task 6: 完整驗證、文件與私人預覽交付準備

**Files:**
- Create: `docs/runbooks/line-gift-official-content-preview.md`
- Modify: `.env.example` only if preview deployment variables are missing.

**Interfaces:**
- Produces: Preview 操作與驗收清單；不包含 Production 發布步驟。

- [ ] **Step 1: Write preview runbook**

記錄：建立／撤銷 preview token、桌機與 390px 驗收路徑、來源核對、noindex 核對、禁止 Production／main 的邊界。

- [ ] **Step 2: Run complete quality gate**

Run:

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run test:e2e
npm run db:reset
npm run db:test
npx supabase db lint
```

Expected: zero failures.

- [ ] **Step 3: Review forbidden copy**

Run:

```bash
grep -R "免費品牌健檢\|scrutator\|官方代理商" src/app/'(public)'/about-line-gift src/components/public/line-gift src/content/line-gift-official.ts
```

Expected: only the required negative disclaimer may contain「官方代理商」；no `免費品牌健檢` or `scrutator`.

- [ ] **Step 4: Commit**

```bash
git add docs/runbooks/line-gift-official-content-preview.md .env.example
git commit -m "docs: add LINE Gift private preview runbook"
```

- [ ] **Step 5: PR final review**

Confirm PR targets `develop`, remains Draft until all checks pass, and does not trigger Production deployment.
