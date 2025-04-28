'use server';

import { User } from '@/generated/prisma';
import { createModel, deleteModel, getModelById, pageModel, updateModel } from './helper';

export type UserDetail = Omit<User, 'password'>;
export type CreateUserInput = Pick<User, 'name' | 'password'>;
export type UpdateUserInput = Partial<Omit<User, 'name' | 'createdAt' | 'updatedAt'>> & {
  id: string;
};

export async function createUser(data: CreateUserInput) {
  return createModel<CreateUserInput>({
    model: 'user',
    data: {
      ...data,
      // 默认密码
      password: '123456',
    },
  });
}

export async function pageUsers(params: { pageSize: number; current: number; name?: string }) {
  return pageModel<UserDetail>({
    model: 'user',
    params,
    where: { name: { contains: params.name } },
  });
}

export async function getUserById(id: string) {
  return getModelById<UserDetail>({ model: 'user', id });
}

export async function updateUser(data: UpdateUserInput) {
  return updateModel<UpdateUserInput>({ model: 'user', data });
}

export async function deleteUser(id: string) {
  return deleteModel({ model: 'user', id });
}
