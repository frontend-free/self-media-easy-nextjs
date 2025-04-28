'use server';

import { PrismaClient, User } from '@/generated/prisma';
import { revalidatePath } from 'next/cache';
import { pageModel } from './helper';

const prisma = new PrismaClient();

export type CreateUserInput = Pick<User, 'name' | 'password'>;
export type UpdateUserInput = Partial<Pick<User, 'name' | 'password'>>;

export async function createUser(data: CreateUserInput) {
  const user = await prisma.user.create({
    data: {
      ...data,
      // 默认密码
      password: '123456',
    },
  });
  revalidatePath('/admin/users');
  return user;
}

// 分页获取用户
export async function pageUsers(params: { pageSize: number; current: number; name?: string }) {
  return pageModel<User, 'user'>({
    model: 'user',
    params,
    where: { name: { contains: params.name } },
  });
}

// 根据 ID 获取用户
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// 更新用户
export async function updateUser(id: string, data: UpdateUserInput) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// 删除用户
export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  });
  revalidatePath('/admin/users');
}
