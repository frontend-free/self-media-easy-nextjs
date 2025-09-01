'use server';

import { Prisma, PrismaClient, User } from '@/generated/prisma';
import {
  createModel,
  deleteModel,
  getModelById,
  pageModel,
  prisma,
  updateModel,
  wrapServerAction,
} from './helper';

export type UserDetail = Omit<User, 'password'>;
export type CreateUserInput = Pick<User, 'name' | 'password' | 'remark'>;
export type UpdateUserInput = Partial<
  Pick<User, 'password' | 'avatar' | 'mobile' | 'nickname' | 'isAdmin' | 'remark'>
> & { id: string; oldPassword?: string };

async function getUserPassword(id: string): Promise<string | undefined> {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user?.password;
}

export async function pageUsers(params: {
  pageSize: number;
  current: number;
  name?: string;
  nickname?: string;
  mobile?: string;
}) {
  return wrapServerAction(async () => {
    return pageModel<Prisma.UserDelegate, UserDetail>({
      model: prisma.user,
      params,
      where: {
        name: { contains: params.name },
        nickname: { contains: params.nickname },
        mobile: { contains: params.mobile },
      },
    });
  });
}

export async function createUser(data: CreateUserInput) {
  return wrapServerAction(async () => {
    return createModel<Prisma.UserDelegate, UserDetail>({
      model: prisma.user,
      data: {
        ...data,
        password: data.password,
      },
    });
  });
}

export async function getUserById(id: string) {
  return wrapServerAction(async () => {
    return getModelById<Prisma.UserDelegate, UserDetail>({ model: prisma.user, id });
  });
}

export async function updateUser(data: UpdateUserInput) {
  return wrapServerAction(async () => {
    // 如果包含密码，则校验密码
    if (data.password) {
      const pw = await getUserPassword(data.id);
      if (pw !== data.oldPassword) {
        throw new Error('旧密码错误');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { oldPassword, ...newData } = data;

    return updateModel<Prisma.UserDelegate, UserDetail, UpdateUserInput>({
      model: prisma.user,
      data: newData,
    });
  });
}

export async function deleteUser(id: string) {
  return wrapServerAction(async () => {
    return deleteModel<Prisma.UserDelegate>({ model: prisma.user, id });
  });
}
