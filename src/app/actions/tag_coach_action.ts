'use server';

import { PrismaClient, TagCoach } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export type CreateTagCoachInput = Pick<TagCoach, 'name' | 'avatar' | 'userId'>;

export type UpdateTagCoachInput = Partial<Pick<TagCoach, 'name' | 'avatar'>>;

// 创建 TagCoach
export async function createTagCoach(data: CreateTagCoachInput) {
  const tagCoach = await prisma.tagCoach.create({
    data,
  });
  revalidatePath('/');
  return tagCoach;
}

// 获取所有 TagCoach
export async function getTagCoaches() {
  return prisma.tagCoach.findMany({
    include: {
      user: true,
      Account: true,
    },
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
  revalidatePath('/');
  return tagCoach;
}

// 删除 TagCoach
export async function deleteTagCoach(id: string) {
  await prisma.tagCoach.delete({
    where: { id },
  });
  revalidatePath('/');
}

// 根据用户 ID 获取 TagCoach
export async function getTagCoachesByUserId(userId: string) {
  return prisma.tagCoach.findMany({
    where: { userId },
    include: {
      Account: true,
    },
  });
}
