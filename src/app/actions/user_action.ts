'use server';

import { User } from '@/generated/prisma';
import { createModel, deleteModel, getModelById, pageModel, prisma, updateModel } from './helper';

export type UserDetail = Omit<User, 'password'>;
export type CreateUserInput = Pick<User, 'name' | 'password'>;
export type UpdateUserInput = Partial<Omit<User, 'name' | 'createdAt' | 'updatedAt'>> & {
  id: string;
};

export async function createUser(data: CreateUserInput) {
  return createModel<User, CreateUserInput>({
    model: prisma.user,
    data: {
      ...data,
      // 默认密码
      password: '123456',
    },
  });
}

export async function pageUsers(params: { pageSize: number; current: number; name?: string }) {
  return pageModel<UserDetail>({
    model: prisma.user,
    params,
    where: { name: { contains: params.name } },
  });
}

export async function getUserById(id: string) {
  return getModelById<UserDetail>({ model: prisma.user, id });
}

export async function updateUser(data: UpdateUserInput) {
  return updateModel<UpdateUserInput>({ model: prisma.user, data });
}

export async function deleteUser(id: string) {
  return deleteModel({ model: prisma.user, id });
}
