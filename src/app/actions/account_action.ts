'use server';

import { Account } from '@/generated/prisma';
import { createModel, deleteModel, getModelById, needAuth, pageModel, updateModel } from './helper';

export type CreateAccountInput = Pick<Account, 'name' | 'type' | 'tagCoachId'>;

export type UpdateAccountInput = Partial<Pick<Account, 'name' | 'type' | 'tagCoachId'>> & {
  id: string;
};

export async function createAccount(data: CreateAccountInput) {
  const { sessionUser } = await needAuth();

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
  name?: string;
  type?: string;
  tagCoachId?: string;
}) {
  return pageModel<Account>({
    model: 'account',
    params,
    where: {
      name: { contains: params.name },
      type: params.type,
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
