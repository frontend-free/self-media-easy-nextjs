'use server';

import { Prisma, TagCoach } from '@/generated/prisma';
import { createModel, deleteModel, getModelById, pageModel, prisma, updateModel } from './helper';

export type CreateTagCoachInput = Pick<TagCoach, 'name'>;

export type UpdateTagCoachInput = Partial<Pick<TagCoach, 'name'>> & { id: string };

export async function pageTagCoaches(params: { pageSize: number; current: number; name?: string }) {
  return pageModel<Prisma.TagCoachDelegate, TagCoach>(
    {
      model: prisma.tagCoach,
      params,
      where: {
        name: { contains: params.name },
      },
      include: {
        user: true,
        account: true,
      },
    },
    {
      withUser: true,
    },
  );
}

export async function createTagCoach(data: CreateTagCoachInput) {
  return createModel<Prisma.TagCoachDelegate, TagCoach>(
    {
      model: prisma.tagCoach,
      data,
    },
    {
      withUser: true,
    },
  );
}

export async function getTagCoachById(id: string) {
  return getModelById<Prisma.TagCoachDelegate, TagCoach>(
    {
      model: prisma.tagCoach,
      id,
      include: {
        user: true,
        account: true,
      },
    },
    {
      withUser: true,
    },
  );
}

// 更新 TagCoach
export async function updateTagCoach(data: UpdateTagCoachInput) {
  return updateModel<Prisma.TagCoachDelegate, TagCoach, UpdateTagCoachInput>(
    {
      model: prisma.tagCoach,
      data,
      where: {
        id: data.id,
      },
    },
    {
      withUser: true,
    },
  );
}

// 删除 TagCoach
export async function deleteTagCoach(id: string) {
  return deleteModel<Prisma.TagCoachDelegate>(
    {
      model: prisma.tagCoach,
      id,
    },
    {
      withUser: true,
    },
  );
}
