'use server';

import { Prisma, User } from '@/generated/prisma';
import { createModel, deleteModel, getModelById, pageModel, prisma, updateModel } from './helper';

export type UserDetail = Omit<User, 'password'>;
export type CreateUserInput = Pick<User, 'name' | 'password'>;
export type UpdateUserInput = Partial<
  Pick<User, 'password' | 'avatar' | 'mobile' | 'nickname' | 'isAdmin'>
> & { id: string };

export async function pageUsers(params: {
  pageSize: number;
  current: number;
  name?: string;
  nickname?: string;
  mobile?: string;
}) {
  return pageModel<Prisma.UserDelegate, UserDetail>({
    model: prisma.user,
    params,
    where: {
      name: { contains: params.name },
      nickname: { contains: params.nickname },
      mobile: { contains: params.mobile },
    },
  });
}

export async function createUser(data: CreateUserInput) {
  return createModel<Prisma.UserDelegate, UserDetail>({
    model: prisma.user,
    data: {
      ...data,
      // 默认密码
      password: '123456',
    },
  });
}

export async function getUserById(id: string) {
  return getModelById<Prisma.UserDelegate, UserDetail>({ model: prisma.user, id });
}

export async function updateUser(data: UpdateUserInput) {
  return updateModel<Prisma.UserDelegate, UserDetail, UpdateUserInput>({
    model: prisma.user,
    data,
  });
}

export async function deleteUser(id: string) {
  return deleteModel<Prisma.UserDelegate>({ model: prisma.user, id });
}
