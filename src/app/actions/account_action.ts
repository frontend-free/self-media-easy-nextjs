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
  | 'tagCoachId'
>;

export type UpdateAccountInput = Partial<
  Pick<Account, 'platformName' | 'platformAvatar' | 'status' | 'authInfo' | 'authedAt'>
> & {
  id: string;
};

export async function pageAccounts(params: {
  pageSize: number;
  current: number;
  platformName?: string;
  platform?: Platform;
  status?: AccountStatus;
  tagCoachId?: string;
}) {
  return pageModel<Prisma.AccountDelegate, Account>(
    {
      model: prisma.account,
      params,
      where: {
        platformName: { contains: params.platformName },
        platform: params.platform,
        status: params.status,
        tagCoachId: params.tagCoachId,
      },
      include: {
        tagCoach: true,
      },
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
      return await updateAccount({
        id: account.id,
        ...data,
      });
    }
  }

  // 不存在则创建
  return createModel<Prisma.AccountDelegate, Account>(
    {
      model: prisma.account,
      data,
    },
    {
      withUser: true,
    },
  );
}

export async function getAccountById(id: string) {
  return getModelById<Prisma.AccountDelegate, Account>(
    {
      model: prisma.account,
      id,
      include: {
        user: true,
        tagCoach: true,
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
