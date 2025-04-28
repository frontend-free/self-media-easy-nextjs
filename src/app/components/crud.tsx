'use client';

import { DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm } from '@ant-design/pro-components';
import { App, Button, message } from 'antd';
import dynamic from 'next/dynamic';
import { ReactNode, RefObject, useCallback, useMemo, useRef } from 'react';

const ProTable = dynamic(
  () => import('@ant-design/pro-components').then((mod) => mod.ProTable as any),
  {
    ssr: false,
  },
) as (typeof import('@ant-design/pro-components'))['ProTable'];

interface CRUDProps<T, P> {
  title: string;
  columns: ProColumns<T>[];
  detailForm: ReactNode;

  request: (params: { current: number; pageSize: number } & P) => Promise<{
    success: boolean;
    data: T[];
    total: number;
  }>;
  requestAdd: (values: T) => Promise<void>;
  requestDelete: (id: string) => Promise<void>;
}

function Add<T, P>({
  actionRef,
  requestAdd,
  detailForm,
}: {
  actionRef: RefObject<ActionType | undefined>;
  requestAdd: CRUDProps<T, P>['requestAdd'];
  detailForm: CRUDProps<T, P>['detailForm'];
}) {
  return (
    <ModalForm
      title="新增"
      autoFocusFirstInput
      trigger={<Button type="primary">新增</Button>}
      onFinish={async (values) => {
        await requestAdd(values as T);

        message.success('新增成功');

        actionRef.current?.reload();

        return true;
      }}
    >
      {detailForm}
    </ModalForm>
  );
}

function CRUD<T extends Record<string, any>, P extends Record<string, any>>({
  title,
  columns,
  request,
  detailForm,
  requestAdd,
  requestDelete,
}: CRUDProps<T, P>) {
  const { modal } = App.useApp();

  const newColumns: ProColumns<T>[] = useMemo(() => {
    return [
      ...columns,
      {
        title: '操作',
        key: 'action',
        valueType: 'option',
        render: (_, record) => [
          <Button
            key="edit"
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              modal.confirm({
                title: '确定删除吗？',
                onOk: async () => {
                  await requestDelete(record.id);
                  message.success('删除成功');
                  actionRef.current?.reload();
                },
              });
            }}
          />,
        ],
      },
    ];
  }, [columns, modal, requestDelete]);

  const actionRef = useRef<ActionType | undefined>(undefined);

  const handleRequest = useCallback(
    async (params) => {
      const res = await request(params);
      return {
        data: res.data,
        success: res.success,
        total: res.total,
      };
    },
    [request],
  );

  return (
    <ProTable<T>
      cardBordered
      headerTitle={title}
      actionRef={actionRef}
      rowKey="id"
      columns={newColumns}
      request={handleRequest}
      toolBarRender={() => [
        <Add<T, P>
          key="add"
          actionRef={actionRef}
          requestAdd={requestAdd}
          detailForm={detailForm}
        />,
      ]}
      options={false}
      search={{
        labelWidth: 'auto',
      }}
    />
  );
}

export { CRUD };
