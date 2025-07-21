import type { ProColumns } from '@ant-design/pro-components';
import type { ReactNode, RefObject } from 'react';

interface CRUDProps<T> {
  ref?: RefObject<{ reload: () => void } | undefined>;

  rowKey?: string;
  title: string;
  columns: ProColumns<T>[];
  detailForm?: (props: { type: 'create' | 'update' }) => ReactNode;
  request: (params: { current: number; pageSize: number } & Record<string, any>) => Promise<{
    success: boolean;
    data: T[];
    total: number;
  }>;
  disabledCreate?: boolean;
  requestCreate?: (createValues: Partial<T>) => Promise<void>;
  disabledDelete?: boolean;
  requestDelete?: (id: string, data: T) => Promise<void>;
  disabledUpdate?: boolean;
  requestDetail?: (id: string, data: T) => Promise<T>;
  requestUpdate?: (updateValues: Partial<T> & { id: string }) => Promise<void>;

  toolBarRenderPre?: ReactNode;
  renderOperate?: (params: { record: T }) => ReactNode;

  enableBatchDelete?: boolean;
  requestDeletes?: (ids: string[], datas: T[]) => Promise<void>;
}

export type { CRUDProps };
