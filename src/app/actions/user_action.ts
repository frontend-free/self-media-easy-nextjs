'use server';

import { Prisma, PrismaClient, User } from '@/generated/prisma';
import { omit } from 'lodash-es';
import { createModel, deleteModel, getModelById, pageModel, prisma, updateModel } from './helper';

export type UserDetail = Omit<User, 'password'>;
export type CreateUserInput = Pick<User, 'name' | 'password'>;
export type UpdateUserInput = Partial<
  Pick<User, 'password' | 'avatar' | 'mobile' | 'nickname' | 'isAdmin'>
> & { id: string; oldPassword?: string };

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

async function getUserPassword(id: string): Promise<string | undefined> {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user?.password;
}

export async function updateUser(data: UpdateUserInput) {
  // 如果包含密码，则校验密码
  if (data.password) {
    const pw = await getUserPassword(data.id);
    if (pw !== data.oldPassword) {
      throw new Error('旧密码错误');
    }
  }

  return updateModel<Prisma.UserDelegate, UserDetail, UpdateUserInput>({
    model: prisma.user,
    data: omit(data, 'oldPassword'),
  });
}

export async function deleteUser(id: string) {
  return deleteModel<Prisma.UserDelegate>({ model: prisma.user, id });
}
