'use client';

import type {
  ActionType,
  ProColumns,
  ProFormInstance,
  ProTableProps,
} from '@ant-design/pro-components';
import { ModalForm } from '@ant-design/pro-components';
import { App, Button } from 'antd';
import dynamic from 'next/dynamic';
import { Fragment, RefObject, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { LoadingButton } from '../loading_button';
import type { CRUDProps } from './types';
import { useRowSelection } from './use_row_selection';

function handleFinish(onFinish) {
  return async (formData) => {
    try {
      const res = await onFinish(formData);
      return res;
    } catch (e) {
      setTimeout(() => {
        throw e;
      }, 0);
    }
  };
}

function getTableScroll(columns: ProTableProps<any, any>['columns'], defaultWidth = 120) {
  const scroll = { x: 0, y: undefined };

  columns?.forEach((column) => {
    if (!column.hideInTable && !column.hidden) {
      scroll.x += Number(column.width) || defaultWidth;
    }
  });

  return scroll;
}

const ProTable = dynamic(
  () => import('@ant-design/pro-components').then((mod) => mod.ProTable as any),
  {
    ssr: false,
  },
) as (typeof import('@ant-design/pro-components'))['ProTable'];

function Add<T>({
  actionRef,
  requestCreate,
  detailForm,
}: {
  actionRef: RefObject<ActionType | undefined>;
  requestCreate: CRUDProps<T>['requestCreate'];
  detailForm: CRUDProps<T>['detailForm'];
}) {
  const { message } = App.useApp();

  return (
    <ModalForm
      title="新增"
      autoFocusFirstInput
      trigger={<Button type="primary">新增</Button>}
      onFinish={handleFinish(async (values) => {
        await requestCreate!(values as T);

        message.success('新增成功');

        actionRef.current?.reload();

        return true;
      })}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      {detailForm && detailForm({ type: 'create' })}
    </ModalForm>
  );
}

function Update<T>({
  data,
  actionRef,
  requestDetail,
  requestUpdate,
  detailForm,
}: {
  data: T;
  actionRef: RefObject<ActionType | undefined>;
  requestDetail: CRUDProps<T>['requestDetail'];
  requestUpdate: CRUDProps<T>['requestUpdate'];
  detailForm: CRUDProps<T>['detailForm'];
}) {
  const formRef = useRef<ProFormInstance | null>(null);
  const { message } = App.useApp();

  const handleOpenChange = useCallback(
    async (open: boolean) => {
      if (open) {
        const id = (data as any).id;

        const res = await requestDetail?.(id, data);
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
      trigger={
        <Button type="link" className="!px-0">
          修改
        </Button>
      }
      onFinish={handleFinish(async (values) => {
        await requestUpdate!(values as Partial<T> & { id: string });

        message.success('修改成功');

        actionRef.current?.reload();

        return true;
      })}
      modalProps={{
        destroyOnClose: true,
      }}
      onOpenChange={handleOpenChange}
    >
      {detailForm && detailForm({ type: 'update' })}
    </ModalForm>
  );
}

function CRUD<T extends Record<string, any>>({
  ref,
  rowKey,
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
  toolBarRenderPre,
  renderOperate,
  enableBatchDelete,
  requestDeletes,
}: CRUDProps<T>) {
  const actionRef = useRef<ActionType | undefined>(undefined);

  useImperativeHandle(ref, () => ({
    reload: () => {
      actionRef.current?.reload();
    },
  }));

  const { modal, message } = App.useApp();

  const newColumns: ProColumns<T>[] = useMemo(() => {
    return [
      ...columns.map((column) => ({
        search: false,
        ...column,
      })),
      (!disabledDelete || !disabledUpdate || renderOperate) && {
        title: '操作',
        key: 'action',
        valueType: 'option',
        render: (_, record) => [
          <Fragment key="customOperate">{renderOperate?.({ record })}</Fragment>,
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
          !disabledDelete && (
            <LoadingButton
              key="edit"
              type="link"
              danger
              className="!px-0"
              onClick={() => {
                modal.confirm({
                  title: '确定删除吗？',
                  onOk: async () => {
                    await requestDelete!(record.id, record);
                    message.success('删除成功');
                    actionRef.current?.reload();
                  },
                });
              }}
            >
              删除
            </LoadingButton>
          ),
        ],
      },
    ].filter(Boolean) as ProColumns<T>[];
  }, [
    columns,
    detailForm,
    disabledDelete,
    disabledUpdate,
    message,
    modal,
    renderOperate,
    requestDelete,
    requestDetail,
    requestUpdate,
  ]);

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

  const batchActions = useMemo(() => {
    const bas: any[] = [];

    if (enableBatchDelete && requestDeletes) {
      const batchDeleteAction = {
        btnText: '批量删除',
        danger: true,
        onClick: async (_, { selectedRows }) => {
          await requestDeletes(
            selectedRows.map((item) => item.id),
            selectedRows,
          );
        },
      };
      bas.push(batchDeleteAction);
    }

    return bas;
  }, [enableBatchDelete, requestDeletes]);

  const { rowSelection, tableAlertRender, tableAlertOptionRender } = useRowSelection({
    batchActions,
    actionRef,
  });

  return (
    <ProTable<T>
      cardBordered
      headerTitle={title}
      actionRef={actionRef}
      rowKey={rowKey || 'id'}
      columns={newColumns}
      request={handleRequest}
      toolBarRender={() => [
        toolBarRenderPre,
        !disabledCreate && (
          <Add<T>
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
        defaultCollapsed: false,
      }}
      scroll={getTableScroll(newColumns)}
      rowSelection={rowSelection}
      tableAlertRender={tableAlertRender}
      tableAlertOptionRender={tableAlertOptionRender}
    />
  );
}

export { CRUD, handleFinish };
export type { CRUDProps };
