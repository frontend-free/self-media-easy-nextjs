'use client';

import * as UserAction from '@/app/actions/user_action';
import { CRUD } from '@/app/components/crud';
import { User } from '@/generated/prisma';
import { ProFormSwitch, ProFormText } from '@ant-design/pro-components';

function UsersList() {
  return (
    <CRUD<User, Partial<Pick<User, 'name'>>>
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
          search: false,
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
          search: false,
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
          search: false,
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          valueType: 'dateTime',
          search: false,
        },
      ]}
      detailForm={
        <>
          <ProFormText name="name" label="用户名" required rules={[{ required: true }]} />
          <ProFormSwitch name="isAdmin" label="是否为管理员" />
        </>
      }
      request={async (params) => {
        const res = await UserAction.pageUsers(params);
        return {
          data: res.data,
          total: res.total,
          success: res.success,
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

export default UsersList;
