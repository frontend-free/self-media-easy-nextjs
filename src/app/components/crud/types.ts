import { PageResult, ServerActionResult } from '@/app/actions/helper';
import type { ProColumns } from '@ant-design/pro-components';
import type { ReactNode, RefObject } from 'react';

interface CRUDProps<T> {
  ref?: RefObject<{ reload: () => void } | undefined>;

  rowKey?: string;
  columns: ProColumns<T>[];

  request: (
    params: { current: number; pageSize: number } & Record<string, any>,
  ) => Promise<ServerActionResult<PageResult<T>>>;

  detailForm?: (props: { type: 'create' | 'update' }) => ReactNode;

  disabledCreate?: boolean;
  requestCreate?: (createValues: Partial<T>) => Promise<ServerActionResult<void>>;
  disabledDelete?: boolean;
  deleteButtonText?: string;
  requestDelete?: (id: string, data: T) => Promise<ServerActionResult<void>>;
  disabledUpdate?: boolean;
  requestDetail?: (id: string, data: T) => Promise<ServerActionResult<T>>;
  requestUpdate?: (updateValues: Partial<T> & { id: string }) => Promise<ServerActionResult<void>>;

  toolBarRenderPre?: ReactNode;
  renderOperate?: (params: { record: T }) => ReactNode;

  enableBatchDelete?: boolean;
  requestDeletes?: (ids: string[], datas: T[]) => Promise<ServerActionResult<void>>;
}

export type { CRUDProps };
