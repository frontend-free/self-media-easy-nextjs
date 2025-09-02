'use client';

import * as PublishActions from '@/app/actions/publish_actions';
import { TaskWithRelations } from '@/app/actions/task_actions';
import { CRUD } from '@/components/crud';
import { ProFormFiles } from '@/components/form/pro_form_files';
import { ProFormSelectAccounts } from '@/components/form/pro_form_select_accounts';
import { ProFormTextWithSelect } from '@/components/form/pro_form_text_with_select';
import { Platform } from '@/components/platform';
import { Resource } from '@/components/resource';
import {
  EnumPlatform,
  TagTaskStatus,
  valueEnumPublishResourceType,
  valueEnumPublishType,
} from '@/generated/enums';
import { AccountStatus, PublishResourceType, PublishType } from '@/generated/prisma';
import {
  ProFormField,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Alert } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { globalEventKey } from '../config';

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);

  useEffect(() => {
    const handler = () => {
      refCRUD?.current?.reload();
    };

    window.addEventListener(globalEventKey.REFRESH_PUBLISH, handler);

    return () => {
      window.removeEventListener(globalEventKey.REFRESH_PUBLISH, handler);
    };
  }, []);

  return (
    <div>
      <div className="px-4 pt-4">
        <Alert message={<div>新建发布后，会自动排队发布任务，请耐心等待。</div>} type="info" />
      </div>
      <CRUD
        ref={refCRUD}
        columns={[
          {
            title: '视频',
            dataIndex: 'resourceOfVideo',
            render: (value) => (
              <Resource
                resourceType={PublishResourceType.VIDEO}
                resourceOfVideo={value as string}
              />
            ),
          },
          {
            title: '账号发布状态',
            dataIndex: 'tasks',
            render: (value) => {
              if (!value) {
                return '-';
              }

              const tasks = value as TaskWithRelations[];

              return (
                <div className="flex flex-col gap-1">
                  {tasks.map((item) => (
                    <div key={item.id} className={cn('flex flex-row items-center gap-1')}>
                      <Platform
                        name={item.account.platformName || ''}
                        value={item.account.platform as EnumPlatform}
                        status={item.account.status as AccountStatus}
                        deletedAt={item.account.deletedAt || undefined}
                        className="flex-1"
                      />
                      <TagTaskStatus value={item.status} />
                    </div>
                  ))}
                </div>
              );
            },
          },
          {
            title: '标题',
            dataIndex: 'title',
            search: true,
          },
          {
            title: '发布时间',
            dataIndex: 'createdAt',
            render: (_, record) => {
              return dayjs(record.createdAt).format('MM-DD HH:mm');
            },
          },
        ]}
        detailForm={() => (
          <div>
            <ProFormText name="id" label="ID" hidden />

            {/* 先屏蔽 */}
            <ProFormField
              name="resourceType"
              label="资源类型"
              valueEnum={valueEnumPublishResourceType}
              initialValue={PublishResourceType.VIDEO}
              hidden
            />
            <ProFormFiles name="resourceOfVideo" label="视频" rules={[{ required: true }]} />

            <ProFormSelectAccounts name="accountIds" label="账号" rules={[{ required: true }]} />

            <ProFormTextWithSelect name="title" label="标题" />

            {/* 先屏蔽 */}
            <ProFormTextArea name="description" label="描述" hidden />

            {/* 先屏蔽 */}
            <ProFormRadio.Group
              name="publishType"
              label="发布类型"
              valueEnum={valueEnumPublishType}
              initialValue={PublishType.OFFICIAL}
              hidden
            />
          </div>
        )}
        request={async (params) => {
          return await PublishActions.pagePublishes(params);
        }}
        createButtonText="新建发布"
        requestCreate={async (values) => {
          return await PublishActions.createPublish(values as PublishActions.CreatePublishInput);
        }}
        requestDelete={async (id) => {
          return await PublishActions.deletePublish(id);
        }}
        disabledUpdate
      />
    </div>
  );
}

export default Page;
