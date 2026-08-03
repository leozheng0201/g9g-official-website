# LINE 禮物官方資料私人預覽操作手冊

## 目的

本手冊用於第五階段的私人預覽與驗收。此流程只適用於 `develop`／Preview 環境，不包含 `main` 或 Production 發布。

## 預覽範圍

- 首頁官方數據信任區
- `/about-line-gift`
- `/line-gift-academy`
- CMS 草稿私人預覽頁

## 建立私人預覽

1. 以具有 CMS 權限的帳號登入後台。
2. 開啟 slug 為 `about-line-gift` 的內容。
3. 使用「建立私人預覽連結」。
4. 確認預覽網址為 `/preview/content/<token>`，且網址中沒有姓名、Email、電話或其他個資。
5. 將連結只提供給本次驗收人員。

## 撤銷私人預覽

1. 回到該內容的預覽管理區。
2. 撤銷目前有效的 token。
3. 確認原連結再次開啟時回傳 404。
4. 過期 token 不得重新啟用，需重新建立新連結。

## 桌機版驗收

檢查 `/about-line-gift`：

- H1 為「認識 LINE 禮物：品牌進入送禮市場前，應該先看懂什麼？」
- 官方資料、老莊營運解讀、G9G 可以協助三種標籤清楚區分
- 900 萬、8,000 萬、20–44 歲超過八成、34 歲以下超過 55%、60%／40% 正確
- 四大場景依序為儀式、商務、吉時、情緒
- 商品 × 流量 × 轉換與更好逛、更心動、更好送正確
- 顯示完整資料來源與非官方代理商聲明
- 不出現 `scrutator`、QR Code或「免費品牌健檢」
- canonical 指向 `/about-line-gift`

檢查首頁：

- 最多顯示四項核准官方資訊
- 顯示「資料來源：2026 LINE 禮物資訊分享」
- 「完整認識 LINE 禮物」連到 `/about-line-gift`
- 原本 Hero 與主要 CTA 不變

檢查研究院：

- 「先認識 LINE 禮物」入口存在
- 入口連到 `/about-line-gift`
- 原文章列表仍可正常顯示

## 390px 手機版驗收

使用 390 × 844 viewport 檢查：

- 頁面沒有水平捲動
- 數據卡、場景卡與三層信任卡正常換行
- CTA 可點擊且不超出畫面
- 來源聲明完整可讀

## Preview 安全與索引核對

私人預覽頁必須：

- 頁首固定顯示「未公開預覽」
- robots 為 `noindex, nofollow`
- 不出現在 sitemap
- token 可撤銷且有到期時間
- 無效、過期或已撤銷 token 回傳 404

## 發布邊界

本階段只允許：

- feature branch 開發
- Draft PR
- 合併至 `develop`
- 私人 Preview 驗收

本階段禁止：

- 合併至 `main`
- 發布 Production
- 對外宣稱正式上線
- 將私人 Preview 開放搜尋引擎索引
