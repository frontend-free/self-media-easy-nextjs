# SUBJECT MEDIA

## 开发

准备db。创建 `.env` 文件并添加以下内容：

```text
DATABASE_URL="file:./prisma/dev.db"
```

准备 auth 密钥

```bash
npx auth secret
```

启动开发

```bash
pnpm dev
```

## 部署

准备 db。创建 `.env` 文件并添加以下内容：

```text
DATABASE_URL="file:./prisma/prod.db"
```

准备 auth 密钥

```bash
npx auth secret
```

构建启动

```bash
npx prisma migrate deploy
npx prisma generate
pnpm build
pnpm start
```
