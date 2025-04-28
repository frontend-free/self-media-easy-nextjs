'use client';

import * as UserAction from '@/app/actions/user_action';
import { CRUD } from '@/app/components/crud';
import { User } from '@/generated/prisma';
import { ProFormSwitch, ProFormText } from '@ant-design/pro-components';

function UsersPage() {
  return (
    <CRUD<User>
      title="用户管理"
      columns={[
        {
          title: '用户名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
        },
        {
          title: '管理员',
          dataIndex: 'isAdmin',
          key: 'isAdmin',
          valueType: 'switch',
          fieldProps: {
            checkedChildren: '是',
            unCheckedChildren: '',
          },
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          valueType: 'dateTime',
        },
      ]}
      detailForm={
        <>
          <ProFormText name="name" label="用户名" />
          <ProFormSwitch name="isAdmin" label="是否为管理员" />
        </>
      }
      request={async () => {
        const data = await UserAction.getUsers();
        return {
          data,
        };
      }}
      requestAdd={async (values) => {
        await UserAction.createUser(values as UserAction.CreateUserInput);
      }}
      requestDelete={async (id) => {
        await UserAction.deleteUser(id);
      }}
    />
  );
}

export default UsersPage;
