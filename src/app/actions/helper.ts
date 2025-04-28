import { auth } from '@/auth';
import { PrismaClient } from '@/generated/prisma';
import { Session } from 'next-auth';

export interface PageParams {
  pageSize: number;
  current: number;
  [key: string]: any;
}

export interface PageResult<T> {
  data: T[];
  total: number;
  success: boolean;
  pageSize: number;
  current: number;
}

export const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

/**
 * 通用分页查询辅助函数
 */
export async function pageModel<T, K extends keyof PrismaClient>({
  model,
  params,
  where,
  include,
  omit,
  select,
}: {
  model: K;
  params: PageParams;
  where: any;
  include?: any;
  omit?: any;
  select?: any;
}): Promise<PageResult<T>> {
  const { pageSize, current } = params;
  const skip = (current - 1) * pageSize;

  const prismaModel = prisma[model] as any;

  const [total, data] = await Promise.all([
    prismaModel.count({ where }),
    prismaModel.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include,
      omit,
      select,
    }),
  ]);

  return {
    data,
    total,
    success: true,
    pageSize,
    current,
  };
}

// 创建一个装饰器函数来检查用户认证
export async function needAuth(): Promise<{ sessionUser: Session['user'] }> {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('请先登录');
  }

  return { sessionUser: session.user };
}
