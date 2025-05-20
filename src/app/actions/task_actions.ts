'use server';

import { EnumPlatform } from '@/generated/enums';
import { Account, Prisma, Publish, Task, TaskStatus } from '@/generated/prisma';
import { createModel, deleteModel, getModelById, pageModel, prisma, updateModel } from './helper';

export type CreateTaskInput = Pick<Task, 'accountId' | 'publishId'>;
export type UpdateTaskInput = Partial<
  Pick<Task, 'id' | 'status' | 'logs' | 'startAt' | 'endAt'>
> & {
  id: string;
};

// 定义包含关联数据的 Task 类型
export type TaskWithRelations = Task & {
  account: Account;
  publish: Publish;
};

export async function pageTasks(params: {
  pageSize: number;
  current: number;
  account?: {
    platform?: EnumPlatform;
    platformName?: string;
  };
  publish?: {
    title?: string;
  };
  status?: TaskStatus;
}) {
  return pageModel<Prisma.TaskDelegate, TaskWithRelations>(
    {
      model: prisma.task,
      params,
      where: {
        status: params.status,
        account: {
          platform: params.account?.platform,
          platformName: { contains: params.account?.platformName },
        },
        publish: {
          title: { contains: params.publish?.title },
        },
      },
      include: {
        account: true,
        publish: true,
      },
    },
    {
      withUser: true,
    },
  );
}

export async function createTasksForPublish(data: CreateTaskInput) {
  return createModel<Prisma.TaskDelegate, Task>(
    {
      model: prisma.task,
      data,
    },
    {
      withUser: true,
    },
  );
}

export async function getTaskById(id: string) {
  return getModelById<Prisma.TaskDelegate, TaskWithRelations>(
    {
      model: prisma.task,
      id,
      include: {
        account: true,
        publish: true,
      },
    },
    {
      withUser: true,
    },
  );
}

export async function updateTask(data: UpdateTaskInput) {
  return updateModel<Prisma.TaskDelegate, Task, UpdateTaskInput>(
    {
      model: prisma.task,
      data,
    },
    {
      withUser: true,
    },
  );
}

export async function deleteTask(id: string) {
  return deleteModel<Prisma.TaskDelegate>(
    {
      model: prisma.task,
      id,
    },
    {
      withUser: true,
    },
  );
}
