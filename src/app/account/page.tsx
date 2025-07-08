'use client';

import {
  EnumAccountStatus,
  EnumPlatform,
  listPlatform,
  valueEnumAccountStatus,
  valueEnumPlatform,
} from '@/generated/enums';
import { Account, AccountStatus } from '@/generated/prisma';
import { ProFormText } from '@ant-design/pro-components';
import { Alert, App, Button, Modal } from 'antd';
import { useRef, useState } from 'react';
import * as AccountActions from '../actions/account_actions';
import { CRUD } from '../components/crud';
import { LoadingButton } from '../components/loading_button';
import { Platform, PlatformWithName } from '../components/platform';
import { useAuth } from './use_auth';

function Add({ refCRUD }) {
  const [open, setOpen] = useState(false);

  const { onAuth } = useAuth();

  return (
    <>
      <Modal title="账号" open={open} onCancel={() => setOpen(false)} destroyOnClose footer={null}>
        <Alert message="不要异地登录，容易掉线！" type="warning" />
        <div className="flex flex-row flex-wrap gap-2 p-10 ">
          {listPlatform.map((item) => (
            <div
              key={item.value}
              className="flex flex-col items-center cursor-pointer gap-2 w-[100px]"
              onClick={async () => {
                await onAuth({ platform: item.value });
                setOpen(false);
                refCRUD.current?.reload();
              }}
            >
              <Platform value={item.value} />
              <div>{item.label}</div>
              <div className="text-sm text-gray-500">{item.originData.desc}</div>
            </div>
          ))}
        </div>
      </Modal>
      <Button type="primary" onClick={() => setOpen(true)}>
        新增
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
      title="账号"
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
            <PlatformWithName
              name={record.platformName || ''}
              value={record.platform as EnumPlatform}
              status={record.status as AccountStatus}
            />
          ),
        },
        {
          title: '状态',
          dataIndex: 'status',
          valueEnum: valueEnumAccountStatus,
          search: true,
        },
        {
          title: '授权时间',
          dataIndex: 'authedAt',
          valueType: 'dateTime',
        },
        {
          title: '学员ID',
          dataIndex: 'studentId',
        },
      ]}
      detailForm={() => (
        <div>
          <ProFormText name="id" label="ID" hidden />
          <ProFormText name="studentId" label="学员ID" />
        </div>
      )}
      request={async (params) => {
        const res = await AccountActions.pageAccounts(params);
        return res;
      }}
      disabledCreate
      requestUpdate={async (values) => {
        await AccountActions.updateAccount(values);
      }}
      requestDelete={async (id) => {
        await AccountActions.deleteAccount(id);
      }}
      requestDetail={async (id) => {
        const res = await AccountActions.getAccountById(id);
        return res;
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
            <Button
              type="link"
              className="!px-0"
              onClick={() => {
                modal.info({
                  title: '日志',
                  width: 800,
                  content: (
                    <div>
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(record.logs || ''), null, 2).replace(
                          /\\n/g,
                          '\n',
                        )}
                      </pre>
                    </div>
                  ),
                });
              }}
            >
              查看日志
            </Button>
          </>
        );
      }}
    />
  );
}

export { useAuth };

export default Page;
