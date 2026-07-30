# TypeScript／ESLint 相容性決策

日期：2026-07-30  
狀態：採用

## 背景

Foundation 初始計畫鎖定 TypeScript 7.0.2。第一次 GitHub Actions 驗證在 `npm run lint` 穩定失敗，錯誤為：

```text
Error: typescript-eslint does not support TS 7.0.
```

`eslint-config-next@16.2.12` 依賴 `typescript-eslint`，而 typescript-eslint 官方目前支援 TypeScript `>=4.8.4 <6.1.0`。

## 決策

Foundation 改鎖定 TypeScript 6.0.3，直到 Next.js 官方 ESLint 設定所使用的 typescript-eslint 正式支援 TypeScript 7。

## 影響

- Next.js 16.2.12、React 19.2.8、Node.js 24 與其他核心版本不變。
- `typecheck` 仍由正式 TypeScript 編譯器執行。
- 未來升級 TypeScript 7 前，必須先以 CI 驗證 ESLint、typecheck、unit tests 與 build 全部通過。
- 本決策優先於 Foundation 計畫文件內原先的 TypeScript 7.0.2 版本文字。
