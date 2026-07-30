# G9G 官方網站 V2.0

G9G 官方網站與專屬內容管理後台。

> **G9G｜LINE 禮物品牌成長平台**  
> 讓品牌成長，不只是把商品上架。

## 分支策略

- `main`：正式環境
- `develop`：整合與 Preview 驗收環境
- `feature/*`：獨立功能開發分支

所有功能必須先經 Pull Request 與 quality gates，不能直接在 `main` 開發。

## Foundation 範圍

目前 Foundation 建立：

- Next.js App Router 公開網站與 `/admin` 後台基礎
- TypeScript、Tailwind CSS 與 G9G Design Tokens
- Supabase PostgreSQL、Auth、Storage 開發環境
- `super_admin`、`editor`、`marketing`、`service` 四種角色
- Supabase RLS 與 Server-side 權限檢查
- Email／Password 與 Google OAuth 登入入口
- Unit、E2E、pgTAP 與 Database lint
- GitHub Actions application／database quality gates

內容 CMS、品牌成長健檢業務流程、SEO 與正式部署將依後續計畫逐階段完成。

## 文件

- [V2.0 設計規格](docs/superpowers/specs/2026-07-30-g9g-official-website-v2-design.md)
- [V2.0 實作總藍圖](docs/superpowers/plans/2026-07-30-g9g-v2-roadmap.md)
- [Foundation 實作計畫](docs/superpowers/plans/2026-07-30-g9g-v2-foundation.md)
- [本機開發與管理員啟用](docs/development/local-setup.md)
- [TypeScript／ESLint 相容性決策](docs/decisions/2026-07-30-typescript-eslint-compatibility.md)

## 快速開始

```bash
nvm use
npm install
npm run db:start
npx supabase status -o env
cp .env.example .env.local
npm run db:reset
npm run dev
```

完整環境變數與管理員啟用方式請閱讀本機開發文件。

## 完整驗證

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run db:reset
npm run db:test
npx supabase db lint
npm run test:e2e
```

以上命令與 GitHub Actions 全部通過前，不得宣告 Foundation 可合併。
