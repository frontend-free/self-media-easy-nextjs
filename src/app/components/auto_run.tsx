'use client';

import { electronApi, EnumPlatformPublishCode } from '@/electron';
import { AccountStatus, TaskStatus } from '@/generated/prisma';
import { App } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import * as AccountAction from '../actions/account_action';
import * as TaskAction from '../actions/task_action';

const maxRunCount = 2;
let runningTaskIds: string[] = [];
const interval = 5 * 1000;

async function publishTask({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const task = await TaskAction.getTaskById(id);

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

  // 更新任务状态
  await TaskAction.updateTask({
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

  console.log('publishTask res', res);

  // 成功更新任务
  if (res.success) {
    await TaskAction.updateTask({
      id: task.id,
      status: TaskStatus.SUCCESS,
      logs: JSON.stringify(res.data?.logs || []),
      endAt: new Date(),
    });

    onSuccess?.();
  }
  // 失败更新任务
  else {
    // 授权信息错误
    if (res.data?.code === EnumPlatformPublishCode.ERROR_AUTH_INFO_INVALID) {
      // 更新账号状态
      await AccountAction.updateAccount({
        id: task.accountId,
        status: AccountStatus.INVALID,
      });
    }

    // 更新任务状态
    await TaskAction.updateTask({
      id: task.id,
      status: TaskStatus.FAILED,
      logs: JSON.stringify(res.data?.logs || []),
      endAt: new Date(),
    });

    onError?.();
  }
}

// 初始化自动运行任务
function AutoRunComponent() {
  const [count, setCount] = useState(0);
  const { notification } = App.useApp();

  const doPublishTask = useCallback(
    async (task) => {
      const resourceName = task.publish?.resourceOfVideo.split('/').pop();
      const accountName = task.account?.platformName;

      notification.info({
        message: `自动运行任务 ${accountName} - ${resourceName}`,
      });

      await publishTask({
        id: task.id,
        onSuccess: () => {
          notification.success({
            message: `自动运行任务 ${accountName} - ${resourceName} 成功`,
          });
        },
        onError: () => {
          notification.error({
            message: `自动运行任务 ${accountName} - ${resourceName} 失败`,
          });
        },
      });
    },
    [notification],
  );

  const autoRunTask = useCallback(async () => {
    // 5s 检查是否有任务需要运行
    setInterval(async () => {
      console.log('autoRunTask', maxRunCount, runningTaskIds);

      if (runningTaskIds.length >= maxRunCount) {
        return;
      }

      const waitTasks = await TaskAction.pageTasks({
        current: 1,
        pageSize: 100,
        status: TaskStatus.PENDING,
      });

      setCount(waitTasks.data.length);

      for (const task of waitTasks.data) {
        runningTaskIds.push(task.id);

        // 运行，只会成功
        await doPublishTask(task);

        runningTaskIds = runningTaskIds.filter((id) => id !== task.id);

        // 刷新列表数据
        // @ts-expect-error 先忽略
        window._refreshTask?.();
      }
    }, interval);
  }, [doPublishTask]);

  useEffect(() => {
    autoRunTask();
  }, []);

  return (
    <div className="text-white w-[20px] h-[20px] absolute right-0 top-0 bg-red-500 rounded-full flex items-center justify-center overflow-hidden">
      {count > 99 ? '99+' : count}
    </div>
  );
}

export { AutoRunComponent, publishTask };
