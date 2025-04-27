'use client';

import * as UserAction from '@/app/actions/user_action';
import { User } from '@/generated/prisma';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { RefObject, useRef } from 'react';

function UserAdd({ actionRef }: { actionRef: RefObject<ActionType | undefined> }) {
  return (
    <ModalForm
      title="新增用户"
      trigger={<Button type="primary">新增用户</Button>}
      onFinish={async (values) => {
        await UserAction.createUser(values as UserAction.CreateUserInput);

        message.success('新增成功');

        actionRef.current?.reload();

        return true;
      }}
    >
      <ProFormText name="name" label="用户名" />
    </ModalForm>
  );
}

function UsersPage() {
  const router = useRouter();

  const fetchUsers = async () => {
    const data = await UserAction.getUsers();
    return {
      data,
      success: true,
      total: data.length,
    };
  };

  const columns: ProColumns<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => router.push(`/admin/users/${record.id}`)}
        >
          编辑
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={async () => {
            await UserAction.deleteUser(record.id);
            message.success('删除成功');
            // 刷新表格
            actionRef.current?.reload();
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  const actionRef = useRef<ActionType | undefined>(undefined);

  return (
    <div className="p-6">
      <ProTable<User>
        headerTitle="用户管理"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={fetchUsers}
        search={false}
        toolBarRender={() => [<UserAdd key="add" actionRef={actionRef} />]}
      />
    </div>
  );
}

export default UsersPage;
