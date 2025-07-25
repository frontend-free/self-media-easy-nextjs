'use client';

import * as SchoolActions from '@/app/actions/school_actions';
import { ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { CRUD } from '../components/crud';

function Page() {
  return (
    <CRUD
      title="驾校信息"
      columns={[
        {
          title: 'ID',
          dataIndex: 'id',
          search: true,
        },
        {
          title: '驾校',
          dataIndex: 'name',
          search: true,
        },
        {
          title: '电话',
          dataIndex: 'phone',
        },
        {
          title: '地址',
          dataIndex: 'address',
          render: (_, record) => {
            return record.address?.split('\n').map((item, index) => <div key={index}>{item}</div>);
          },
        },
        {
          title: '授权奖励学时（秒）',
          dataIndex: 'authRewardHours',
        },
        {
          title: '视频奖励学时（秒）',
          dataIndex: 'videoRewardHours',
        },
      ]}
      request={async (params) => {
        const res = await SchoolActions.pageSchools(params);
        return {
          data: res.data,
          total: res.total,
          success: res.success,
        };
      }}
      disabledCreate
      disabledDelete
      detailForm={() => (
        <div>
          <ProFormText name="id" label="ID" disabled />
          <ProFormText name="name" label="驾校" required rules={[{ required: true }]} />
          <ProFormText name="phone" label="电话" />
          <ProFormTextArea name="address" label="地址" rows={4} extra="支持换行" />
          <ProFormDigit name="authRewardHours" label="授权奖励学时（秒）" min={60} max={14 * 60} />
          <ProFormDigit name="videoRewardHours" label="视频奖励学时（秒）" min={60} max={14 * 60} />
        </div>
      )}
      requestDetail={async (id) => {
        const res = await SchoolActions.getSchoolById(id);
        return res;
      }}
      requestUpdate={async (values) => {
        await SchoolActions.updateSchool(values as SchoolActions.UpdateSchoolInput);
      }}
    />
  );
}

export default Page;
