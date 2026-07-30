# G9G V2 本機開發與管理員啟用

## 1. 前置需求

- Git
- Node.js 24
- Docker Desktop 或可執行 Docker containers 的環境
- Supabase CLI（已列在專案 devDependencies，可透過 `npx supabase` 使用）

## 2. 安裝與啟動

```bash
nvm use
npm install
npm run db:start
npx supabase status -o env
cp .env.example .env.local
npm run db:reset
npm run dev
```

網站預設位址：`http://localhost:3000`。  
Supabase Studio 預設位址：`http://127.0.0.1:54323`。

## 3. 環境變數對應

執行：

```bash
npx supabase status -o env
```

將輸出值填入 `.env.local`：

| Supabase CLI 輸出 | G9G 應用程式變數 |
| --- | --- |
| `API_URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| `ANON_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `SERVICE_ROLE_KEY` | `SUPABASE_SERVICE_ROLE_KEY` |

並設定：

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` 只能存在本機環境、CI Secret 或伺服器環境，不得寫入公開程式碼或 `NEXT_PUBLIC_*` 變數。

## 4. 建立第一位管理員

### 4.1 建立或邀請帳號

1. 開啟 Supabase Studio。
2. 進入 **Authentication → Users**。
3. 建立或邀請 `g9growth@gmail.com`。
4. 使用該帳號登入 `/admin/login` 一次，讓 Auth user 與 profile 完成建立。

Email／Password 可直接用於本機測試。Google OAuth 需先在 Supabase Auth Providers 與 Google Cloud 設定 Client ID、Client Secret 與 callback URL，再啟用 Google provider。

### 4.2 授予 super admin

確認 `.env.local` 已設定後執行：

```bash
npm run admin:grant -- --email g9growth@gmail.com --role super_admin
```

成功輸出：

```text
Granted super_admin to g9growth@gmail.com
```

授權會寫入 `profile_roles`，同時在 `audit_events` 留下 `role.granted` 紀錄。

## 5. 權限模型

- `super_admin`：完整系統權限
- `editor`：內容新增、編輯與提交發布
- `marketing`：行銷內容、首頁、CTA、媒體與 SEO
- `service`：品牌成長健檢申請與內部備註

畫面上的選單隱藏不是權限依據。所有後台權限必須同時通過 Server-side guard 與 Supabase RLS。

## 6. 完整驗證

先啟動 Supabase，並確認 `.env.local` 正確：

```bash
npm run db:start
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run db:reset
npm run db:test
npx supabase db lint
npm run test:e2e
npm run db:stop
```

預期：所有命令 exit code 為 `0`。

## 7. 常見問題

### `/admin` 一直回到登入頁

確認 Supabase 正在執行、`.env.local` 的 URL／key 正確，並重新登入。

### 登入後看到「沒有操作權限」

代表 Auth 已成功，但帳號尚未被授予 G9G 角色。執行 `admin:grant` 後重新整理。

### Google 登入失敗

確認 Google provider 已啟用，callback URL 與 `NEXT_PUBLIC_SITE_URL` 一致。正式環境不可沿用 localhost callback。

### `supabase start` 失敗

確認 Docker 已啟動，並檢查本機 ports `54321`–`54324` 是否被其他服務占用。
