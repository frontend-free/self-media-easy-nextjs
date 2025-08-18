'use server';

import { Account, AccountStatus, Platform, Prisma } from '@/generated/prisma';
import {
  createModel,
  deleteModel,
  findFirstModel,
  getModelById,
  needAuth,
  pageModel,
  prisma,
  updateModel,
} from './helper';

export type CreateAccountInput = Pick<
  Account,
  | 'platform'
  | 'platformName'
  | 'platformAvatar'
  | 'platformId'
  | 'authInfo'
  | 'status'
  | 'authedAt'
  | 'logs'
>;

export type UpdateAccountInput = Partial<
  Pick<Account, 'platformName' | 'platformAvatar' | 'status' | 'authInfo' | 'authedAt' | 'logs'>
> & {
  id: string;
};

export async function pageAccounts(params: {
  pageSize: number;
  current: number;
  platformName?: string;
  platform?: Platform;
  status?: AccountStatus;
}) {
  return pageModel<Prisma.AccountDelegate, Account>(
    {
      model: prisma.account,
      params,
      where: {
        platformName: { contains: params.platformName },
        platform: params.platform,
        status: params.status,
      },
      orderBy: { authedAt: 'desc' },
    },
    {
      withUser: true,
    },
  );
}

export async function createAccount(data: CreateAccountInput) {
  const { sessionUser } = await needAuth();

  // 如果有 平台 id 则先检查是否存在
  if (data.platform && data.platformId) {
    const account = await findFirstModel<Prisma.AccountDelegate, Account>(
      {
        model: prisma.account,
        where: {
          platform: data.platform,
          platformId: data.platformId,
          userId: sessionUser.id,
        },
      },
      {
        withUser: true,
      },
    );

    // 存在则更新
    if (account) {
      const result = await updateAccount({
        id: account.id,
        ...data,
      });

      return result;
    }
  }

  // 不存在则创建
  const result = await createModel<Prisma.AccountDelegate, Account>(
    {
      model: prisma.account,
      data,
    },
    {
      withUser: true,
    },
  );

  return result;
}

export async function getAccountById(id: string) {
  return getModelById<Prisma.AccountDelegate, Account>(
    {
      model: prisma.account,
      id,
      include: {
        user: true,
      },
    },
    {
      withUser: true,
    },
  );
}

export async function updateAccount(data: UpdateAccountInput) {
  return updateModel<Prisma.AccountDelegate, Account, UpdateAccountInput>(
    {
      model: prisma.account,
      data,
    },
    {
      withUser: true,
    },
  );
}

export async function deleteAccount(id: string) {
  return deleteModel<Prisma.AccountDelegate>(
    {
      model: prisma.account,
      id,
    },
    {
      withUser: true,
    },
  );
}
