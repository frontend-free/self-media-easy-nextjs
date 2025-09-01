'use server';

import { EnumPlatform } from '@/generated/enums';
import { Account, AccountStatus, Prisma, Publish, Task, TaskStatus } from '@/generated/prisma';
import {
  createModel,
  deleteModel,
  getModelById,
  needAuth,
  pageModel,
  prisma,
  updateModel,
  wrapServerAction,
} from './helper';

export type CreateTaskInput = Pick<Task, 'accountId' | 'publishId'>;
export type UpdateTaskInput = Partial<
  Pick<Task, 'id' | 'status' | 'remark' | 'logs' | 'startAt' | 'endAt'>
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
    status?: AccountStatus;
    deletedAt?: Date | null;
  };
  publish?: {
    title?: string;
  };
  status?: TaskStatus;
}) {
  return wrapServerAction(async () => {
    return pageModel<Prisma.TaskDelegate, TaskWithRelations>(
      {
        model: prisma.task,
        params,
        where: {
          status: params.status,
          account: {
            platform: params.account?.platform,
            platformName: {
              // 避免 空字符串 没法匹配
              contains: params.account?.platformName || undefined,
            },
            status: params.account?.status,
            deletedAt: params.account?.deletedAt,
          },
          publish: {
            title: { contains: params.publish?.title || undefined },
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
  });
}

export async function _createTasksForPublish(data: CreateTaskInput) {
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
  return wrapServerAction(async () => {
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
  });
}

export async function updateTask(data: UpdateTaskInput) {
  return wrapServerAction(async () => {
    const result = await updateModel<Prisma.TaskDelegate, Task, UpdateTaskInput>(
      {
        model: prisma.task,
        data,
        include: {
          account: true,
        },
      },
      {
        withUser: true,
      },
    );

    // 发布成功奖励学时
    if (data.status === TaskStatus.SUCCESS) {
      (await getModelById<Prisma.TaskDelegate, Task>({
        model: prisma.task,
        id: result.id,
        include: {
          account: true,
        },
      })) as TaskWithRelations;
    }

    return result;
  });
}

export async function deleteTask(id: string) {
  return wrapServerAction(async () => {
    return deleteModel<Prisma.TaskDelegate>(
      {
        model: prisma.task,
        id,
      },
      {
        withUser: true,
      },
    );
  });
}

export async function stopTasksOfPending() {
  return wrapServerAction(async () => {
    throw new Error('test');
    const { sessionUser } = await needAuth();

    const tasks = await prisma.task.findMany({
      where: {
        status: TaskStatus.PENDING,
        userId: sessionUser.id,
        deletedAt: null,
      },
    });

    if (tasks.length === 0) {
      return;
    }

    await prisma.task.updateMany({
      where: {
        id: { in: tasks.map((task) => task.id) },
      },
      data: {
        status: TaskStatus.CANCELLED,
      },
    });
  });
}
