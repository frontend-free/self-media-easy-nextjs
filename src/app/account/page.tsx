'use client';
import { EnumPlatform, listPlatform, valueEnumPlatform } from '@/generated/enums';
import { Account } from '@/generated/prisma';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import * as AccountAction from '../actions/account_action';
import * as TagCoachAction from '../actions/tag_coach_action';
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
          valueEnum: valueEnumPlatform,
        },
        {
          title: '所属教练',
          dataIndex: 'tagCoach',
          render: (_, record: Account) => record.tagCoach?.name,
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          valueType: 'dateTime',
          search: false,
        },
      ]}
      detailForm={() => (
        <div>
          <ProFormText name="id" label="ID" hidden />
          <ProFormText name="name" label="用户名" required rules={[{ required: true }]} />
          <ProFormSelect
            name="type"
            label="平台"
            options={listPlatform}
            initialValue={EnumPlatform.TIKTOK}
            required
            rules={[{ required: true }]}
          />
          <ProFormSelect
            name="tagCoachId"
            label="所属教练"
            request={async () => {
              const res = await TagCoachAction.pageTagCoaches({
                pageSize: 100,
                current: 1,
              });
              return res.data.map((item) => ({
                label: item.name,
                value: item.id,
              }));
            }}
          />
        </div>
      )}
      request={async (params) => {
        const res = await AccountAction.pageAccounts(params);
        return res;
      }}
      requestCreate={async (values) => {
        await AccountAction.createAccount(values as AccountAction.CreateAccountInput);
      }}
      requestDelete={async (id) => {
        await AccountAction.deleteAccount(id);
      }}
      requestDetail={async (id) => {
        const res = await AccountAction.getAccountById(id);
        return res;
      }}
      requestUpdate={async (values) => {
        await AccountAction.updateAccount(values as AccountAction.UpdateAccountInput);
      }}
    />
  );
}

export default Page;
