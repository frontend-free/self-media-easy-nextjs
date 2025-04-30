'use client';

import { valueEnumPlatform, valueEnumTaskStatus } from '@/generated/enums';
import { Task } from '@/generated/prisma';
import { useRef } from 'react';
import * as TaskAction from '../actions/task_action';
import { CRUD } from '../components/crud';

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);

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

        console.log('res', res);
        return res;
      }}
      disabledCreate
      disabledDelete
      disabledUpdate
    />
  );
}

export default Page;
