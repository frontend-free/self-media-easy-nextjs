'use client';

import { handleRequestRes } from '@/lib/request';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
  ProTableProps,
} from '@ant-design/pro-components';
import { ModalForm, ProForm } from '@ant-design/pro-components';
import { useDebounceFn, useUpdateEffect } from 'ahooks';
import { App, Button } from 'antd';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { Fragment, RefObject, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { LoadingButton } from '../loading_button';
import './style.scss';
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
  createButtonText,
}: {
  actionRef: RefObject<ActionType | undefined>;
  requestCreate: CRUDProps<T>['requestCreate'];
  detailForm: CRUDProps<T>['detailForm'];
  createButtonText: CRUDProps<T>['createButtonText'];
}) {
  const { message } = App.useApp();

  return (
    <ModalForm
      title={createButtonText}
      autoFocusFirstInput
      trigger={<Button type="primary">{createButtonText}</Button>}
      onFinish={handleFinish(async (values) => {
        handleRequestRes(await requestCreate!(values as T));

        message.success('新建成功');

        actionRef.current?.reload();

        return true;
      })}
      modalProps={{
        destroyOnHidden: true,
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
        await handleRequestRes(res);

        formRef.current?.setFieldsValue(res?.data);
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
        handleRequestRes(await requestUpdate!(values as Partial<T> & { id: string }));

        message.success('修改成功');

        actionRef.current?.reload();

        return true;
      })}
      modalProps={{
        destroyOnHidden: true,
      }}
      onOpenChange={handleOpenChange}
    >
      {detailForm && detailForm({ type: 'update' })}
    </ModalForm>
  );
}

function useSearch() {
  const [form] = ProForm.useForm();

  const values = ProForm.useWatch([], form);

  const valuesString = useMemo(() => {
    return JSON.stringify(values || {});
  }, [values]);

  const doSearch = useDebounceFn(
    () => {
      form.submit();
    },
    {
      wait: 500,
    },
  );

  useUpdateEffect(() => {
    doSearch.run(values);
  }, [valuesString]);

  return { form };
}

function CRUD<T extends Record<string, any>>({
  ref,
  rowKey,
  columns,
  request,
  detailForm,

  disabledCreate,
  createButtonText = '新建',
  requestCreate,

  disabledDelete,
  deleteButtonText = '删除',
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

  const operateColumns = useMemo(() => {
    return [
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
                  title: `确定${deleteButtonText}吗？`,
                  onOk: async () => {
                    handleRequestRes(await requestDelete!(record.id, record));

                    message.success(`${deleteButtonText}成功`);
                    actionRef.current?.reload();
                  },
                });
              }}
            >
              {deleteButtonText}
            </LoadingButton>
          ),
        ],
      },
    ].filter(Boolean) as ProColumns<T>[];
  }, [
    deleteButtonText,
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

  const newColumns: ProColumns<T>[] = useMemo(() => {
    return [
      ...columns.map((column) => ({
        search: false,
        ...column,
      })),
      ...operateColumns,
    ]
      .filter(Boolean)
      .map((column) => {
        if (column.search) {
          return {
            // 隐藏 label
            formItemProps: {
              label: '',
            },
            // 设置 placeholder
            fieldProps: {
              placeholder:
                column.valueType === 'select' ? `选择${column.title}` : `输入${column.title}`,
              ...column.fieldProps,
            },
            ...column,
          };
        }
        return column;
      }) as ProColumns<T>[];
  }, [columns, operateColumns]);

  const handleRequest = useCallback(
    async (params) => {
      const res = await request(params);
      await handleRequestRes(res);

      const data = res.data;
      return {
        data: data?.data || [],
        total: data?.total || 0,
        success: true,
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
          handleRequestRes(
            await requestDeletes(
              selectedRows.map((item) => item.id),
              selectedRows,
            ),
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

  const { form } = useSearch();

  return (
    <div className={classNames('cb-custom-crud')}>
      <ProTable<T>
        cardBordered={false}
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
              createButtonText={createButtonText}
              requestCreate={requestCreate}
              detailForm={detailForm}
            />
          ),
        ]}
        options={false}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          optionRender: (searchConfig, props, dom) => {
            return [...dom.slice(1)];
          },
          form,
        }}
        scroll={getTableScroll(newColumns)}
        rowSelection={rowSelection}
        tableAlertRender={tableAlertRender}
        tableAlertOptionRender={tableAlertOptionRender}
      />
    </div>
  );
}

export { CRUD, handleFinish };
export type { CRUDProps };
