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

export async function needIsAdmin(): Promise<{ sessionUser: Session['user'] }> {
  const { sessionUser } = await needAuth();

  if (!sessionUser.isAdmin) {
    throw new Error('非管理员');
  }

  return { sessionUser: sessionUser };
}

export async function needId(id: string): Promise<void> {
  if (!id) {
    throw new Error('id 不能为空');
  }
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

interface CommonArgs {
  where?: any;
  include?: any;
  omit?: any;
  select?: any;
}

/** 封装通用分页查询 */
export async function pageModel<T>({
  model,
  params,
  where,
  include,
  omit,
  select,
}: {
  model: any;
  params: PageParams;
} & CommonArgs): Promise<PageResult<T>> {
  await needAuth();

  const { pageSize, current } = params;
  const skip = (current - 1) * pageSize;

  const [total, data] = await Promise.all([
    model.count({ where }),
    model.findMany({
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
export async function getModelById<T>({
  model,
  id,
  where,
  include,
}: {
  model: any;
  id: string;
} & CommonArgs) {
  await needId(id);
  await needAuth();

  const result = await model.findUnique({
    where: { id, ...where },
    include,
  });

  if (!result) {
    throw new Error(`${model.toString()} 不存在`);
  }

  return result as T;
}

/** 封装常用 create */
export async function createModel<T, C>({
  model,
  data,
}: {
  model: any;
  data: C;
} & CommonArgs) {
  await needAuth();

  const result = await model.create({
    data,
  });

  return result as T;
}

/** 封装常用 update */
export async function updateModel<T>({
  model,
  data,
}: {
  model: any;
  data: T & { id: string };
} & CommonArgs) {
  await needId(data.id);
  await needAuth();

  const result = await model.update({
    where: { id: data.id },
    data,
  });

  if (!result) {
    throw new Error(`${model.toString()} 不存在`);
  }

  return result as T;
}

/** 封装常用 delete */
export async function deleteModel({ model, id, where }: { model: any; id: string } & CommonArgs) {
  await needId(id);
  await needAuth();

  const result = await model.delete({
    where: { id, ...where },
  });

  if (!result) {
    throw new Error(`${model.toString()} 不存在`);
  }
}
