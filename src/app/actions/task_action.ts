'use server';

import { electronApi } from '@/electron';
import { Prisma, Task, TaskStatus } from '@/generated/prisma';
import { createModel, deleteModel, getModelById, pageModel, prisma, updateModel } from './helper';

export type CreateTaskInput = Pick<Task, 'accountId' | 'publishId'>;
export type UpdateTaskInput = Partial<
  Pick<Task, 'id' | 'status' | 'logs' | 'startAt' | 'endAt'>
> & {
  id: string;
};

export async function pageTasks(params: { pageSize: number; current: number }) {
  return pageModel<Prisma.TaskDelegate, Task>(
    {
      model: prisma.task,
      params,
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
  return getModelById<Prisma.TaskDelegate, Task>(
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

/** 发布任务 */
export async function publishTask(id: string) {
  // 获取信息
  const task = await getTaskById(id);

  // 检查任务状态
  if (task.status !== TaskStatus.PENDING) {
    throw new Error('任务正在发布中，请稍后再试');
  }

  // @ts-expect-error 先忽略
  const platform = task.account?.platform;
  // @ts-expect-error 先忽略
  const authInfo = task.account?.authInfo;
  // @ts-expect-error 先忽略
  const resourceOfVideo = task.publish?.resourceOfVideo;

  // 检查下参数
  if (!platform || !authInfo || !resourceOfVideo) {
    throw new Error('参数错误，请检查');
  }

  // 更新任务状态为 发布中
  updateTask({
    id: task.id,
    status: TaskStatus.PUBLISHING,
    startAt: new Date(),
  });

  // 发布
  const res = await electronApi.platformPublish({
    platform,
    authInfo,
    resourceOfVideo,
  });

  // 成功更新任务
  if (res.success) {
    updateTask({
      id: task.id,
      status: TaskStatus.SUCCESS,
      logs: JSON.stringify(res.data?.logs || []),
      endAt: new Date(),
    });
  }
  // 失败更新任务
  else {
    updateTask({
      id: task.id,
      status: TaskStatus.FAILED,
      logs: JSON.stringify(res.data?.logs || []),
      endAt: new Date(),
    });
  }
}
