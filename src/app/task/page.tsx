'use client';

import { EnumPlatform, valueEnumPlatform, valueEnumTaskStatus } from '@/generated/enums';
import { AccountStatus, PublishResourceType } from '@/generated/prisma';
import { App, Button } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import type { TaskWithRelations } from '../actions/task_actions';
import * as TaskActions from '../actions/task_actions';
import { runAutoTask } from '../components/auto_run';
import { CRUD } from '../components/crud';
import { useIsDebug } from '../components/debug';
import { LoadingButton } from '../components/loading_button';
import { PlatformWithName } from '../components/platform';
import { Resource } from '../components/resource';

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);

  const { notification, modal } = App.useApp();
  const { isDebug } = useIsDebug();

  useEffect(() => {
    // @ts-expect-error 先忽略
    window._refreshTask = () => {
      refCRUD?.current?.reload();
    };
  }, []);

  const handlePublishTask = async (task: TaskWithRelations) => {
    try {
      notification.info({
        key: task.id,
        message: '发布中',
        duration: 0,
      });

      await runAutoTask({
        id: task.id,
        isDebug,
        onSuccess: () => {
          notification.success({
            key: task.id,
            message: '发布成功',
            duration: 4.5,
          });
        },
        onError: (error) => {
          notification.error({
            key: task.id,
            message: `发布失败 ${error.message}`,
            duration: 4.5,
          });
        },
      });
    } finally {
      refCRUD?.current?.reload();
    }
  };

  return (
    <CRUD<TaskWithRelations>
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
          render: (_, record: TaskWithRelations) => (
            <PlatformWithName
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
          render: (_, record: TaskWithRelations) => {
            return (
              <div>
                <div className="line-clamp-2">{record.publish.title}</div>
                <Resource
                  resourceType={PublishResourceType.VIDEO}
                  resourceOfVideo={record.publish.resourceOfVideo as string}
                />
              </div>
            );
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          valueEnum: valueEnumTaskStatus,
          search: true,
        },
        {
          title: '备注',
          dataIndex: 'remark',
        },
        {
          title: '发布时间',
          dataIndex: 'endAt',
          valueType: 'dateTime',
          render: (_, record: TaskWithRelations) => {
            return (
              <div>
                <div>发布 {dayjs(record.endAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                <div>创建 {dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
            );
          },
        },
      ]}
      request={async (params) => {
        const res = await TaskActions.pageTasks(params);
        return res;
      }}
      toolBarRenderPre={
        <Button
          danger
          onClick={() => {
            modal.confirm({
              title: '确定停止待运行任务？',
              onOk: async () => {
                await TaskActions.stopTasksOfPending();
                refCRUD?.current?.reload();
              },
            });
          }}
        >
          停止待运行任务
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
              className="!px-0"
              disabled={
                record.account.status !== AccountStatus.AUTHED || record.account.deletedAt !== null
              }
              onClick={async () => {
                modal.confirm({
                  title: '确定手动发布吗？',
                  onOk: () => {
                    handlePublishTask(record);
                  },
                });
              }}
            >
              手动发布
            </LoadingButton>
            <Button
              type="link"
              className="!px-0"
              onClick={() => {
                modal.info({
                  title: '日志',
                  width: 800,
                  content: (
                    <div>
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(record.logs || ''), null, 2).replace(
                          /\\n/g,
                          '\n',
                        )}
                      </pre>
                    </div>
                  ),
                });
              }}
            >
              查看日志
            </Button>
          </>
        );
      }}
    />
  );
}

export default Page;
