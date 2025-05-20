'use client';

import * as TagCoachActions from '@/app/actions/tag_coach_actions';
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
        const res = await TagCoachActions.pageTagCoaches(params);
        return {
          data: res.data,
          total: res.total,
          success: res.success,
        };
      }}
      requestCreate={async (values) => {
        await TagCoachActions.createTagCoach(values as TagCoachActions.CreateTagCoachInput);
      }}
      requestDelete={async (id) => {
        await TagCoachActions.deleteTagCoach(id);
      }}
      requestDetail={async (id) => {
        const res = await TagCoachActions.getTagCoachById(id);
        return res;
      }}
      requestUpdate={async (values) => {
        await TagCoachActions.updateTagCoach(values as TagCoachActions.UpdateTagCoachInput);
      }}
    />
  );
}

export default Page;
