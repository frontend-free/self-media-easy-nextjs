'use client';

import * as AccountActions from '@/app/actions/account_actions';
import { CRUD } from '@/components/crud';
import { LoadingButton } from '@/components/loading_button';
import { CheckLogs } from '@/components/logs';
import { Platform } from '@/components/platform';
import {
  EnumAccountStatus,
  EnumPlatform,
  listPlatform,
  valueEnumPlatform,
} from '@/generated/enums';
import { Account, AccountStatus } from '@/generated/prisma';
import { ProFormText } from '@ant-design/pro-components';
import { App, Button, Modal } from 'antd';
import { useRef, useState } from 'react';
import { useAuth } from './use_auth';

function Add({ refCRUD }) {
  const [open, setOpen] = useState(false);

  const { onAuth } = useAuth();

  return (
    <>
      <Modal
        title="添加账号"
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        footer={null}
      >
        <div className="flex flex-row flex-wrap gap-2 p-10">
          {listPlatform.map((item) => (
            <div
              key={item.value}
              className="flex w-[100px] cursor-pointer flex-col items-center gap-2"
              onClick={async () => {
                await onAuth({ platform: item.value });
                setOpen(false);
                refCRUD.current?.reload();
              }}
            >
              <Platform value={item.value} size={50} />
              <div>{item.label}</div>
              <div className="text-sm text-gray-500">{item.originData.desc}</div>
            </div>
          ))}
        </div>
      </Modal>
      <Button type="primary" onClick={() => setOpen(true)}>
        添加账号
      </Button>
    </>
  );
}

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);
  const { modal } = App.useApp();

  const { onAuth, onAuthCheck } = useAuth();

  return (
    <CRUD<Account>
      ref={refCRUD}
      columns={[
        {
          title: '平台',
          dataIndex: 'platform',
          hidden: true,
          valueEnum: valueEnumPlatform,
          search: true,
        },
        {
          title: '平台账号',
          dataIndex: 'platformName',
          search: true,
          render: (_, record: Account) => (
            <Platform
              name={record.platformName || ''}
              value={record.platform as EnumPlatform}
              status={record.status as AccountStatus}
            />
          ),
        },
        {
          title: '授权时间',
          dataIndex: 'authedAt',
          valueType: 'dateTime',
        },
      ]}
      detailForm={() => (
        <div>
          <ProFormText name="id" label="ID" hidden />
        </div>
      )}
      request={async (params) => {
        return await AccountActions.pageAccounts(params);
      }}
      disabledCreate
      disabledUpdate
      deleteButtonText="取消授权"
      requestDelete={async (id) => {
        return await AccountActions.deleteAccount(id);
      }}
      toolBarRenderPre={<Add refCRUD={refCRUD} />}
      renderOperate={({ record }) => {
        return (
          <>
            {record.status !== EnumAccountStatus.AUTHED ? (
              <LoadingButton
                type="link"
                className="!px-0"
                onClick={async () => {
                  await onAuth({ platform: record.platform as EnumPlatform });
                  refCRUD.current?.reload();
                }}
              >
                重新授权
              </LoadingButton>
            ) : (
              <LoadingButton
                type="link"
                className="!px-0"
                onClick={async () => {
                  await onAuthCheck({
                    id: record.id,
                    platform: record.platform,
                    authInfo: record.authInfo,
                    status: record.status,
                  });
                  refCRUD.current?.reload();
                }}
              >
                检查授权
              </LoadingButton>
            )}
            <CheckLogs value={record.logs} />
          </>
        );
      }}
    />
  );
}

export default Page;
