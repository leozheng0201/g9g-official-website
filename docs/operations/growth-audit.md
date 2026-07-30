# 品牌成長健檢正式營運手冊

## 功能範圍

品牌成長健檢第一階段會：

- 接收聯絡人、品牌、手機、Email、品牌連結與隱私權同意。
- 以 server-side Zod 驗證、honeypot、Email／裝置指紋／重複內容頻率限制阻擋濫用。
- 將申請保存至 Supabase，再寄送申請人收件信與內部通知信。
- 保存首次來源、最後來源與不可逆請求指紋。
- 讓 `super_admin` 與 `service` 在 `/admin/growth-audits` 管理狀態、備註與操作紀錄。

## 必要環境變數

Preview 與 Production 必須分別設定，不共用測試金鑰。

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
GROWTH_AUDIT_FROM_EMAIL=
GROWTH_AUDIT_ADMIN_EMAIL=
RATE_LIMIT_FINGERPRINT_SECRET=
```

要求：

- `SUPABASE_SERVICE_ROLE_KEY`、`RESEND_API_KEY`、`RATE_LIMIT_FINGERPRINT_SECRET` 只能存在 Vercel server environment，不得使用 `NEXT_PUBLIC_` 前綴。
- `RATE_LIMIT_FINGERPRINT_SECRET` 使用至少 32 bytes 的隨機值；Preview 與 Production 使用不同值。
- `GROWTH_AUDIT_FROM_EMAIL` 必須使用已在 Resend 驗證的寄件網域，例如 `G9G <audit@your-domain.tw>`。
- `GROWTH_AUDIT_ADMIN_EMAIL` 是內部收件信箱，不會顯示在公開頁面。

## Resend 啟用

1. 在 Resend 新增正式寄件網域。
2. 依 Resend 提供的 DNS 記錄設定 SPF、DKIM 與必要驗證記錄。
3. 等待網域狀態顯示已驗證。
4. 建立 Preview API Key 與 Production API Key。
5. 在 Vercel 對應環境設定 `RESEND_API_KEY` 與 `GROWTH_AUDIT_FROM_EMAIL`。
6. 使用內部測試品牌送出一筆 Preview 申請，確認申請人信與管理員信皆收到。

## Supabase 遷移

執行順序：

```bash
npm run db:start
npm run db:reset
npm run db:test
npx supabase db lint
```

正式環境套用 migration 前，先確認 Preview 專案已通過：

- `growth_audit_applications` 與 `growth_audit_events` 已建立。
- RLS 已啟用。
- `anon` 與一般 `authenticated` 使用者不能直接新增或讀取申請。
- `super_admin` 與 `service` 可透過後台讀取。

## 上線前測試

1. 正常資料送出後導向 `/growth-audit/success`。
2. URL、瀏覽器 log 與錯誤頁不得包含姓名、Email、手機或品牌資料。
3. Supabase 出現一筆 application 與 `submitted` event。
4. 申請人收件信只確認收到，不承諾一定通過、一定提供報告或一定合作。
5. 管理員通知信可正確回覆申請人 Email。
6. 重複快速送出會被阻擋。
7. honeypot 填值不會建立資料。
8. `editor` 與 `marketing` 無法進入申請管理頁。
9. 狀態變更與內部備註都會新增 immutable event。

## Email 失敗與重送

申請資料會先保存再寄信，因此寄信失敗不得刪除申請。

- `applicant_receipt_failed`：申請人收件信失敗。
- `admin_notification_failed`：內部通知信失敗。
- Resend 使用固定 `Idempotency-Key`，相同申請與相同信件版本重送不應重複寄出。
- 人工重送前先確認 Resend Dashboard 是否已有成功紀錄，再使用同一 idempotency key。

## 個資與權限

- 列表頁只顯示遮罩 Email 與手機。
- 完整個資、來源資料與內部備註只允許 `super_admin`、`service`。
- 不將個資寫入 GitHub、測試 fixture、截圖、Analytics、URL query、console log 或錯誤追蹤 metadata。
- 匯出或人工轉交資料時，使用受控公司帳號與最小必要範圍。

## 保存與刪除

正式上線前需由公司確認法務保存期限。未定案前：

- 不建立自動永久保存承諾。
- 不將申請資料同步到未核准的第三方工具。
- 接到刪除請求時，由 Super Admin 核對身分與案件範圍後執行，並保留不含申請內容的處理紀錄。

## 事件應變

發現疑似個資外洩、金鑰暴露或異常大量送出時：

1. 暫停表單或撤下 Production deployment。
2. 立即輪替 Supabase service role、Resend API Key 與 fingerprint secret。
3. 檢查 Vercel logs、Supabase audit logs、Resend logs 與 GitHub commit history。
4. 確認受影響資料範圍與時間。
5. 由負責人決定通知、刪除、復原與法務處理。
6. 完成原因分析與防止再發修正後，再恢復表單。
