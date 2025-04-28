'use client';

import { DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ModalForm, ProTable } from '@ant-design/pro-components';
import { App, Button, message } from 'antd';
import { ReactNode, RefObject, useCallback, useMemo, useRef } from 'react';

interface CRUDProps<T> {
  title: string;
  columns: ProColumns<T>[];
  detailForm: ReactNode;

  request: () => Promise<{
    data: T[];
  }>;
  requestAdd: (values: T) => Promise<void>;
  requestDelete: (id: string) => Promise<void>;
}

function Add<T>({
  actionRef,
  requestAdd,
  detailForm,
}: {
  actionRef: RefObject<ActionType | undefined>;
  requestAdd: CRUDProps<T>['requestAdd'];
  detailForm: CRUDProps<T>['detailForm'];
}) {
  return (
    <ModalForm
      title="新增"
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

function CRUD<T extends Record<string, any>>({
  title,
  columns,
  request,
  detailForm,
  requestAdd,
  requestDelete,
}: CRUDProps<T>) {
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
              console.log('delete');
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

  const handleRequest = useCallback(async () => {
    const res = await request();
    return {
      data: res.data,
      success: true,
      total: res.data.length,
    };
  }, [request]);

  return (
    <div className="p-6">
      <ProTable<T>
        headerTitle={title}
        actionRef={actionRef}
        rowKey="id"
        columns={newColumns}
        request={handleRequest}
        search={false}
        toolBarRender={() => [
          <Add key="add" actionRef={actionRef} requestAdd={requestAdd} detailForm={detailForm} />,
        ]}
      />
    </div>
  );
}

export { CRUD };
