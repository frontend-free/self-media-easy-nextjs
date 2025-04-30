'use server';

import { Publish } from '@/generated/prisma';
import { omit } from 'lodash-es';
import { createModel, deleteModel, needAuth, pageModel } from './helper';

export type CreatePublishInput = Pick<
  Publish,
  'resourceType' | 'resourceOfVideo' | 'title' | 'description' | 'publishType'
> & { accountIds: string[] };

export async function createPublish(data: CreatePublishInput) {
  const { sessionUser } = await needAuth();

  const publish = await createModel<
    CreatePublishInput & { accounts: { connect: { id: string }[] }; userId: string }
  >({
    model: 'publish',
    data: {
      ...omit(data, 'accountIds'),
      accounts: {
        connect: data.accountIds.map((id) => ({ id })),
      },
      userId: sessionUser.id,
    },
  });

  return publish;
}

export async function pagePublishes(params: {
  pageSize: number;
  current: number;
  title?: string;
  publishType?: string;
  resourceType?: string;
}) {
  const { sessionUser } = await needAuth();

  return pageModel<Publish>({
    model: 'publish',
    params,
    where: {
      title: { contains: params.title },
      userId: sessionUser.id,
    },
    include: {
      tasks: true,
    },
  });
}

export async function deletePublish(id: string) {
  const { sessionUser } = await needAuth();

  return deleteModel({
    model: 'publish',
    id,
    where: {
      userId: sessionUser.id,
    },
  });
}
