import { PrismaClient } from '@/generated/prisma';

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

const prisma = new PrismaClient();

/**
 * 通用分页查询辅助函数
 */
export async function pageModel<T, K extends keyof PrismaClient>({
  model,
  params,
  where,
}: {
  model: K;
  params: PageParams;
  where: any;
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
