'use server';

import { Publish } from '@/generated/prisma';
import { createModel, deleteModel, needAuth, pageModel } from './helper';

export type CreatePublishInput = Omit<Publish, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export async function createPublish(data: CreatePublishInput) {
  const { sessionUser } = await needAuth();

  return createModel<CreatePublishInput & { userId: string }>({
    model: 'publish',
    data: {
      ...data,
      userId: sessionUser.id,
    },
  });
}

export async function pagePublishes(params: {
  pageSize: number;
  current: number;
  title?: string;
  publishType?: string;
  resourceType?: string;
}) {
  return pageModel<Publish>({
    model: 'publish',
    params,
    where: {
      title: { contains: params.title },
      publishType: params.publishType as any,
      resourceType: params.resourceType as any,
    },
    include: {
      tasks: {
        include: {
          account: true,
        },
      },
    },
  });
}

export async function deletePublish(id: string) {
  return deleteModel({
    model: 'publish',
    id,
  });
}
