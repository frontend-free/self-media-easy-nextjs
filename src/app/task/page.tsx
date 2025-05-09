'use client';

import { EnumPlatform, valueEnumPlatform, valueEnumTaskStatus } from '@/generated/enums';
import { PublishResourceType } from '@/generated/prisma';
import { useEffect, useRef } from 'react';
import * as TaskAction from '../actions/task_action';
import { publishTask } from '../components/auto_run';
import { CRUD } from '../components/crud';
import { LoadingButton } from '../components/loading_button';
import { PlatformWithName } from '../components/platform';
import { Resource } from '../components/resource';

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);

  useEffect(() => {
    // @ts-expect-error 先忽略
    window._refreshTask = () => {
      refCRUD?.current?.reload();
    };
  }, []);

  const handlePublishTask = async (task: TaskAction.TaskWithRelations) => {
    try {
      await publishTask({ id: task.id });
    } finally {
      refCRUD?.current?.reload();
    }
  };

  return (
    <CRUD<TaskAction.TaskWithRelations>
      ref={refCRUD}
      title="任务"
      columns={[
        {
          title: '平台',
          dataIndex: ['account', 'platform'],
          hidden: true,
          valueEnum: valueEnumPlatform,
          search: true,
        },
        {
          title: '平台账号',
          dataIndex: ['account', 'platformName'],
          search: true,
          render: (_, record: TaskAction.TaskWithRelations) => (
            <PlatformWithName
              name={record.account.platformName || ''}
              value={record.account.platform as EnumPlatform}
            />
          ),
        },
        {
          title: '标题',
          dataIndex: ['publish', 'title'],
          search: true,
        },
        {
          title: '视频',
          dataIndex: ['publish', 'resourceOfVideo'],
          render: (value) => (
            <Resource resourceType={PublishResourceType.VIDEO} resourceOfVideo={value as string} />
          ),
        },
        {
          title: '状态',
          dataIndex: 'status',
          valueEnum: valueEnumTaskStatus,
          search: true,
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
          <LoadingButton
            type="link"
            className="!px-0"
            onClick={async () => {
              handlePublishTask(record);
            }}
          >
            手动发布
          </LoadingButton>
        );
      }}
    />
  );
}

export default Page;
