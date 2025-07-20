'use client';

import type { ActionType } from '@ant-design/pro-components';
import { App } from 'antd';
import type { RefObject } from 'react';
import { useCallback, useMemo } from 'react';
import { LoadingButton } from '../loading_button';

function useRowSelection({
  batchActions,
  actionRef,
}: {
  batchActions?: any;
  actionRef?: RefObject<ActionType | undefined>;
}) {
  const { modal } = App.useApp();
  const rowSelection = useMemo(() => ({}), []);

  const tableAlertRender = useCallback(({ selectedRowKeys, onCleanSelected }) => {
    return (
      <div>
        <span>
          已选 {selectedRowKeys.length} 项
          <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
            取消选择
          </a>
        </span>
      </div>
    );
  }, []);

  const tableAlertOptionRender = useCallback(
    ({ selectedRowKeys, selectedRows }) => {
      return (
        <div className="flex gap-2 items-center">
          {batchActions?.map((action) => (
            <LoadingButton
              key={action.btnText}
              type="link"
              danger={action.danger}
              className="!px-0"
              onClick={async (event) => {
                if (action.danger) {
                  await new Promise((resolve) => {
                    modal.confirm({
                      title: `确定要执行 ${action.btnText} 吗？`,
                      onOk: () => {
                        resolve(
                          action.onClick(event, {
                            selectedRowKeys,
                            selectedRows,
                          }),
                        );
                      },
                      onCancel: () => {
                        resolve(undefined);
                      },
                    });
                  });
                } else {
                  await action.onClick(event, {
                    selectedRowKeys,
                    selectedRows,
                  });
                }

                actionRef?.current?.reload();
              }}
            >
              {action.btnText}
            </LoadingButton>
          ))}
        </div>
      );
    },
    [actionRef, batchActions],
  );

  if (!batchActions || batchActions.length === 0) {
    return {
      rowSelection: undefined,
      tableAlertRender: undefined,
      tableAlertOptionRender: undefined,
    };
  }

  return {
    rowSelection,
    tableAlertRender,
    tableAlertOptionRender,
  };
}

export { useRowSelection };
