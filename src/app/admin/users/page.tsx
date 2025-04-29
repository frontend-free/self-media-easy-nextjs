'use client';

import type { UserDetail } from '@/app/actions/user_action';
import * as UserAction from '@/app/actions/user_action';
import { CRUD } from '@/app/components/crud';
import { ProFormSwitch, ProFormText } from '@ant-design/pro-components';

function UsersList() {
  return (
    <CRUD<UserDetail>
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
      detailForm={({ type }) => (
        <>
          <ProFormText name="id" label="ID" hidden />
          <ProFormText
            name="name"
            label="用户名"
            required
            rules={[{ required: true }]}
            disabled={type === 'update'}
          />
          <ProFormText name="nickname" label="昵称" />
          <ProFormText name="mobile" label="手机号" />
          <ProFormSwitch name="isAdmin" label="是否为管理员" />
        </>
      )}
      request={async (params) => {
        const res = await UserAction.pageUsers(params);
        return {
          data: res.data,
          total: res.total,
          success: res.success,
        };
      }}
      requestCreate={async (values) => {
        await UserAction.createUser(values as UserAction.CreateUserInput);
      }}
      requestDelete={async (id) => {
        await UserAction.deleteUser(id);
      }}
      requestDetail={async (id) => {
        const res = await UserAction.getUserById(id);
        return res;
      }}
      requestUpdate={async (values) => {
        await UserAction.updateUser(values as UserAction.UpdateUserInput);
      }}
    />
  );
}

export default UsersList;
