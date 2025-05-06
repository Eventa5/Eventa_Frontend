# Eventa Next.js 前端專案

## 專案簡介
使用 Next.js 開發的票務管理平台前端，讓參與者能輕鬆搜尋、購買與管理活動票券，主辦方也能快速建立活動、管理票種與查看銷售情況，系統支援帳號整合登入、即時票務管理、QR Code 報到、AI 客服問答功能，打造流暢的活動體驗。

## 使用技術
- Next.js 15
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui
- zod
- react-hook-form
- Biome (formatter + linter)

## 如何開始
```bash
# clone repo
git clone https://github.com/Eventa5/Eventa_Frontend.git
cd Eventa_Frontend

# 安裝
npm install

# 啟動開發伺服器
npm run dev
```
瀏覽器開啟 http://localhost:3000 查看

### 設置環境變數
根據 `.env.example` 檔案建立 `.env`，設定 API 端點：

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## 可用指令
| 指令              | 說明                |
| --------------- | ----------------- |
| `npm run dev`   | 啟動開發伺服器           |
| `npm run build` | 打包專案              |
| `npm run lint`  | 執行 Biome 代碼檢查與格式化 |

## 程式碼風格

專案使用 [Biome](https://biomejs.dev/) 作為 Linter 與 Formatter，請在 commit 前執行：

```bash
npm run lint
```
或使用 --fix 自動修正格式：

```bash
npm run lint -- --fix
```

## Render 平台部署說明
專案部署於 Render 平台，正式網站連結如下：

🔗 https://eventa-frontend.onrender.com/

## CI/CD 自動化流程

專案整合 GitHub Actions，實作 CI/CD 流程：

- **CI（持續整合）**：
  - 針對 develop 分支的 Pull Request，自動執行以下步驟：
    - 代碼檢查（Lint）
    - 構建（Build）
- **CD（持續部署）**：
  - 當 develop 分支有 push 時，自動：
    - 安裝依賴並建構專案
    - 將 Next.js build 檔案複製至 context 目錄
    - 建構並推送多架構 Docker image 至 Docker Hub
    - 觸發 Render 平台自動部署

相關設定檔位於 `.github/workflows/ci.yml` 與 `.github/workflows/cd.yml`
