"use client";

import { useState, useRef, RefObject } from "react";
import { Button, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { ModalForm, ProTable, ProFormText } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import * as UserAction from "@/server/user";
import { User } from "@/generated/prisma";

function UserAdd({
  actionRef,
}: {
  actionRef: RefObject<ActionType | undefined>;
}) {
  return (
    <ModalForm
      title="新增用户"
      trigger={<Button type="primary">新增用户</Button>}
      onFinish={async (values) => {
        await UserAction.createUser(values as UserAction.CreateUserInput);

        message.success("新增成功");

        actionRef.current?.reload();

        return true;
      }}
    >
      <ProFormText name="name" label="姓名" />
      <ProFormText name="mobile" label="手机号" />
    </ModalForm>
  );
}

function UsersPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserAction.getUsers();
      return {
        data,
        success: true,
        total: data.length,
      };
    } catch (error) {
      message.error("获取用户列表失败");
      return {
        data: [],
        success: false,
        total: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<User>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "手机号",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      valueType: "dateTime",
    },
    {
      title: "操作",
      key: "action",
      valueType: "option",
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
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>,
      ],
    },
  ];

  const handleDelete = async (id: number) => {
    try {
      await UserAction.deleteUser(id);
      message.success("删除成功");
      // 刷新表格
      actionRef.current?.reload();
    } catch (error) {
      message.error("删除失败");
    }
  };

  const actionRef = useRef<ActionType | undefined>(undefined);

  return (
    <div className="p-6">
      <ProTable<User>
        headerTitle="用户管理"
        actionRef={actionRef}
        rowKey="id"
        loading={loading}
        columns={columns}
        request={fetchUsers}
        search={false}
        toolBarRender={() => [<UserAdd actionRef={actionRef} />]}
      />
    </div>
  );
}

export default UsersPage;
