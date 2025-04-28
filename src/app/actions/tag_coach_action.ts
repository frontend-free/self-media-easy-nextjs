'use server';

import { TagCoach } from '@/generated/prisma';
import { needAuth, pageModel, prisma } from './helper';

export type CreateTagCoachInput = Pick<TagCoach, 'name'>;

export type UpdateTagCoachInput = Partial<Pick<TagCoach, 'name'>>;

// 创建 TagCoach
export async function createTagCoach(data: CreateTagCoachInput) {
  const { sessionUser } = await needAuth();

  const tagCoach = await prisma.tagCoach.create({
    data: {
      ...data,
      userId: sessionUser.id,
    },
  });

  return tagCoach;
}

// 分页获取 TagCoach
export async function pageTagCoaches(params: { pageSize: number; current: number; name?: string }) {
  const { sessionUser } = await needAuth();

  return pageModel<TagCoach>('tagCoach', {
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

// 根据 ID 获取 TagCoach
export async function getTagCoachById(id: string) {
  const { sessionUser } = await needAuth();

  return prisma.tagCoach.findUnique({
    where: { id, userId: sessionUser.id },
    include: {
      user: true,
      account: true,
    },
  });
}

// 更新 TagCoach
export async function updateTagCoach(id: string, data: UpdateTagCoachInput) {
  const { sessionUser } = await needAuth();

  const tagCoach = await prisma.tagCoach.update({
    where: { id, userId: sessionUser.id },
    data,
  });
  return tagCoach;
}

// 删除 TagCoach
export async function deleteTagCoach(id: string) {
  const { sessionUser } = await needAuth();

  await prisma.tagCoach.delete({
    where: { id, userId: sessionUser.id },
  });
}
