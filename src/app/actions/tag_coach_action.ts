'use server';

import { auth } from '@/auth';
import { PrismaClient, TagCoach } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';
import { pageModel } from './helper';

const prisma = new PrismaClient();

export type CreateTagCoachInput = Pick<TagCoach, 'name'>;

export type UpdateTagCoachInput = Partial<Pick<TagCoach, 'name'>>;

// 创建 TagCoach
export async function createTagCoach(data: CreateTagCoachInput) {
  const session = await auth();

  const tagCoach = await prisma.tagCoach.create({
    data: {
      ...data,
      userId: session?.user?.id || '',
    },
  });

  revalidatePath('/tag-coach');
  return tagCoach;
}

// 分页获取 TagCoach
export async function pageTagCoaches(params: { pageSize: number; current: number; name?: string }) {
  return pageModel<TagCoach, 'tagCoach'>({
    model: 'tagCoach',
    params,
    where: { name: { contains: params.name } },
  });
}

// 根据 ID 获取 TagCoach
export async function getTagCoachById(id: string) {
  return prisma.tagCoach.findUnique({
    where: { id },
    include: {
      user: true,
      Account: true,
    },
  });
}

// 更新 TagCoach
export async function updateTagCoach(id: string, data: UpdateTagCoachInput) {
  const tagCoach = await prisma.tagCoach.update({
    where: { id },
    data,
  });
  revalidatePath('/tag-coach');
  return tagCoach;
}

// 删除 TagCoach
export async function deleteTagCoach(id: string) {
  await prisma.tagCoach.delete({
    where: { id },
  });
  revalidatePath('/tag-coach');
}
