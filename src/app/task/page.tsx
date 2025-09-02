'use client';

import type { TaskWithRelations } from '@/app/actions/task_actions';
import * as TaskActions from '@/app/actions/task_actions';
import { CRUD } from '@/components/crud';
import { useIsDebug } from '@/components/debug';
import { LoadingButton } from '@/components/loading_button';
import { CheckLogs } from '@/components/logs';
import { Platform } from '@/components/platform';
import { Resource } from '@/components/resource';
import {
  EnumPlatform,
  TagTaskStatus,
  valueEnumPlatform,
  valueEnumTaskStatus,
} from '@/generated/enums';
import { AccountStatus, PublishResourceType } from '@/generated/prisma';
import { handleRequestRes } from '@/lib/request';
import { App, Button } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { globalEventKey } from '../config';
import { useRunAutoTaskWithUI } from './auto_run_task';

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);

  const { modal } = App.useApp();
  const { isDebug } = useIsDebug();

  const { runTask } = useRunAutoTaskWithUI({ isDebug });

  useEffect(() => {
    function refreshTask() {
      refCRUD?.current?.reload();
    }

    window.addEventListener(globalEventKey.REFRESH_TASK, refreshTask);

    return () => {
      window.removeEventListener(globalEventKey.REFRESH_TASK, refreshTask);
    };
  }, []);

  return (
    <div>
      <CRUD<TaskWithRelations>
        ref={refCRUD}
        columns={[
          {
            title: '平台',
            dataIndex: ['account', 'platform'],
            hidden: true,
            valueEnum: valueEnumPlatform,
            search: true,
          },
          {
            title: '视频',
            dataIndex: ['publish', 'resourceOfVideo'],
            render: (_, record: TaskWithRelations) => (
              <Resource
                resourceType={PublishResourceType.VIDEO}
                resourceOfVideo={record.publish.resourceOfVideo as string}
              />
            ),
          },
          {
            title: '平台账号',
            dataIndex: ['account', 'platformName'],
            render: (_, record: TaskWithRelations) => (
              <Platform
                name={record.account.platformName || ''}
                value={record.account.platform as EnumPlatform}
                status={record.account.status as AccountStatus}
                deletedAt={record.account.deletedAt || undefined}
              />
            ),
          },
          {
            title: '标题',
            dataIndex: ['publish', 'title'],
            search: true,
          },
          {
            title: '状态',
            dataIndex: 'status',
            valueEnum: valueEnumTaskStatus,
            render: (_, record: TaskWithRelations) => {
              return <TagTaskStatus value={record.status} />;
            },
          },
          {
            title: '备注',
            dataIndex: 'remark',
          },
          {
            title: '时间',
            dataIndex: 'endAt',
            render: (_, record: TaskWithRelations) => {
              return (
                <div>
                  <div>
                    新建&nbsp;
                    {record.createdAt ? dayjs(record.createdAt).format('MM-DD HH:mm') : ''}
                  </div>
                  <div>
                    发布&nbsp;
                    {record.endAt ? dayjs(record.endAt).format('MM-DD HH:mm') : ''}
                  </div>
                </div>
              );
            },
          },
        ]}
        request={async (params) => {
          return await TaskActions.pageTasks(params);
        }}
        toolBarRenderPre={
          <Button
            danger
            onClick={() => {
              modal.confirm({
                title: '确定停止待运行任务？',
                onOk: async () => {
                  handleRequestRes(await TaskActions.stopTasksOfPending());
                  refCRUD?.current?.reload();
                },
              });
            }}
          >
            一键停止待运行任务
          </Button>
        }
        disabledCreate
        disabledDelete
        disabledUpdate
        renderOperate={({ record }) => {
          return (
            <>
              <LoadingButton
                type="link"
                className="!p-0"
                disabled={
                  record.account.status !== AccountStatus.AUTHED ||
                  record.account.deletedAt !== null
                }
                onClick={() => {
                  modal.confirm({
                    title: '确定再次发布吗？',
                    onOk: async () => {
                      await runTask(record.id);
                    },
                  });
                }}
              >
                再次发布
              </LoadingButton>
              <CheckLogs value={record.logs} />
            </>
          );
        }}
      />
    </div>
  );
}

export default Page;
