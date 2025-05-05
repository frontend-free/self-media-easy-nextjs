'use client';

import { electronApi } from '@/electron';
import { valueEnumPlatform, valueEnumTaskStatus } from '@/generated/enums';
import { Task, TaskStatus } from '@/generated/prisma';
import { SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRef } from 'react';
import * as TaskAction from '../actions/task_action';
import { CRUD } from '../components/crud';

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);

  const handlePublishTask = async (task: Task) => {
    try {
      // 更新任务状态
      TaskAction.updateTask({
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

      // 发布
      const res = await electronApi.platformPublish({
        platform,
        authInfo,
        resourceOfVideo,
      });

      // 成功更新任务
      if (res.success) {
        TaskAction.updateTask({
          id: task.id,
          status: TaskStatus.SUCCESS,
          logs: JSON.stringify(res.data?.logs || []),
          endAt: new Date(),
        });
      }
      // 失败更新任务
      else {
        TaskAction.updateTask({
          id: task.id,
          status: TaskStatus.FAILED,
          logs: JSON.stringify(res.data?.logs || []),
          endAt: new Date(),
        });
      }
    } finally {
      refCRUD?.current?.reload();
    }
  };
  return (
    <CRUD<Task>
      ref={refCRUD}
      title="任务"
      columns={[
        {
          title: '平台',
          dataIndex: ['account', 'platform'],
          valueEnum: valueEnumPlatform,
        },
        {
          title: '账号',
          dataIndex: ['account', 'platformName'],
        },
        {
          title: '视频',
          dataIndex: ['publish', 'resourceOfVideo'],
        },
        {
          title: '状态',
          dataIndex: 'status',
          valueEnum: valueEnumTaskStatus,
        },
        {
          title: '发布时间',
          dataIndex: 'endAt',
          valueType: 'dateTime',
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          valueType: 'dateTime',
          search: false,
        },
      ]}
      request={async (params) => {
        const res = await TaskAction.pageTasks(params);
        return res;
      }}
      disabledCreate
      disabledDelete
      disabledUpdate
      renderOperate={({ record }) => {
        return (
          <Button
            type="link"
            icon={<SendOutlined />}
            onClick={async () => {
              handlePublishTask(record);
            }}
          >
            发布Debug
          </Button>
        );
      }}
    />
  );
}

export default Page;
