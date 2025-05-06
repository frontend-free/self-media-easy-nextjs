# SUBJECT MEDIA

## 开发

准备db

```bash
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

准备 db

```bash
DATABASE_URL="file:./prisma/prod.db"
```

准备 auth 密钥

```bash
npx auth secret
```

构建启动

```bash
pnpm build
pnpm start
```
