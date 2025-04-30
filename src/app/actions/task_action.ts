import { Task } from '@/generated/prisma';
import { createModel, needAuth } from './helper';

export type CreateTaskInput = Pick<Task, 'accountId' | 'publishId'>;

// 创建任务
export async function createTasksForPublish(data: CreateTaskInput) {
  const { sessionUser } = await needAuth();

  return createModel<CreateTaskInput & { userId: string }>({
    model: 'task',
    data: {
      ...data,
      userId: sessionUser.id,
    },
  });
}
