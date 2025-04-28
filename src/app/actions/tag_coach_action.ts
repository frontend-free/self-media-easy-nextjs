'use server';

import { TagCoach } from '@/generated/prisma';
import { createModel, deleteModel, getModelById, needAuth, pageModel, updateModel } from './helper';

export type CreateTagCoachInput = Pick<TagCoach, 'name'>;

export type UpdateTagCoachInput = Partial<Pick<TagCoach, 'name'>> & { id: string };

export async function createTagCoach(data: CreateTagCoachInput) {
  const { sessionUser } = await needAuth();

  return createModel<CreateTagCoachInput & { userId: string }>({
    model: 'tagCoach',
    data: {
      ...data,
      userId: sessionUser.id,
    },
  });
}

export async function pageTagCoaches(params: { pageSize: number; current: number; name?: string }) {
  const { sessionUser } = await needAuth();

  return pageModel<TagCoach>({
    model: 'tagCoach',
    params,
    where: {
      name: { contains: params.name },
      userId: sessionUser.id,
    },
    include: {
      user: true,
      account: true,
    },
  });
}

export async function getTagCoachById(id: string) {
  const { sessionUser } = await needAuth();

  return getModelById<TagCoach>({
    model: 'tagCoach',
    id,
    include: {
      user: true,
      account: true,
    },
    where: {
      id,
      userId: sessionUser.id,
    },
  });
}

// 更新 TagCoach
export async function updateTagCoach(data: UpdateTagCoachInput) {
  const { sessionUser } = await needAuth();

  return updateModel<UpdateTagCoachInput>({
    model: 'tagCoach',
    data,
    where: {
      id: data.id,
      userId: sessionUser.id,
    },
  });
}

// 删除 TagCoach
export async function deleteTagCoach(id: string) {
  const { sessionUser } = await needAuth();

  return deleteModel({
    model: 'tagCoach',
    id,
    where: {
      id,
      userId: sessionUser.id,
    },
  });
}
