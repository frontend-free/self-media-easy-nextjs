'use client';

import * as AccountActions from '@/app/actions/account_actions';
import * as TaskActions from '@/app/actions/task_actions';
import { useIsDebug } from '@/components/debug';
import { electronApi, EnumCode } from '@/electron';
import { valueEnumPlatform } from '@/generated/enums';
import { AccountStatus, TaskStatus } from '@/generated/prisma';
import { handleRequestRes } from '@/lib/request';
import { SyncOutlined } from '@ant-design/icons';
import { App, Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { globalEventKey } from '../config';

const maxRunCount = 1;
const INTERVAL = 10 * 1000;
let runningTaskIds: string[] = [];

async function updateTask(data: TaskActions.UpdateTaskInput) {
  // 异步了，可能任务已删除，try catch 下
  try {
    // 更新任务状态
    handleRequestRes(await TaskActions.updateTask(data));
  } catch (error) {
    console.error('更新任务状态失败', error);
  }
}

async function updateAccount(data: AccountActions.UpdateAccountInput) {
  // 异步了，可能账号已删除，try catch 下
  try {
    // 更新账号状态
    handleRequestRes(await AccountActions.updateAccount(data));
  } catch (error) {
    console.error('更新账号状态失败', error);
  }
}

async function runAutoTask({
  id,
  onSuccess,
  onError,
  isDebug,
}: {
  id: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  isDebug?: boolean;
}) {
  // 获取任务
  const taskRes = await TaskActions.getTaskById(id);
  handleRequestRes(taskRes);

  const task = taskRes.data!;
  console.log('runAutoTask task', id, task);

  const platform = task.account?.platform;
  const authInfo = task.account?.authInfo;
  const resourceOfVideo = task.publish?.resourceOfVideo;

  let error = '';
  // 账号已删除
  if (task.account.deletedAt) {
    error = '账号已删除';
  }
  // 账号未授权
  else if (task.account.status !== AccountStatus.AUTHED) {
    error = '账号未授权';
  }
  // 检查下参数
  else if (!platform || !authInfo || !resourceOfVideo) {
    error = '参数错误，请检查';
  }

  // 有错误
  if (error) {
    // 更新任务状态 - CANCELLED
    await updateTask({
      id: task.id,
      status: TaskStatus.CANCELLED,
      remark: error,
      logs: JSON.stringify([error]),
    });

    // 反馈回去
    onError?.(new Error(error));

    // 结束了
    return;
  }

  // 没有错误

  // 更新状态 - PUBLISHING
  await updateTask({
    id: task.id,
    status: TaskStatus.PUBLISHING,
    remark: '',
    startAt: new Date(),
  });

  // 发布
  const res = await electronApi.platformPublish({
    platform,
    authInfo: authInfo!,
    resourceOfVideo: resourceOfVideo!,
    title: task.publish?.title || undefined,
    description: task.publish?.description || undefined,
    publishType: task.publish?.publishType || undefined,
    isDebug,
  });

  console.log('runAutoTask res', res);

  // 成功
  if (res.success) {
    // 更新任务状态 - SUCCESS
    await updateTask({
      id: task.id,
      status: TaskStatus.SUCCESS,
      logs: JSON.stringify(res.data?.logs || []),
      endAt: new Date(),
    });

    // 反馈回去
    onSuccess?.();
  }
  // 失败
  else {
    // 授权信息失效
    if (res.data?.code === EnumCode.ERROR_AUTH_INFO_INVALID) {
      // 更新账号状态 - INVALID
      await updateAccount({
        id: task.accountId,
        status: AccountStatus.INVALID,
      });

      // 更新任务状态 - FAILED
      await updateTask({
        id: task.id,
        status: TaskStatus.FAILED,
        remark: '账号授权失效',
        logs: JSON.stringify(res.data?.logs || []),
        endAt: new Date(),
      });
    } else {
      // 更新任务状态 - FAILED
      await updateTask({
        id: task.id,
        status: TaskStatus.FAILED,
        remark: '请查看日志',
        logs: JSON.stringify(res.data?.logs || []),
        endAt: new Date(),
      });
    }

    onError?.(new Error('发布失败'));
  }
}

function useRunAutoTaskWithUI({ isDebug }: { isDebug?: boolean }) {
  const { notification } = App.useApp();

  const runTask = useCallback(
    async (id: string) => {
      // 获取数据
      const taskRes = await TaskActions.getTaskById(id);
      handleRequestRes(taskRes);
      const task = taskRes.data!;

      const key = task.id;
      const itemNode = (
        <div>
          {valueEnumPlatform[task.account?.platform]?.text} {task.account?.platformName}
        </div>
      );

      notification.info({
        key,
        message: (
          <div>
            <div>任务运行中</div>
            {itemNode}
          </div>
        ),
        duration: 0,
      });

      await runAutoTask({
        id: task.id,
        isDebug,
        onSuccess: () => {
          notification.success({
            key,
            message: (
              <div>
                <div>任务运行成功</div>
                {itemNode}
              </div>
            ),
            duration: 4.5,
          });

          window.dispatchEvent(new Event(globalEventKey.REFRESH_TASK));
          window.dispatchEvent(new Event(globalEventKey.REFRESH_PUBLISH));
        },
        onError: (error) => {
          notification.error({
            key,
            message: (
              <div>
                <div>任务运行失败</div>
                <div>{error.message}</div>
                {itemNode}
              </div>
            ),
            duration: 4.5,
          });

          window.dispatchEvent(new Event(globalEventKey.REFRESH_TASK));
          window.dispatchEvent(new Event(globalEventKey.REFRESH_PUBLISH));
        },
      });
    },
    [notification, isDebug],
  );

  return {
    runTask,
  };
}

// 初始化自动运行任务
function AutoRunTaskComponent() {
  const [count, setCount] = useState(0);
  const { isDebug } = useIsDebug();

  const { runTask } = useRunAutoTaskWithUI({ isDebug });

  const autoRunTask = useCallback(async () => {
    // 检查是否有任务需要运行
    console.log('autoRunTask', maxRunCount, runningTaskIds);
    if (runningTaskIds.length >= maxRunCount) {
      return;
    }

    // 获取任务列表
    const tasksRes = await TaskActions.pageTasks({
      current: 1,
      pageSize: 10,
      status: TaskStatus.PENDING,
      // 账号没删除的
      account: {
        deletedAt: null,
        status: AccountStatus.AUTHED,
      },
    });
    await handleRequestRes(tasksRes);

    const tasks = tasksRes.data?.data || [];

    // 设置任务数
    setCount(tasks.length);

    // 得到需要运行的任务
    const toRunTasks = tasks.slice(-maxRunCount - runningTaskIds.length);

    // 运行啦
    for (const task of toRunTasks) {
      runningTaskIds.push(task.id);

      try {
        await runTask(task.id);
      } catch (e) {
        console.log(e);
      }

      runningTaskIds = runningTaskIds.filter((id) => id !== task.id);
    }
  }, [runTask]);

  useEffect(() => {
    // 桌面端才自动运行
    if (!electronApi.isElectron()) {
      return;
    }

    const timer = setInterval(() => autoRunTask(), INTERVAL) as any;
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    window.addEventListener(globalEventKey.AUTO_RUN_TASK, autoRunTask);
    return () => {
      window.removeEventListener(globalEventKey.AUTO_RUN_TASK, autoRunTask);
    };
  }, [autoRunTask]);

  return (
    <Button
      type="text"
      size="small"
      className="flex h-[20px] min-w-[20px] items-center justify-center overflow-hidden rounded-full px-2 text-white"
      icon={<SyncOutlined spin={count > 0} />}
    >
      {count > 99 ? '10+' : count} 待发布
    </Button>
  );
}

export { AutoRunTaskComponent, useRunAutoTaskWithUI };
