'use client';

import * as PublishActions from '@/app/actions/publish_actions';
import { CRUD } from '@/app/components/crud';
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
import { TaskWithRelations } from '../actions/task_actions';
import { ProFormSelectAccounts } from '../components/form/pro_form_select_accounts';
import { ProFormTextWithSelect } from '../components/form/pro_form_text_with_select';
import { PlatformWithName } from '../components/platform';
import { Resource } from '../components/resource';

interface FilesProps {
  value?: string;
  onChange: (value?: string) => void;
}

function Files(props: FilesProps) {
  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
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
              <div>2. 请不要随意移动选中的资源，否则影响发布。</div>
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
    <div className="flex flex-col gap-4">
      <Alert
        message={
          <div>
            <div>新建发布后</div>
            <div>1 软件会自动运行发布任务，请不要关闭软件。</div>
            <div>2 不要随意移动选中的资源，否则影响发布。</div>
          </div>
        }
        type="info"
        className="mb-4"
      />
      <CRUD
        title="发布"
        columns={[
          {
            title: '标题',
            dataIndex: 'title',
            search: true,
          },
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
            title: '发布类型',
            dataIndex: 'publishType',
            valueEnum: valueEnumPublishType,
          },
          {
            title: '账号发布状态',
            dataIndex: 'tasks',
            render: (value) => {
              if (!value) {
                return null;
              }

              const tasks = value as TaskWithRelations[];

              return (
                <div>
                  {tasks.map((item) => (
                    <div key={item.id} className="flex flex-row items-center gap-2">
                      <PlatformWithName
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
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
          },
        ]}
        detailForm={() => (
          <div>
            <ProFormText name="id" label="ID" hidden />

            <ProFormField
              name="resourceType"
              label="资源类型"
              valueEnum={valueEnumPublishResourceType}
              initialValue={PublishResourceType.VIDEO}
              disabled
            />
            <ProFormFiles
              name="resourceOfVideo"
              label="视频"
              required
              rules={[{ required: true }]}
            />

            <ProFormSelectAccounts
              name="accountIds"
              label="账号"
              required
              rules={[{ required: true }]}
            />

            <ProFormTextWithSelect
              name="title"
              label="标题"
              rules={[
                {
                  min: 6,
                  max: 30,
                  message: '标题至少需要6个字,最多30个字',
                },
                {
                  pattern: /^[\u4e00-\u9fa5a-zA-Z0-9《》""：+?%℃\s]+$/,
                  message:
                    '标题包含特殊字符，符号仅支持书名号、引号、冒号、加号、问号、百分号、摄氏度，逗号可用空格代替',
                },
              ]}
            />

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
          const res = await PublishActions.pagePublishes(params);
          return res;
        }}
        requestCreate={async (values) => {
          await PublishActions.createPublish(values as PublishActions.CreatePublishInput);
        }}
        requestDelete={async (id) => {
          await PublishActions.deletePublish(id);
        }}
        disabledUpdate
      />
    </div>
  );
}

export default Page;
