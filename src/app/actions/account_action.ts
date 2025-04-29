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
  console.log('createAccount', data);

  const { sessionUser } = await needAuth();

  // 如果有 平台 id 则先检查是否存在
  if (data.platform && data.platformId) {
    let account = await prisma.account.findFirst({
      where: {
        platform: data.platform,
        platformId: data.platformId,
      },
    });

    console.log('createAccount exist', account);

    // 存在则更新
    if (account) {
      account = await prisma.account.update({
        where: { id: account.id },
        data: {
          ...data,
          userId: sessionUser.id,
        },
      });

      return account;
    }
  }

  // 不存在则创建
  return createModel<CreateAccountInput & { userId: string }>({
    model: 'account',
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
  return pageModel<Account>({
    model: 'account',
    params,
    where: {
      platformName: { contains: params.platformName },
      platform: params.platform,
      tagCoachId: params.tagCoachId,
    },
    include: {
      tagCoach: true,
    },
  });
}

export async function getAccountById(id: string) {
  return getModelById<Account>({
    model: 'account',
    id,
    include: {
      user: true,
      tagCoach: true,
    },
  });
}

export async function updateAccount(data: UpdateAccountInput) {
  return updateModel<UpdateAccountInput>({
    model: 'account',
    data,
  });
}

export async function deleteAccount(id: string) {
  return deleteModel({
    model: 'account',
    id,
  });
}
