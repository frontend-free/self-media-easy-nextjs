'use client';

import { electronApi, EnumPlatformPublishCode } from '@/electron';
import { valueEnumPlatform } from '@/generated/enums';
import { AccountStatus, TaskStatus } from '@/generated/prisma';
import { App, Result } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import * as AccountAction from '../actions/account_action';
import * as TaskAction from '../actions/task_action';
import { useIsDebug } from './debug';

const maxRunCount = 1;
let runningTaskIds: string[] = [];
const INTERVAL = 10 * 1000;

async function publishTask({
  id,
  onSuccess,
  onError,
  isDebug,
}: {
  id: string;
  onSuccess?: () => void;
  onError?: () => void;
  isDebug?: boolean;
}) {
  const task = await TaskAction.getTaskById(id);

  const platform = task.account?.platform;
  const authInfo = task.account?.authInfo;
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
    title: task.publish?.title || undefined,
    description: task.publish?.description || undefined,
    publishType: task.publish?.publishType || undefined,
    isDebug,
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
      // 可能账号被删除，try catch 下
      try {
        // 更新账号状态
        await AccountAction.updateAccount({
          id: task.accountId,
          status: AccountStatus.INVALID,
        });
      } catch (error) {
        console.error('更新账号状态失败', error);
      }
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
  const { isDebug } = useIsDebug();

  const doPublishTask = useCallback(
    async (task) => {
      const itemNode = (
        <div>
          <div>
            {valueEnumPlatform[task.account?.platform]?.text} {task.account?.platformName}
          </div>
          <div>{task.publish?.title}</div>
          <div>{task.publish?.resourceOfVideo.split('/').pop()}</div>
        </div>
      );

      const key = task.id;

      notification.info({
        key,
        message: (
          <div>
            <div>自动运行任务中</div>
            {itemNode}
          </div>
        ),
        duration: 0,
      });

      await publishTask({
        id: task.id,
        isDebug,
        onSuccess: () => {
          notification.success({
            key,
            message: (
              <div>
                <div>自动运行任务-成功</div>
                {itemNode}
                <Result status="success" />
              </div>
            ),
            duration: 4.5,
          });
        },
        onError: () => {
          notification.error({
            key,
            message: (
              <div>
                <div>自动运行任务-失败</div>
                {itemNode}
                <Result status="error" />
              </div>
            ),
            duration: 4.5,
          });
        },
      });
    },
    [notification],
  );

  const autoRunTask = useCallback(() => {
    // 5s 检查是否有任务需要运行
    return setInterval(async () => {
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
    }, INTERVAL);
  }, [doPublishTask]);

  useEffect(() => {
    // 桌面端才自动运行
    if (!electronApi.isElectron()) {
      return;
    }

    const timer = autoRunTask() as any;
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="text-white min-w-[20px] h-[20px] bg-red-500 rounded-full flex items-center justify-center overflow-hidden px-2">
      {count > 99 ? '99+' : count} 待发布
    </div>
  );
}

export { AutoRunComponent, publishTask };
