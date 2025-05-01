# 使用 Node.js 20 的 Alpine 基礎映像作為執行環境
FROM node:20-alpine3.18 AS runner

# 設定工作目錄
WORKDIR /app

# 設定環境變數
ENV NODE_ENV=production 
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 建立系統群組和使用者，並設定 UID 和 GID
RUN addgroup --system --gid 1001 eventa && \
    adduser --system --uid 1001 --ingroup eventa eventaUser

# 複製建構成果到映像中
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public
COPY package.json ./package.json

# 設定檔案權限給 eventaUser
RUN chown -R eventaUser:eventa /app

# 切換到非 root 使用者執行
USER eventaUser

# 開放埠號 3000
EXPOSE 3000

# 設定容器啟動時執行的命令
CMD ["node", "server.js"]