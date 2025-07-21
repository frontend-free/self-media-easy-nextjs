'use server';

import { Prisma, Publish } from '@/generated/prisma';
import { batchDeleteModel, createModel, deleteModel, needAuth, pageModel, prisma } from './helper';
import * as TaskActions from './task_actions';

export type CreatePublishInput = Pick<
  Publish,
  'resourceType' | 'resourceOfVideo' | 'title' | 'description' | 'publishType' | 'adText'
> & { accountIds: string[] };

export async function pagePublishes(params: { pageSize: number; current: number; title?: string }) {
  return pageModel<Prisma.PublishDelegate, Publish>(
    {
      model: prisma.publish,
      params,
      include: {
        tasks: {
          include: {
            account: true,
          },
        },
      },
      where: {
        title: {
          contains: params.title,
        },
      },
    },
    {
      withUser: true,
    },
  );
}

export async function createPublish(data: CreatePublishInput) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accountIds, ...rest } = data;

  const publish = await createModel<Prisma.PublishDelegate, Publish>(
    {
      model: prisma.publish,
      data: {
        ...rest,
        accounts: {
          connect: data.accountIds.map((id) => ({ id })),
        },
      },
    },
    {
      withUser: true,
    },
  );

  const publishId = publish.id;

  for (const accountId of data.accountIds) {
    await TaskActions.createTasksForPublish({
      publishId,
      accountId,
    });
  }

  return publish;
}

export async function deletePublish(id: string) {
  return deleteModel<Prisma.PublishDelegate>(
    {
      model: prisma.publish,
      id,
    },
    {
      withUser: true,
    },
  );
}

export async function batchDeletePublishes(ids: string[]) {
  return batchDeleteModel<Prisma.PublishDelegate>(
    {
      model: prisma.publish,
      ids,
    },
    {
      withUser: true,
    },
  );
}

/** 获取最近10条不同的标题 */
export async function getPublishTitles(): Promise<string[]> {
  const { sessionUser } = await needAuth();

  const titles = await prisma.publish.findMany({
    select: {
      title: true,
    },
    where: {
      AND: [{ title: { not: null } }, { title: { not: '' } }],
      userId: sessionUser.id,
    },
    // 去重
    distinct: ['title'],
    orderBy: {
      createdAt: 'desc',
    },
    // 限制返回 10 条记录
    take: 10,
  });

  return titles.map((title) => title.title as string);
}
