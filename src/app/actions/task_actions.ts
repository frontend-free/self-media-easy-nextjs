'use server';

import { EnumPlatform } from '@/generated/enums';
import { Account, AccountStatus, Prisma, Publish, Task, TaskStatus } from '@/generated/prisma';
import {
  batchDeleteModel,
  createModel,
  deleteModel,
  getModelById,
  needAuth,
  pageModel,
  prisma,
  updateModel,
} from './helper';
import * as SubjectActions from './subject_actions';

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
  return pageModel<Prisma.TaskDelegate, TaskWithRelations>(
    {
      model: prisma.task,
      params,
      where: {
        status: params.status,
        account: {
          platform: params.account?.platform,
          platformName: { contains: params.account?.platformName },
          status: params.account?.status,
          deletedAt: params.account?.deletedAt,
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
    const task = (await getModelById<Prisma.TaskDelegate, Task>({
      model: prisma.task,
      id: result.id,
      include: {
        account: true,
      },
    })) as TaskWithRelations;
    // 如果有学员ID，则奖励
    if (task.account.studentId) {
      // 奖励学时 10分钟
      await SubjectActions.rewardsHours({
        accountId: task.account.id,
        studentId: task.account.studentId,
        type: 'video',
      });
    }
  }

  return result;
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

export async function batchDeleteTasks(ids: string[]) {
  return batchDeleteModel<Prisma.TaskDelegate>({
    model: prisma.task,
    ids,
  });
}

export async function stopTasksOfPending() {
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
}

// 获取今天账号发布成功的任务数量
export async function getTaskCountOfPublishByAccountId(accountId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.task.count({
    where: {
      accountId,
      status: TaskStatus.SUCCESS,
      endAt: {
        gte: today,
      },
    },
  });
}
