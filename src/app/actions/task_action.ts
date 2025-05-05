'use server';

import { Prisma, Task, TaskStatus } from '@/generated/prisma';
import { createModel, deleteModel, getModelById, pageModel, prisma, updateModel } from './helper';

export type CreateTaskInput = Pick<Task, 'accountId' | 'publishId'>;
export type UpdateTaskInput = Partial<
  Pick<Task, 'id' | 'status' | 'logs' | 'startAt' | 'endAt'>
> & {
  id: string;
};

export async function pageTasks(params: {
  pageSize: number;
  current: number;
  status?: TaskStatus;
}) {
  return pageModel<Prisma.TaskDelegate, Task>(
    {
      model: prisma.task,
      params,
      where: { status: params.status },
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
