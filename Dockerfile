# 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
ARG BASE_PATH=/tools
ENV BASE_PATH=${BASE_PATH}
RUN npm run build

# 运行阶段
FROM node:20-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV production
ENV PORT 3001
ENV BASE_PATH=/tools

# 从构建阶段复制必要文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "server.js"]
