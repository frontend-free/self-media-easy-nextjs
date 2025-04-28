'use client';
import { EnumPlatform, listPlatform } from '@/generated/enums';
import { Account } from '@/generated/prisma';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import * as AccountAction from '../actions/account_action';
import { CRUD } from '../components/crud';

function Page() {
  return (
    <CRUD<Account, Partial<Pick<Account, 'name'>>>
      title="账号"
      columns={[
        {
          title: '账号',
          dataIndex: 'name',
        },
        {
          title: '类型',
          dataIndex: 'type',
        },
        {
          title: '教练',
          dataIndex: 'tagCoach',
          render: (_, record) => record.tagCoach?.name,
        },
      ]}
      detailForm={
        <div>
          <ProFormText name="name" label="用户名" required rules={[{ required: true }]} />
          <ProFormSelect
            name="type"
            label="类型"
            options={listPlatform}
            initialValue={EnumPlatform.TIKTOK}
            required
            rules={[{ required: true }]}
          />
          <ProFormSelect name="tagCoachId" label="教练" options={[]} />
        </div>
      }
      request={async (params) => {
        const res = await AccountAction.pageAccounts(params);
        return res;
      }}
      requestAdd={async (values) => {
        await AccountAction.createAccount(values as AccountAction.CreateAccountInput);
      }}
      requestDelete={async (id) => {
        await AccountAction.deleteAccount(id);
      }}
    />
  );
}

export default Page;
