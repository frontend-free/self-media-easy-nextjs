# SUBJECT MEDIA

## 开发

准备db。创建 `.env` 文件并添加以下内容：

```text
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_UPDATER_SERVER="https://live-app.sanljt.cn/subject-media-electron"
```

准备 auth 密钥

```bash
npx auth secret
```

开发

```bash
pnpm i
pnpm dev
```

## 部署

准备 db。创建 `.env` 文件并添加以下内容：

```text
DATABASE_URL="file:./prisma/prod.db"
NEXT_PUBLIC_UPDATER_SERVER="https://live-app.sanljt.cn/subject-media-electron"
```

准备 auth 密钥

```bash
npx auth secret
```

部署

- 服务器 47.105.58.181
- 前往 /home/ecs-user/apps
- 运行 `./deploy.sh`，即自动部署

## 技术栈

- next.js
- next-auth 认证
- prisma sqlite 数据库
- antd @ant-design/pro-components 组件
- tailwindcss 样式
