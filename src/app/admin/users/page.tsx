'use client';

import type { UserDetail } from '@/app/actions/user_actions';
import * as UserActions from '@/app/actions/user_actions';
import { CRUD } from '@/app/components/crud';
import { ProFormSwitch, ProFormText } from '@ant-design/pro-components';

function UsersList() {
  return (
    <CRUD<UserDetail>
      columns={[
        {
          title: '用户名',
          dataIndex: 'name',
          key: 'name',
          search: true,
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname',
          search: true,
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
          search: true,
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
      detailForm={({ type }) => (
        <>
          <ProFormText name="id" label="ID" hidden />
          <ProFormText
            name="name"
            label="用户名"
            rules={[{ required: true }]}
            disabled={type === 'update'}
          />
          <ProFormText name="password" label="密码" rules={[{ required: true }]} />
          <ProFormText name="nickname" label="昵称" />
          <ProFormText name="mobile" label="手机号" />
          <ProFormSwitch name="isAdmin" label="是否为管理员" />
        </>
      )}
      request={async (params) => {
        const res = await UserActions.pageUsers(params);
        return {
          data: res.data,
          total: res.total,
          success: res.success,
        };
      }}
      requestCreate={async (values) => {
        await UserActions.createUser(values as UserActions.CreateUserInput);
      }}
      requestDelete={async (id) => {
        await UserActions.deleteUser(id);
      }}
      requestDetail={async (id) => {
        const res = await UserActions.getUserById(id);
        return res;
      }}
      requestUpdate={async (values) => {
        await UserActions.updateUser(values as UserActions.UpdateUserInput);
      }}
    />
  );
}

export default UsersList;
