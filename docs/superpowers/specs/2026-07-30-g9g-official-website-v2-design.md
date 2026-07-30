# G9G 官方網站 V2.0 設計規格

日期：2026-07-30  
專案：`leozheng0201/g9g-official-website`  
狀態：設計定案，待實作計畫

## 1. 專案目標

建立一套可正式營運、可長期擴充的 G9G 官方網站與專屬 CMS 後台。網站必須在第一時間讓品牌方理解：G9G 專注 LINE 禮物品牌成長，不是泛用型行銷公司，也不是單純代上架服務商。

核心主張：

> 讓品牌成長，不只是把商品上架。

品牌定位：

> G9G｜LINE 禮物品牌成長平台

成功標準：

1. 訪客在 3 秒內知道 G9G 專注 LINE 禮物。
2. 訪客在 3 分鐘內理解 G9G 能解決的問題、服務差異與下一步。
3. 有需求的品牌能順利提出「品牌成長健檢」申請。
4. 前台每一段文字、圖片、按鈕、SEO 欄位，都有清楚對應的後台維護位置。
5. 網站不是一頁式，而是正式、多層級、可持續新增內容的企業官網。
6. 研究院、品牌觀點、案例、FAQ 與資源形成完整內部連結，持續累積 SEO 資產。

## 2. 已確認的不可變更規則

1. 全站不得出現「免費健檢」、「免費品牌健檢」或任何用「免費」形容品牌健檢的文案。
2. 統一使用「品牌成長健檢」與 CTA「申請品牌成長健檢」。
3. 品牌成長健檢採申請制，第一階段只收集：聯絡人姓名、品牌名稱、手機、Email、品牌連結。
4. G9G 收到申請後，於 24 小時內聯繫；第二階段詳細問卷由 G9G 人工審核後提供。
5. 健檢服務內容可包含 30 分鐘線上解說與 PDF 健檢報告，但前台不使用「免費」作為吸引點。
6. 網站必須同時完成前台與後台，不接受只完成視覺頁面。
7. 前台採固定版型 CMS：可維護內容，但不可任意破壞版面結構。
8. 所有內容型資料支援草稿、預覽、發布、下架、封存與版本紀錄。
9. G9G IP 角色只做輔助裝飾，不搶走企業官網主體，也不在官網標示為「老莊」。
10. 目前 GitHub repository 為公開狀態；正式進入商業開發前建議改為 Private。

## 3. 產品範圍與分期

### 3.1 V2.0 正式上線範圍

前台：

- 首頁
- 關於 G9G
- 為什麼選擇 G9G
- 品牌成長健檢
- 品牌成長藍圖
- 品牌成長代營運
- LINE 禮物研究院
- 品牌成長案例
- 品牌觀點
- FAQ
- 品牌資源中心
- 聯絡我們
- 隱私權政策
- 網站使用條款
- 404 頁面

後台：

- Dashboard
- 頁面內容管理
- 導覽列與頁尾管理
- 品牌成長健檢申請管理
- 品牌成長案例管理
- LINE 禮物研究院管理
- 品牌觀點管理
- FAQ 管理
- 品牌資源管理
- 媒體中心
- SEO 管理
- 全站設定
- 使用者與角色權限
- 版本紀錄與封存

基礎技術：

- RWD
- SEO metadata
- sitemap.xml
- robots.txt
- canonical URL
- Open Graph
- Article、FAQ、Breadcrumb、Organization 結構化資料
- 表單防垃圾訊息
- Email 通知
- 基本網站事件追蹤

### 3.2 V2.5 後續擴充

- GA4 與 Search Console API 儀表板
- 文章排程發布
- 全站內容搜尋
- 進階內容推薦
- 資源下載與名單蒐集
- 自動化 Email 流程
- 會員中心與品牌資料庫

## 4. 技術方案

### 4.1 方案比較

#### 方案 A：Next.js + Supabase + 專屬 CMS（採用）

優點：

- 前台與後台可以在同一專案中維護。
- 適合內容型網站、SEO、權限、表單、媒體與未來擴充。
- Supabase 提供 PostgreSQL、Auth、Storage、RLS，降低後端維護成本。
- 能持續擴充成會員、工具與品牌資料平台。

缺點：

- 初期開發量高於套版 CMS。
- 必須建立明確資料模型與後台操作流程。

#### 方案 B：WordPress + 客製主題

優點：快速、外掛多。  
缺點：後台容易變複雜，權限與固定版型內容映射較難符合本案要求，長期維護風險較高。

#### 方案 C：純靜態網站 + 外部表單

優點：開發最快。  
缺點：無法符合完整 CMS、表單管理、版本、媒體、權限與未來擴充需求。

### 4.2 採用技術

- Framework：Next.js App Router
- Language：TypeScript
- Styling：Tailwind CSS + CSS variables
- Database：Supabase PostgreSQL
- Authentication：Supabase Auth，Google OAuth + Email 登入
- Storage：Supabase Storage
- Validation：Zod
- Forms：React Hook Form + Server Actions/API Route
- Testing：Vitest、Testing Library、Playwright
- Deployment：Vercel
- Monitoring：Vercel Analytics；GA4、Search Console、Clarity 以設定方式串接
- Email：Resend 或同級交易郵件服務

## 5. 資訊架構

### 5.1 主導覽

桌面版主導覽：

- 關於 G9G
- 品牌成長
  - 品牌成長健檢
  - 品牌成長藍圖
  - 品牌成長代營運
- LINE 禮物研究院
  - 平台與用戶
  - 送禮場景
  - 商品策略
  - 價格策略
  - 年度檔期
  - 營運實戰
  - LINE 禮物 FAQ
- 品牌成長案例
- 品牌觀點
- 品牌資源
- 聯絡我們

主要 CTA：

> 申請品牌成長健檢

手機版：抽屜式選單，保留固定底部 CTA，但文案仍為「申請品牌成長健檢」。

### 5.2 URL 結構

- `/`
- `/about`
- `/why-g9g`
- `/growth-audit`
- `/growth-blueprint`
- `/growth-operations`
- `/line-gift-academy`
- `/line-gift-academy/[slug]`
- `/cases`
- `/cases/[slug]`
- `/insights`
- `/insights/[slug]`
- `/faq`
- `/resources`
- `/resources/[slug]`
- `/contact`
- `/privacy`
- `/terms`
- `/admin`

## 6. 前台頁面設計

### 6.1 首頁

目的：在最短時間建立定位、信任、方法論與下一步。

區塊：

1. Hero：G9G 定位、核心主張、主要 CTA、研究院次要 CTA。
2. 訪客處境：品牌常見問題，例如上架沒單、商品沒有送禮理由、檔期只靠降價。
3. G9G 方法論：送禮業績＝商品 × 流量 × 轉換。
4. 四大送禮場景：情緒、儀式、商務、吉時。
5. 三個品牌成長產品：健檢、藍圖、代營運。
6. 精選案例：微笑甜果、法布甜，以及依保密需求呈現的匿名案例。
7. LINE 禮物研究院入口。
8. 創辦人與團隊背景。
9. 合作流程。
10. 品牌成長健檢 CTA。

首頁首屏避免堆疊過多平台數字；數據只使用已確認且可註明來源的資料。

### 6.2 關於 G9G

- 品牌故事
- 為什麼專注 LINE 禮物
- 品牌成長觀點
- 創辦人介紹
- 公司資訊
- 服務邊界

公司全名、統編、地址、電話在取得真實資料後由後台填入；資料未填時前台不顯示空欄位。

### 6.3 為什麼選擇 G9G

- 一般電商與送禮電商的差異
- G9G 的判斷方法
- 與一般代操的差異
- 適合合作的品牌
- 目前不適合合作的情況
- 合作投入與雙方責任

### 6.4 品牌成長健檢

核心文案：先判斷，再談合作。

流程：

1. 提交第一階段申請。
2. G9G 於 24 小時內聯繫。
3. 初步審核後提供第二階段問卷。
4. 安排 30 分鐘線上說明。
5. 提供品牌成長健檢報告。
6. 合適者再進入品牌成長藍圖或代營運合作。

第一階段表單欄位：

- 聯絡人姓名
- 品牌名稱
- 手機
- Email
- 品牌連結
- 隱私權同意
- 隱藏 honeypot 欄位

### 6.5 品牌成長藍圖

定位：健檢之後、正式長期合作之前的策略規劃產品。

內容：

- 品牌現況
- 通路角色
- LINE 禮物適配性
- 主打商品方向
- 送禮場景
- 價格帶
- 年度檔期
- 三階段成長路線
- KPI 與執行優先順序

### 6.6 品牌成長代營運

三種方案：

#### A｜商城啟動方案

一次性顧問與啟動服務，重點是進場判斷、商品策略與建置，不只代辦上架。

#### B｜成果分潤方案

- 以已完成 LINE 禮物訂單實際成交額計算 35%。
- 35% 已包含 LINE 禮物平台抽成與 G9G 營運服務費。
- 取消與退款訂單不計。
- LINE 禮物平台年費 NT$12,000，由 G9G 於簽約啟動時代收代繳。

#### C｜全年代營運方案（推薦）

- NT$30,000／月。
- 合約 12 個月。
- 月成交額超過 NT$300,000 的部分收取 3.5%。
- 以折扣後、已完成且扣除退款的訂單計算，次月結算。
- LINE 禮物平台年費 NT$12,000 由品牌直接支付平台。

三種方案共通：

- 廣告預算不包含在服務費內。
- LINE 禮物站內版位費由品牌直接支付 LINE 禮物。
- G9G 提供站內版位策略與行銷規劃。
- 基本版位素材設計與尺寸延伸包含在服務內。
- 品牌提供商品照與既有素材。
- 攝影、進階修圖、影片另行報價。
- 詳細修改次數、素材數量與法律條款放在提案與合約，不在官網展開。

### 6.7 LINE 禮物研究院

研究院不是 PDF 下載頁，而是可索引、可擴充、可交叉連結的知識中心。

初始分類：

- 平台與用戶
- 送禮文化
- 四大送禮場景
- 商品策略
- 價格策略
- 年度檔期
- 營運實戰
- 平台趨勢
- LINE 禮物 FAQ

內容來源以《2026 LINE 禮物資訊分享》為基礎，保留原資料的用語與框架，包括：

- 20–44 歲用戶占比超過八成。
- 情緒、儀式、商務、吉時四大社交送禮場景。
- 人際關係與送禮預算的價格帶判斷。
- 商品、流量、轉換三大成長結構。
- 更好逛、更心動、更好送的成長建議。

任何平台數據在正式發布前都必須保留來源、年份與查核狀態，不得把未確認數據寫成永久事實。

### 6.8 品牌成長案例

案例結構：

- 品牌背景
- 原始問題
- 核心判斷
- 策略
- 執行
- 成果
- 關鍵數據
- 圖片
- 延伸閱讀
- 對應服務

首頁精選與案例列表共用同一筆資料，不重複維護。

### 6.9 品牌觀點

分類：

- LINE 禮物
- 電商
- 品牌策略
- 商品策略
- 行銷與廣告
- 顧問觀點

每篇文章支援作者、封面、摘要、正文、分類、標籤、SEO、相關內容與 CTA。

### 6.10 FAQ

分類：

- 平台申請
- 商品與供貨
- 費用與抽成
- 廣告與版位
- 合作流程
- 品牌成長健檢

FAQ 頁面與各服務頁可以共用同一筆 FAQ 資料。

### 6.11 品牌資源中心

內容類型：

- 年度檔期行事曆
- 上架檢查清單
- 商品規劃模板
- 送禮場景指南
- 品牌成長指南
- 白皮書

V2.0 先支援公開內容與檔案下載；名單交換下載延後至 V2.5。

## 7. 後台架構

### 7.1 Dashboard

顯示：

- 本月品牌成長健檢申請數
- 待聯繫申請數
- 研究院文章數
- 品牌觀點文章數
- 案例數
- FAQ 數
- 待發布草稿
- 最近更新

未串接 GA4 與 Search Console 前，不顯示假流量數據。每個資料區塊必須標示資料來源。

### 7.2 後台導覽

- Dashboard
- 品牌成長健檢
- 品牌成長案例
- LINE 禮物研究院
- 品牌觀點
- FAQ
- 品牌資源
- 頁面內容
- 導覽與頁尾
- 媒體中心
- SEO
- 使用者與權限
- 網站設定
- 版本紀錄

### 7.3 固定版型頁面管理

每個頁面以區塊為單位管理，欄位依設計固定：

- 標題
- 副標
- 內文
- 圖片
- 圖片 ALT
- CTA 文字
- CTA 連結
- 顯示／隱藏
- 排序
- SEO

管理員可以改內容、排序與顯示狀態，但不能在後台自由拖出破壞設計的任意版型。

### 7.4 內容狀態

所有內容型資料使用：

- `draft`
- `scheduled`
- `published`
- `unpublished`
- `archived`

V2.0 介面先完整支援草稿、預覽、發布、下架、封存；排程欄位保留，排程執行可在 V2.5 啟用。

### 7.5 版本管理

每次正式發布前建立 snapshot，保存：

- 內容 JSON
- 編輯者
- 版本時間
- 版本說明

可檢視版本與還原，還原動作本身也會產生新版本，不直接刪除歷史。

## 8. 資料模型

主要資料表：

- `profiles`
- `roles`
- `profile_roles`
- `site_settings`
- `navigation_items`
- `pages`
- `page_sections`
- `content_revisions`
- `media_assets`
- `categories`
- `tags`
- `content_tags`
- `academy_articles`
- `insight_articles`
- `case_studies`
- `faqs`
- `resources`
- `growth_audit_applications`
- `growth_audit_notes`
- `related_content`
- `seo_metadata`
- `audit_events`

共通欄位：

- `id uuid`
- `status`
- `slug`
- `created_at`
- `updated_at`
- `published_at`
- `created_by`
- `updated_by`

`slug` 在各內容類型中必須唯一，變更已發布 slug 時建立 redirect 記錄。

## 9. 權限

### Super Admin

完整權限：網站設定、使用者、內容、刪除、還原、發布。

### Editor

可新增、編輯、預覽、提交發布；不可修改系統設定、角色與永久刪除。

### Marketing

可管理首頁、CTA、品牌觀點、研究院、SEO 與媒體；不可查看健檢內部備註。

### Service

可查看品牌成長健檢申請、更新狀態與內部備註；不可改網站內容與系統設定。

資料庫以 Supabase RLS 實作，前端隱藏選單不能作為唯一權限防護。

## 10. 品牌成長健檢資料流程

狀態：

- `new`
- `reviewing`
- `contacted`
- `qualified`
- `second_form_sent`
- `scheduled`
- `completed`
- `not_suitable`
- `archived`

提交流程：

1. Server-side Zod 驗證。
2. honeypot 與 rate limit 檢查。
3. 儲存申請資料。
4. 寫入 audit event。
5. 寄送 G9G 管理通知。
6. 寄送申請人確認信，內容不承諾一定取得健檢名額。
7. 前台顯示成功頁。

個資只能讓 Super Admin 與 Service 角色存取。

## 11. SEO 與內容治理

每個可索引頁面欄位：

- SEO title
- Meta description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Index／noindex
- Sitemap inclusion

自動產生：

- Breadcrumb JSON-LD
- Article JSON-LD
- FAQPage JSON-LD
- Organization JSON-LD
- WebSite JSON-LD

內部連結原則：

- 研究院文章連到案例、FAQ、品牌成長健檢。
- 服務頁連到對應案例與研究院內容。
- 案例連到對應服務與延伸文章。
- FAQ 連回最直接的服務或研究院文章。

內容來源治理：

- 平台數據保存來源名稱、來源年份與最後查核日期。
- 不把未確認資訊寫成即時事實。
- 來源 PDF 轉寫時保留原始架構，不擅自補齊資料缺口。

## 12. 分析與事件追蹤

V2.0 事件：

- `growth_audit_start`
- `growth_audit_submit`
- `contact_click`
- `line_click`
- `phone_click`
- `email_click`
- `resource_download`
- `article_cta_click`

轉換：

- 主要轉換：品牌成長健檢表單送出。
- 次要轉換：LINE、電話、Email、諮詢 CTA 點擊。
- 同時保存 first-touch 與 last-touch attribution。
- 內部人員流量支援排除。

GA4、Search Console 與 Clarity 的 ID 由網站設定管理，不寫死在程式碼中。

## 13. 視覺與設計系統

方向：正式顧問公司、品牌策略公司、內容研究平台。

原則：

- 大量留白與清楚層級。
- LINE 綠只作為重點色，不使用滿版高飽和綠。
- 深色、米白、灰階建立穩重企業感。
- IP 插畫只用於少數品牌輔助區塊。
- 案例與信任區優先使用真實照片、商品圖、成果圖與可驗證資訊。
- 手機版優先確保可讀性、表單完成率與 CTA 可見性。

Design tokens：

- Colors
- Typography
- Spacing
- Radius
- Shadow
- Grid
- Buttons
- Cards
- Form controls
- Status badges
- Tables
- Dialogs

所有元件需符合 WCAG AA 的基本對比與鍵盤操作要求。

## 14. 錯誤處理與安全

- 表單驗證錯誤就地顯示，不清空使用者已填內容。
- 後台操作成功與失敗均顯示明確通知。
- 服務端錯誤寫入日誌，不把敏感資訊回傳前端。
- 媒體上傳限制 MIME、大小與副檔名。
- 私人資源與健檢資料使用 private bucket 或授權 URL。
- 使用者權限由 RLS 與 server-side 檢查雙重保護。
- 所有管理操作寫入 `audit_events`。
- 永久刪除只限 Super Admin，預設以封存代替刪除。

## 15. 測試策略

### Unit

- Zod schema
- slug 產生與驗證
- 狀態轉換
- 權限判斷
- SEO metadata 產生
- attribution 解析

### Integration

- 健檢表單提交與通知
- 內容草稿、預覽、發布
- 版本建立與還原
- 媒體上傳與引用
- RLS 權限

### E2E

- 首頁到品牌成長健檢提交
- 管理員登入與內容發布
- 編輯者無法進入系統設定
- Service 只能操作健檢申請
- 文章發布後出現在前台與 sitemap
- 手機導覽與固定 CTA

### Quality gate

正式部署前必須通過：

- lint
- typecheck
- unit tests
- integration tests
- build
- database policy tests
- Playwright smoke tests

## 16. 部署與環境

環境：

- Local
- Preview
- Production

分支：

- `main`：正式環境
- `develop`：整合開發環境
- `feature/*`：功能分支

正式上線流程：

1. feature branch 開發與測試。
2. PR 合併至 develop，產生 Preview。
3. 驗收前台、後台、SEO、表單與手機版。
4. develop 合併至 main。
5. Production migration。
6. 發布後 smoke test。
7. 確認 sitemap、robots、canonical、表單與 Email。

自訂網域尚未購買時，可先以預覽網域測試；正式累積 SEO 前應完成正式網域與 canonical 設定。

## 17. 不在 V2.0 範圍

- 自動發布社群
- 線上付款
- 線上簽約
- 會員訂閱
- 線上課程
- AI 自動寫文與自動發布
- 完整 CRM
- 即時聊天客服
- GA4、Search Console 歷史數據回填

以上功能只能在 V2.0 穩定後新增，不得阻礙正式官網與 CMS 上線。

## 18. 驗收標準

1. 所有主要頁面均為獨立 URL，沒有一頁式網站感。
2. 桌面、平板、手機皆可正常使用。
3. 導覽與麵包屑清楚，研究院具有多層內容結構。
4. 全站搜尋不到用來形容健檢的「免費」字樣。
5. 第一階段健檢表單只包含已定案欄位。
6. 前台每個可見內容都有後台對應欄位。
7. 研究院、觀點、案例、FAQ、資源可新增、編輯、預覽、發布、下架與封存。
8. 版本還原可用，且不破壞歷史紀錄。
9. 權限由資料庫與 server-side 驗證，不只靠 UI。
10. SEO metadata、sitemap、robots、canonical、Schema 可驗證。
11. 表單成功送出後，管理員與申請人均收到正確通知。
12. 未連接真實分析來源前，Dashboard 不顯示虛構數據。
13. 內容與服務價格符合本規格。
14. 所有測試與 build 通過後才可正式部署。

## 19. 實作拆分建議

此設計規格涵蓋多個獨立子系統，實作應拆成以下計畫，依序交付可測試版本：

1. Foundation：Next.js、Design System、Auth、Supabase、CI。
2. Public Website：導覽、首頁、企業頁、服務頁、RWD、SEO 基礎。
3. Content CMS：研究院、觀點、案例、FAQ、資源、媒體。
4. Growth Audit：前台表單、後台申請管理、Email、隱私與權限。
5. Page CMS：固定版型頁面管理、導覽、頁尾、網站設定。
6. Revisions & Publishing：草稿、預覽、發布、封存、版本還原。
7. SEO & Analytics：metadata、Schema、sitemap、事件追蹤、來源標示。
8. Hardening & Release：RLS、安全、測試、效能、部署與營運手冊。
