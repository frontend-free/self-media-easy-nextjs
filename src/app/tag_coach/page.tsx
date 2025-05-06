'use client';

import * as TagCoachAction from '@/app/actions/tag_coach_action';
import { CRUD } from '@/app/components/crud';
import { ProFormText } from '@ant-design/pro-components';

function Page() {
  return (
    <CRUD
      title="教练"
      columns={[
        {
          title: '名字',
          dataIndex: 'name',
          search: true,
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          valueType: 'dateTime',
        },
      ]}
      detailForm={() => (
        <div>
          <ProFormText name="id" label="账号" hidden />
          <ProFormText name="name" label="名字" required rules={[{ required: true }]} />
        </div>
      )}
      request={async (params) => {
        const res = await TagCoachAction.pageTagCoaches(params);
        return {
          data: res.data,
          total: res.total,
          success: res.success,
        };
      }}
      requestCreate={async (values) => {
        await TagCoachAction.createTagCoach(values as TagCoachAction.CreateTagCoachInput);
      }}
      requestDelete={async (id) => {
        await TagCoachAction.deleteTagCoach(id);
      }}
      requestDetail={async (id) => {
        const res = await TagCoachAction.getTagCoachById(id);
        return res;
      }}
      requestUpdate={async (values) => {
        await TagCoachAction.updateTagCoach(values as TagCoachAction.UpdateTagCoachInput);
      }}
    />
  );
}

export default Page;
