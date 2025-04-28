'use client';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
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
  detailForm: (props: { type: 'create' | 'update' }) => ReactNode;
  request: (params: { current: number; pageSize: number } & P) => Promise<{
    success: boolean;
    data: T[];
    total: number;
  }>;
  disabledCreate?: boolean;
  requestCreate: (createValues: Partial<T>) => Promise<void>;
  disabledDelete?: boolean;
  requestDelete: (id: string, data: T) => Promise<void>;
  disabledUpdate?: boolean;
  requestDetail: (id: string, data: T) => Promise<T>;
  requestUpdate: (updateValues: Partial<T> & { id: string }) => Promise<void>;
}

function Add<T, P>({
  actionRef,
  requestCreate,
  detailForm,
}: {
  actionRef: RefObject<ActionType | undefined>;
  requestCreate: CRUDProps<T, P>['requestCreate'];
  detailForm: CRUDProps<T, P>['detailForm'];
}) {
  return (
    <ModalForm
      title="新增"
      autoFocusFirstInput
      trigger={<Button type="primary">新增</Button>}
      onFinish={async (values) => {
        await requestCreate(values as T);

        message.success('新增成功');

        actionRef.current?.reload();

        return true;
      }}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      {detailForm({ type: 'create' })}
    </ModalForm>
  );
}

function Update<T, P>({
  data,
  actionRef,
  requestDetail,
  requestUpdate,
  detailForm,
}: {
  data: T;
  actionRef: RefObject<ActionType | undefined>;
  requestDetail: CRUDProps<T, P>['requestDetail'];
  requestUpdate: CRUDProps<T, P>['requestUpdate'];
  detailForm: CRUDProps<T, P>['detailForm'];
}) {
  const formRef = useRef<ProFormInstance | null>(null);

  const handleOpenChange = useCallback(
    async (open: boolean) => {
      if (open) {
        const id = (data as any).id;

        const res = await requestDetail(id, data);
        formRef.current?.setFieldsValue(res);
      }
    },
    [data, requestDetail],
  );

  return (
    <ModalForm
      title="修改"
      formRef={formRef}
      autoFocusFirstInput
      trigger={<Button type="link" icon={<EditOutlined />} />}
      onFinish={async (values) => {
        await requestUpdate(values as Partial<T> & { id: string });

        message.success('修改成功');

        actionRef.current?.reload();

        return true;
      }}
      modalProps={{
        destroyOnClose: true,
      }}
      onOpenChange={handleOpenChange}
    >
      {detailForm({ type: 'update' })}
    </ModalForm>
  );
}

function CRUD<T extends Record<string, any>, P extends Record<string, any>>({
  title,
  columns,
  request,
  detailForm,
  disabledCreate,
  requestCreate,
  disabledDelete,
  requestDelete,
  disabledUpdate,
  requestDetail,
  requestUpdate,
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
          !disabledDelete && (
            <Button
              key="edit"
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                modal.confirm({
                  title: '确定删除吗？',
                  onOk: async () => {
                    await requestDelete(record.id, record);
                    message.success('删除成功');
                    actionRef.current?.reload();
                  },
                });
              }}
            />
          ),
          !disabledUpdate && (
            <Update
              key="update"
              data={record}
              actionRef={actionRef}
              requestDetail={requestDetail}
              requestUpdate={requestUpdate}
              detailForm={detailForm}
            />
          ),
        ],
      },
    ];
  }, [
    columns,
    detailForm,
    disabledDelete,
    disabledUpdate,
    modal,
    requestDelete,
    requestDetail,
    requestUpdate,
  ]);

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
        !disabledCreate && (
          <Add<T, P>
            key="add"
            actionRef={actionRef}
            requestCreate={requestCreate}
            detailForm={detailForm}
          />
        ),
      ]}
      options={false}
      search={{
        labelWidth: 'auto',
      }}
    />
  );
}

export { CRUD };
