'use client';

import * as PublishAction from '@/app/actions/publish_action';
import { CRUD } from '@/app/components/crud';
import { valueEnumPublishResourceType, valueEnumPublishType } from '@/generated/enums';
import { PublishResourceType, PublishType } from '@/generated/prisma';
import {
  ProFormField,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

function Page() {
  return (
    <CRUD
      title="发布"
      columns={[
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
          title: '发布类型',
          dataIndex: 'publishType',
          search: false,
        },
        {
          title: '资源',
          dataIndex: 'resourceOfVideo',
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
          <ProFormText name="resourceOfVideo" label="资源" required rules={[{ required: true }]} />

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
