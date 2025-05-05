'use client';

import { valueEnumPlatform, valueEnumTaskStatus } from '@/generated/enums';
import { PublishResourceType, Task } from '@/generated/prisma';
import { Button } from 'antd';
import { useEffect, useRef } from 'react';
import * as TaskAction from '../actions/task_action';
import { publishTask } from '../components/auto_run';
import { CRUD } from '../components/crud';
import { Resource } from '../components/resource';

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);

  useEffect(() => {
    // @ts-expect-error 先忽略
    window._refreshTask = () => {
      refCRUD?.current?.reload();
    };
  }, []);

  const handlePublishTask = async (task: Task) => {
    try {
      await publishTask({ id: task.id });
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
          render: (value) => (
            <Resource resourceType={PublishResourceType.VIDEO} resourceOfVideo={value as string} />
          ),
          search: false,
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
          search: false,
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
            onClick={async () => {
              handlePublishTask(record);
            }}
          >
            手动发布
          </Button>
        );
      }}
    />
  );
}

export default Page;
