'use client';

import * as PublishActions from '@/app/actions/publish_actions';
import { TaskWithRelations } from '@/app/actions/task_actions';
import { CRUD } from '@/components/crud';
import { ProFormSelectAccounts } from '@/components/form/pro_form_select_accounts';
import { ProFormTextWithSelect } from '@/components/form/pro_form_text_with_select';
import { Platform } from '@/components/platform';
import { Resource } from '@/components/resource';
import { electronApi } from '@/electron';
import {
  EnumPlatform,
  TagTaskStatus,
  valueEnumPublishResourceType,
  valueEnumPublishType,
} from '@/generated/enums';
import { AccountStatus, PublishResourceType, PublishType } from '@/generated/prisma';
import { DeleteOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormField,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Alert, Button } from 'antd';

interface FilesProps {
  value?: string;
  onChange: (value?: string) => void;
}

function Files(props: FilesProps) {
  return (
    <div>
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={async () => {
            const res = await electronApi.showOpenDialogOfOpenFile();
            if (res.success) {
              props.onChange(res.data?.filePaths[0] || undefined);
            }
          }}
        >
          选择文件
        </Button>

        {props.value && (
          <div className="flex flex-row items-center gap-2">
            <div className="">{props.value}</div>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => props.onChange(undefined)}
            />
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <Alert
          message={
            <div>
              {/* 抖音 16G 1h; 视频号 4G 2h; */}
              <div>1. 视频文件大小不超过4G，时长在60分钟以内。否则可能影响发布。</div>
            </div>
          }
          type="info"
        />
      </div>
    </div>
  );
}

function ProFormFiles(props) {
  /* eslint-disable-next-line */
  const { cacheForSwr, proFieldKey, onBlur, fieldProps, ...rest } = props;
  return (
    <ProForm.Item {...rest}>
      <Files {...fieldProps} />
    </ProForm.Item>
  );
}

function Page() {
  return (
    <div>
      <div className="px-4 pt-4">
        <Alert message={<div>新建发布后，会自动排队并运行发布任务，请等待。</div>} type="info" />
      </div>
      <CRUD
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
                <div>
                  {tasks.map((item) => (
                    <div key={item.id} className="flex flex-row items-center gap-1">
                      <Platform
                        name={item.account.platformName || ''}
                        value={item.account.platform as EnumPlatform}
                        status={item.account.status as AccountStatus}
                        deletedAt={item.account.deletedAt || undefined}
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
            valueType: 'dateTime',
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
