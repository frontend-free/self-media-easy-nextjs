'use server';

import { Account } from '@/generated/prisma';
import { needAuth, pageModel, prisma } from './helper';

export type CreateAccountInput = Pick<Account, 'name' | 'type'> & {
  tagCoachId?: string;
};

export type UpdateAccountInput = Partial<Pick<Account, 'name' | 'type'>> & {
  tagCoachId?: string;
};

// 创建账号
export async function createAccount(data: CreateAccountInput) {
  const { sessionUser } = await needAuth();

  const account = await prisma.account.create({
    data: {
      ...data,
      userId: sessionUser.id,
    },
  });

  return account;
}

// 分页获取账号
export async function pageAccounts(params: {
  pageSize: number;
  current: number;
  name?: string;
  type?: string;
  tagCoachId?: string;
}) {
  return pageModel<Account, 'account'>({
    model: 'account',
    params,
    where: {
      name: { contains: params.name },
      type: params.type,
      tagCoachId: params.tagCoachId,
    },
  });
}

// 根据 ID 获取账号
export async function getAccountById(id: string) {
  return prisma.account.findUnique({
    where: { id },
    include: {
      user: true,
      tagCoach: true,
    },
  });
}

// 更新账号
export async function updateAccount(id: string, data: UpdateAccountInput) {
  const account = await prisma.account.update({
    where: { id },
    data,
  });
  return account;
}

// 删除账号
export async function deleteAccount(id: string) {
  await prisma.account.delete({
    where: { id },
  });
}
