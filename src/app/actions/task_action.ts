'use server';

import { electronApi } from '@/electron';
import { Task, TaskStatus } from '@/generated/prisma';
import {
  createModel,
  deleteModel,
  getModelById,
  needAuth,
  pageModel,
  prisma,
  updateModel,
} from './helper';

export type CreateTaskInput = Pick<Task, 'accountId' | 'publishId'>;
export type UpdateTaskInput = Partial<
  Pick<Task, 'id' | 'status' | 'logs' | 'startAt' | 'endAt'>
> & {
  id: string;
};

// 创建任务
export async function createTasksForPublish(data: CreateTaskInput) {
  const { sessionUser } = await needAuth();

  return createModel<Task, CreateTaskInput & { userId: string }>({
    model: prisma.task,
    data: {
      ...data,
      userId: sessionUser.id,
    },
  });
}

export async function pageTasks(params: { pageSize: number; current: number }) {
  const { sessionUser } = await needAuth();

  return pageModel<Task>({
    model: prisma.task,
    params,
    where: {
      userId: sessionUser.id,
    },
    include: {
      account: true,
      publish: true,
    },
  });
}

export async function deleteTask(id: string) {
  const { sessionUser } = await needAuth();

  return deleteModel({
    model: prisma.task,
    id,
    where: {
      userId: sessionUser.id,
    },
  });
}

export async function getTaskById(id: string) {
  const { sessionUser } = await needAuth();

  return getModelById<Task>({
    model: prisma.task,
    id,
    where: {
      userId: sessionUser.id,
    },
    include: {
      account: true,
      publish: true,
    },
  });
}

export async function updateTask(data: UpdateTaskInput) {
  const { sessionUser } = await needAuth();

  return updateModel({
    model: prisma.task,
    data,
    where: {
      id: data.id,
      userId: sessionUser.id,
    },
  });
}

/** 发布任务 */
export async function publishTask(
  id: string,
  options?: {
    /** 强制发布 */
    force?: boolean;
  },
) {
  // 获取信息
  const task = await getTaskById(id);

  // 如果非强制发布，则检查任务状态
  if (!options?.force) {
    // 检查任务状态
    if (task.status !== TaskStatus.PENDING) {
      throw new Error('任务正在发布中，请稍后再试');
    }
  }

  // 更新任务状态
  updateTask({
    id: task.id,
    status: TaskStatus.PUBLISHING,
    startAt: new Date(),
  });

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
