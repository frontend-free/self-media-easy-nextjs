'use server';

import { TagCoach } from '@/generated/prisma';
import {
  createModel,
  deleteModel,
  getModelById,
  needAuth,
  pageModel,
  prisma,
  updateModel,
} from './helper';

export type CreateTagCoachInput = Pick<TagCoach, 'name'>;

export type UpdateTagCoachInput = Partial<Pick<TagCoach, 'name'>> & { id: string };

export async function createTagCoach(data: CreateTagCoachInput) {
  const { sessionUser } = await needAuth();

  return createModel<TagCoach, CreateTagCoachInput & { userId: string }>({
    model: prisma.tagCoach,
    data: {
      ...data,
      userId: sessionUser.id,
    },
  });
}

export async function pageTagCoaches(params: { pageSize: number; current: number; name?: string }) {
  const { sessionUser } = await needAuth();

  return pageModel<TagCoach>({
    model: prisma.tagCoach,
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
    model: prisma.tagCoach,
    id,
    include: {
      user: true,
      account: true,
    },
    where: {
      userId: sessionUser.id,
    },
  });
}

// 更新 TagCoach
export async function updateTagCoach(data: UpdateTagCoachInput) {
  const { sessionUser } = await needAuth();

  return updateModel<UpdateTagCoachInput>({
    model: prisma.tagCoach,
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
    model: prisma.tagCoach,
    id,
    where: {
      id,
      userId: sessionUser.id,
    },
  });
}
