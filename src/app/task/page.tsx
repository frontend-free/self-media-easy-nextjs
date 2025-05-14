'use client';

import { EnumPlatform, valueEnumPlatform, valueEnumTaskStatus } from '@/generated/enums';
import { AccountStatus, PublishResourceType } from '@/generated/prisma';
import { App, Button } from 'antd';
import { useEffect, useRef } from 'react';
import * as TaskAction from '../actions/task_action';
import { publishTask } from '../components/auto_run';
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

  const handlePublishTask = async (task: TaskAction.TaskWithRelations) => {
    try {
      notification.info({
        key: task.id,
        message: '发布中',
        duration: 0,
      });

      await publishTask({
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
              status={record.account.status as AccountStatus}
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
          <>
            <LoadingButton
              type="link"
              className="!px-0"
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
