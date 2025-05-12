import { auth } from '@/auth';
import { Prisma, PrismaClient } from '@/generated/prisma';
import { Operation } from '@prisma/client/runtime/library';
import { Session } from 'next-auth';

/** 检查登录态 */
export async function needAuth(): Promise<{ sessionUser: Session['user'] }> {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('请先登录');
  }

  return { sessionUser: session.user };
}

/** 检查是否是管理员 */
export async function needIsAdmin(): Promise<{ sessionUser: Session['user'] }> {
  const { sessionUser } = await needAuth();

  if (!sessionUser.isAdmin) {
    throw new Error('非管理员');
  }

  return { sessionUser: sessionUser };
}

/** 检查 id 是否存在 */
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

interface CommonArgs<D, M extends Operation> {
  where?: Prisma.Args<D, M>['where'];
  include?: Prisma.Args<D, M>['include'];
  omit?: Prisma.Args<D, M>['omit'];
  select?: Prisma.Args<D, M>['select'];
}

interface CommonOptions {
  /** 数据归属当前用户 */
  withUser?: boolean;
}

/** 封装通用分页查询 */
export async function pageModel<D, R>(
  {
    model,
    params,
    where: argsWhere,
    include,
    omit,
    select,
  }: {
    model: any;
    params: PageParams;
  } & CommonArgs<D, 'findMany'>,
  options?: CommonOptions,
): Promise<PageResult<R>> {
  const { sessionUser } = await needAuth();

  // 查询时，不包含已删除的数据
  const where = { ...argsWhere, deletedAt: null };

  if (options?.withUser) {
    // @ts-expect-error 暂时不知道如何处理，先这样
    where.userId = sessionUser.id;
  }

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

/** 封装常用 create */
export async function createModel<D, R>(
  {
    model,
    data: argsData,
  }: {
    model: any;
    data: Omit<Prisma.Args<D, 'create'>['data'], 'userId'>;
  },
  options?: CommonOptions,
) {
  const data = { ...argsData };
  const { sessionUser } = await needAuth();

  // 如果需要归属当前用户，则添加 userId
  if (options?.withUser) {
    // @ts-expect-error 暂时不知道如何处理，先这样
    data.userId = sessionUser.id;
  }

  const result = await model.create({
    data,
  });

  return result as R;
}

/** 封装常用 get */
export async function getModelById<D, R>(
  {
    model,
    id,
    where: argsWhere,
    include,
  }: {
    model: any;
    id: string;
  } & CommonArgs<D, 'findUnique'>,
  options?: CommonOptions,
) {
  await needId(id);
  const { sessionUser } = await needAuth();

  const where = { ...argsWhere, deletedAt: null };

  // 如果需要归属当前用户，则添加 userId
  if (options?.withUser) {
    // @ts-expect-error 暂时不知道如何处理，先这样
    where.userId = sessionUser.id;
  }

  const result = await model.findUnique({
    where: { id, ...where },
    include,
  });

  if (!result) {
    throw new Error(`数据不存在`);
  }

  return result as R;
}

/** 封装常用 findFirst */
export async function findFirstModel<D, R>(
  {
    model,
    where: argsWhere,
  }: {
    model: any;
  } & CommonArgs<D, 'findFirst'>,
  options?: CommonOptions,
) {
  const { sessionUser } = await needAuth();

  const where = { ...argsWhere, deletedAt: null };

  // 如果需要归属当前用户，则添加 userId
  if (options?.withUser) {
    // @ts-expect-error 暂时不知道如何处理，先这样
    where.userId = sessionUser.id;
  }

  const result = await model.findFirst({
    where: { ...where },
  });

  return result as R;
}

/** 封装常用 update */
export async function updateModel<D, R, U extends { id: string }>(
  {
    model,
    data,
    where: argsWhere,
  }: {
    model: any;
    data: U;
  } & CommonArgs<D, 'update'>,
  options?: CommonOptions,
) {
  await needId(data.id);
  const { sessionUser } = await needAuth();

  // 更新时，不包含已删除的数据
  const where = { ...argsWhere, deletedAt: null };

  // 如果需要归属当前用户，则添加 userId
  if (options?.withUser) {
    // @ts-expect-error 暂时不知道如何处理，先这样
    where.userId = sessionUser.id;
  }

  const result = await model.update({
    where: { id: data.id, ...where },
    data,
  });

  if (!result) {
    throw new Error(`数据不存在`);
  }

  return result as R;
}

/** 封装常用 delete */
export async function deleteModel<D>(
  {
    model,
    id,
    where: argsWhere,
  }: {
    model: any;
    id: string;
  } & CommonArgs<D, 'delete'>,
  options?: CommonOptions,
) {
  await needId(id);
  const { sessionUser } = await needAuth();

  // 就不加 deleteAt 了，直接删除
  const where = { ...argsWhere };

  // 如果需要归属当前用户，则添加 userId
  if (options?.withUser) {
    // @ts-expect-error 暂时不知道如何处理，先这样
    where.userId = sessionUser.id;
  }

  const result = await model.update({
    data: { deletedAt: new Date() },
    where: { id, ...where },
  });

  if (!result) {
    throw new Error(`数据不存在`);
  }
}
