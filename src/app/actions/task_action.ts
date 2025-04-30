'use server';

import { Task } from '@/generated/prisma';
import { createModel, deleteModel, needAuth, pageModel } from './helper';

export type CreateTaskInput = Pick<Task, 'accountId' | 'publishId'>;

// 创建任务
export async function createTasksForPublish(data: CreateTaskInput) {
  const { sessionUser } = await needAuth();

  return createModel<Task, CreateTaskInput & { userId: string }>({
    model: 'task',
    data: {
      ...data,
      userId: sessionUser.id,
    },
  });
}

export async function pageTasks(params: { pageSize: number; current: number }) {
  const { sessionUser } = await needAuth();

  return pageModel<Task>({
    model: 'task',
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
    model: 'task',
    id,
    where: {
      userId: sessionUser.id,
    },
  });
}
