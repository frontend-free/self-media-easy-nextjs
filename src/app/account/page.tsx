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
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useAuth } from './use_auth';

function Add({ refCRUD }) {
  const { onAuth } = useAuth();

  return (
    <div className="c-border-bottom p-4">
      <div className="text-lg">添加账号</div>
      <div className="flex gap-2 overflow-x-auto">
        {listPlatform.map((item) => (
          <Tooltip key={item.value} title={item.originData.desc}>
            <div
              className="flex cursor-pointer flex-col items-center gap-2"
              onClick={async () => {
                await onAuth({ platform: item.value });

                refCRUD.current?.reload();
              }}
            >
              <Platform value={item.value} size={50} />
              <div>{item.label}</div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);

  const { onAuth, onAuthCheck } = useAuth();

  return (
    <div>
      <Add refCRUD={refCRUD} />

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
            render: (_, record) => {
              return dayjs(record.authedAt).format('MM-DD HH:mm');
            },
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
    </div>
  );
}

export default Page;
