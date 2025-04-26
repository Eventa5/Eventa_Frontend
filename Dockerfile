# 第一階段：建構
FROM node:20-alpine3.18 AS builder

WORKDIR /app
ENV NODE_ENV=production

# 安裝依賴
COPY package.json package-lock.json* ./
RUN npm ci

# 複製專案檔案並建置
COPY . .
RUN npm run build

# 第二階段：執行
FROM node:20-alpine3.18 AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# 建立非 root 使用者
RUN addgroup --system --gid 1001 eventa && \
    adduser --system --uid 1001 --ingroup eventa eventaUser

# 複製建置好的檔案
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 調整檔案擁有權
RUN chown -R eventaUser:eventa /app

# 切換到非 root 使用者
USER eventaUser

# 開放 3000 port
EXPOSE 3000

# 啟動應用程式
CMD ["node", "server.js"]
