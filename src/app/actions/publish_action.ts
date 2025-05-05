'use server';

import { Prisma, Publish } from '@/generated/prisma';
import { omit } from 'lodash-es';
import { createModel, deleteModel, pageModel, prisma } from './helper';
import * as TaskAction from './task_action';

export type CreatePublishInput = Pick<
  Publish,
  'resourceType' | 'resourceOfVideo' | 'title' | 'description' | 'publishType'
> & { accountIds: string[] };

export async function pagePublishes(params: { pageSize: number; current: number }) {
  return pageModel<Prisma.PublishDelegate, Publish>(
    {
      model: prisma.publish,
      params,
      include: {
        tasks: true,
      },
    },
    {
      withUser: true,
    },
  );
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

export async function createPublish(data: CreatePublishInput) {
  const publish = await createModel<Prisma.PublishDelegate, Publish>(
    {
      model: prisma.publish,
      data: {
        ...omit(data, 'accountIds'),
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
    await TaskAction.createTasksForPublish({
      publishId,
      accountId,
    });
  }

  return publish;
}
