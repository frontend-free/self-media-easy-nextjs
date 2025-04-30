'use server';

import { Account } from '@/generated/prisma';
import {
  createModel,
  deleteModel,
  getModelById,
  needAuth,
  pageModel,
  prisma,
  updateModel,
} from './helper';

export type CreateAccountInput = Omit<
  Account,
  'id' | 'userId' | 'tagCoachId' | 'createdAt' | 'updatedAt'
>;

export type UpdateAccountInput = Partial<
  Pick<Account, 'platformName' | 'platformAvatar' | 'status' | 'authInfo' | 'authedAt'>
> & {
  id: string;
};

export async function createAccount(data: CreateAccountInput) {
  const { sessionUser } = await needAuth();

  // 如果有 平台 id 则先检查是否存在
  if (data.platform && data.platformId) {
    const account = await prisma.account.findFirst({
      where: {
        platform: data.platform,
        platformId: data.platformId,
        userId: sessionUser.id,
      },
    });

    // 存在则更新
    if (account) {
      return await updateAccount({
        id: account.id,
        ...data,
      });
    }
  }

  // 不存在则创建
  return createModel<Account, CreateAccountInput & { userId: string }>({
    model: prisma.account,
    data: {
      ...data,
      userId: sessionUser.id,
    },
  });
}

export async function pageAccounts(params: {
  pageSize: number;
  current: number;
  platformName?: string;
  platform?: string;
  tagCoachId?: string;
}) {
  const { sessionUser } = await needAuth();

  return pageModel<Account>({
    model: prisma.account,
    params,
    where: {
      platformName: { contains: params.platformName },
      platform: params.platform,
      tagCoachId: params.tagCoachId,
      userId: sessionUser.id,
    },
    include: {
      tagCoach: true,
    },
  });
}

export async function getAccountById(id: string) {
  const { sessionUser } = await needAuth();

  return getModelById<Account>({
    model: prisma.account,
    id,
    where: {
      userId: sessionUser.id,
    },
    include: {
      user: true,
      tagCoach: true,
    },
  });
}

export async function updateAccount(data: UpdateAccountInput) {
  const { sessionUser } = await needAuth();

  return updateModel<UpdateAccountInput>({
    model: prisma.account,
    data,
    where: {
      userId: sessionUser.id,
    },
  });
}

export async function deleteAccount(id: string) {
  const { sessionUser } = await needAuth();

  return deleteModel({
    model: prisma.account,
    id,
    where: {
      userId: sessionUser.id,
    },
  });
}
