# G9G 內容 CMS 營運手冊

## 範圍

本手冊適用於品牌觀點、LINE 禮物研究院、品牌案例、FAQ、品牌資源及媒體庫。CMS 是這些內容的唯一維護來源。

## 環境變數

Preview 與 Production 必須分開設定：

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CMS_PREVIEW_SECRET=
CMS_SCHEDULER_SECRET=
```

`SUPABASE_SERVICE_ROLE_KEY`、`CMS_PREVIEW_SECRET`、`CMS_SCHEDULER_SECRET` 僅能存在 server environment，不得使用 `NEXT_PUBLIC_` 前綴。

## Supabase Storage

建立 `content-media` bucket。上傳必須由 Server Action 驗證 MIME、大小、圖片 alt 與角色權限。使用中的素材不可刪除；刪除前先查詢 `media_usages`。

## 內容流程

1. marketing 建立或編輯草稿。
2. marketing 送審後內容鎖定。
3. editor 或 super_admin 可退回並填原因，或核准。
4. 核准後可立即發布或排程。
5. 已發布內容修改不直接覆蓋正式快照；重新發布會建立新 revision/publication。
6. 下架保留版本與操作紀錄。

## 私人預覽

預覽 Token 預設 60 分鐘到期，可撤銷。預覽頁必須輸出 `noindex, nofollow`，不得加入 sitemap，網址不得包含姓名、Email 或內容標題。

## 排程

內部排程端點只接受 `CMS_SCHEDULER_SECRET`。工作必須可重複執行；已發布或狀態已變更項目應跳過，不可重複建立發布事件。

## 垃圾桶

刪除先進垃圾桶。30 天內可由 editor 或 super_admin 還原；只有 super_admin 可在滿 30 天後永久刪除。

## Slug 與 301

已發布內容修改 slug 時建立永久轉址。歷史 slug 不可重複使用。發現迴圈或衝突時阻擋發布，先修正 `content_redirects` 再重新發布。

## 搬移與回復

正式搬移前先在 Preview 執行 migration dry-run，核對網址、標題、排序、案例歸屬與 SEO。若 parity 不符，不移除舊靜態來源。回復時保留資料庫內容，將公開讀取切回上一個通過驗證的 deployment。

## 權限事件

發現 service 或未授權帳號可讀寫 CMS 時：立即停用帳號、撤銷 session、檢查 profile_roles 與 RLS、輪替 service role key，並檢查 audit/workflow events。

## 完整驗證

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

全部通過前不得合併至 `develop`，更不得部署 Production。
