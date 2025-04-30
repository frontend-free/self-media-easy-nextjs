'use client';

import * as PublishAction from '@/app/actions/publish_action';
import { CRUD } from '@/app/components/crud';
import { electronApi } from '@/electron';
import {
  valueEnumPublishResourceType,
  valueEnumPublishStatus,
  valueEnumPublishType,
} from '@/generated/enums';
import { PublishResourceType, PublishType } from '@/generated/prisma';
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
      <div className="mt-2">
        <Alert message="请不要随意移动选中的资源，否则影响发布" type="info" />
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
    <CRUD
      title="发布"
      columns={[
        {
          title: '发布类型',
          dataIndex: 'publishType',
          valueEnum: valueEnumPublishType,
          search: false,
        },
        {
          title: '资源',
          dataIndex: 'resourceOfVideo',
          search: false,
        },
        {
          title: '标题',
          dataIndex: 'title',
        },
        {
          title: '描述',
          dataIndex: 'description',
          search: false,
        },
        {
          title: '发布状态',
          dataIndex: 'publishStatus',
          valueEnum: valueEnumPublishStatus,
          search: false,
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          valueType: 'dateTime',
          search: false,
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
          <ProFormFiles name="resourceOfVideo" label="视频" required rules={[{ required: true }]} />

          <ProFormText name="title" label="标题" />
          <ProFormTextArea name="description" label="描述" />

          <ProFormRadio.Group
            name="publishType"
            label="发布类型"
            valueEnum={valueEnumPublishType}
            initialValue={PublishType.OFFICIAL}
          />
        </div>
      )}
      request={async (params) => {
        const res = await PublishAction.pagePublishes(params);
        return res;
      }}
      requestCreate={async (values) => {
        await PublishAction.createPublish(values as PublishAction.CreatePublishInput);
      }}
      requestDelete={async (id) => {
        await PublishAction.deletePublish(id);
      }}
      disabledUpdate
    />
  );
}

export default Page;
