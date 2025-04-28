import { auth } from '@/auth';
import { PrismaClient } from '@/generated/prisma';
import { Session } from 'next-auth';

// 创建一个装饰器函数来检查用户认证
export async function needAuth(): Promise<{ sessionUser: Session['user'] }> {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('请先登录');
  }

  return { sessionUser: session.user };
}

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

/** 封装通用分页查询 */
export async function pageModel<T>(
  model: keyof PrismaClient,
  {
    params,
    where,
    include,
    omit,
    select,
  }: {
    params: PageParams;
    where: any;
    include?: any;
    omit?: any;
    select?: any;
  },
): Promise<PageResult<T>> {
  const { pageSize, current } = params;
  const skip = (current - 1) * pageSize;

  const prismaModel = prisma[model] as any;

  await needAuth();

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

/** 封装常用 get */
export async function getModelById<T>(model: keyof PrismaClient, id: string) {
  const prismaModel = prisma[model] as any;

  await needAuth();

  const result = await prismaModel.findUnique({
    where: { id },
  });

  if (!result) {
    throw new Error(`${model.toString()} 不存在`);
  }

  return result as T;
}

/** 封装常用 create */
export async function createModel<T>(model: keyof PrismaClient, data: T) {
  const prismaModel = prisma[model] as any;

  await needAuth();

  const result = await prismaModel.create({
    data,
  });

  return result as T;
}

/** 封装常用 update */
export async function updateModel<T>(model: keyof PrismaClient, data: T & { id: string }) {
  const prismaModel = prisma[model] as any;

  await needAuth();

  const result = await prismaModel.update({
    where: { id: data.id },
    data,
  });

  if (!result) {
    throw new Error(`${model.toString()} 不存在`);
  }

  return result as T;
}

/** 封装常用 delete */
export async function deleteModel(model: keyof PrismaClient, id: string) {
  const prismaModel = prisma[model] as any;

  await needAuth();

  const result = await prismaModel.delete({
    where: { id },
  });

  if (!result) {
    throw new Error(`${model.toString()} 不存在`);
  }
}
