# Eventa - 活動票務管理平台前端專案

## 專案簡介

Eventa 是一個現代化的活動票務管理平台，致力於提供最佳的活動體驗。我們的前端使用 Next.js 開發，提供以下功能：

- **給參與者**：輕鬆搜尋、購買與管理活動票券
- **給主辦方**：快速建立活動、管理票種與查看銷售情況
- **系統特色**：帳號整合登入、即時票務管理、QR Code 報到、AI 客服問答功能

## 專案架構

```
src/
├── app/             # Next.js 應用目錄，包含路由和頁面
├── components/      # 共用元件
├── features/        # 功能模組化組織
├── hooks/           # 自定義 React Hooks
├── services/        # API 服務和資料獲取
├── store/           # 全局狀態管理
├── types/           # TypeScript 類型定義
└── utils/           # 工具函數
```

## 使用技術

### 核心技術
- **Next.js 15** - React 框架，提供 SSR/SSG 等功能
- **React 19** - 使用最新版本的 React
- **TypeScript 5** - 類型安全的 JavaScript 超集

### UI & 樣式
- **Tailwind CSS v4** - 原子化 CSS 框架
- **shadcn/ui** - 基於 Radix UI 的元件庫
- **Lucide React** - 輕量級圖標庫

### 狀態管理 & 資料獲取
- **Zustand** - 輕量級全局狀態管理
- **SWR** - 用於資料獲取的 React Hooks
- **@hey-api/client-next** - API 客戶端

### 表單處理
- **React Hook Form** - 高效表單處理
- **Zod** - TypeScript 優先的模式驗證

### 開發工具
- **Biome** - 代碼格式化和靜態分析
- **Husky** - Git hooks 工具
- **Commitlint** - 提交訊息規範檢查

## 如何開始

```bash
# clone repo
git clone https://github.com/Eventa5/Eventa_Frontend.git
cd Eventa_Frontend

# 安裝相依套件
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

| 指令                  | 說明                         |
| --------------------- | ---------------------------- |
| `npm run dev`         | 啟動開發伺服器                |
| `npm run build`       | 打包專案                      |
| `npm run start`       | 啟動生產環境伺服器             |
| `npm run lint`        | 執行 Biome 代碼檢查           |
| `npm run lint-fix`    | 執行 Biome 代碼檢查並嘗試修復  |
| `npm run format`      | 格式化暫存區的檔案             |
| `npm run generate:api`| 從 OpenAPI 規格生成 TypeScript 類型 |

## 程式碼規範

### 代碼風格

專案使用 [Biome](https://biomejs.dev/) 作為 Linter 與 Formatter，提交前會自動執行檢查：

```bash
# 手動檢查並修正
npm run lint

# 使用 unsafe 模式修復更多問題
npm run lint-fix
```

### Git 提交規範

使用 Commitlint 確保提交訊息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 規範：

```
<type>(<scope>): <subject>

例如:
feat(auth): 新增社群登入功能
fix(checkout): 修復結帳流程錯誤
docs(readme): 更新安裝說明
```

## 部署

### Render 平台部署

專案部署於 Render 平台，正式網站連結：

🔗 https://eventa-frontend.onrender.com/

### Docker 部署

專案包含 Dockerfile，可以直接建構 Docker 映像：

```bash
docker build -t eventa-frontend .
docker run -p 3000:3000 eventa-frontend
```

## CI/CD 自動化流程

專案整合 GitHub Actions，實作 CI/CD 流程：

- **CI（持續整合）**：
  - 針對 PR 到 develop 分支，自動執行：
    - 代碼檢查（Lint）
    - 構建（Build）
    
- **CD（持續部署）**：
  - 當 develop 分支有更新時，自動：
    - 建構 Docker 映像
    - 推送到 Docker Hub
    - 觸發 Render 平台部署

相關設定檔位於 `.github/workflows` 目錄
