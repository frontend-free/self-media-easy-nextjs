'use client';

import { electronApi } from '@/electron';
import {
  EnumAccountStatus,
  EnumPlatform,
  listPlatform,
  valueEnumAccountStatus,
  valueEnumPlatform,
} from '@/generated/enums';
import { Account } from '@/generated/prisma';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { App, Button, Modal } from 'antd';
import { useRef, useState } from 'react';
import * as AccountAction from '../actions/account_action';
import { createAccount } from '../actions/account_action';
import * as TagCoachAction from '../actions/tag_coach_action';
import { CRUD } from '../components/crud';
import { Platform, PlatformWithName } from '../components/platform';

function Add({ refCRUD }) {
  const [open, setOpen] = useState(false);

  const { modal, message } = App.useApp();

  const handleAuth = async (item) => {
    const platform = item.value;

    const res = await electronApi.platformAuth({ platform });

    if (res.success && res.data) {
      await createAccount({
        platform,
        platformId: res.data.platformId || null,
        platformName: res.data.platformName || null,
        platformAvatar: res.data.platformAvatar || null,

        status: EnumAccountStatus.AUTHED,
        authInfo: res.data.authInfo || null,
        authedAt: new Date(),
        logs: JSON.stringify(res.data.logs || []),
      } as AccountAction.CreateAccountInput);

      message.success('授权成功');
    } else {
      modal.error({
        title: '授权失败',
        content: (
          <div>
            <div>{res.message || '未知错误'}</div>
            <pre className="whitespace-pre-wrap">{JSON.stringify(res.data, null, 2)}</pre>
          </div>
        ),
      });
    }

    setOpen(false);
    refCRUD.current?.reload();
  };

  return (
    <>
      <Modal title="账号" open={open} onCancel={() => setOpen(false)} destroyOnClose footer={null}>
        <div className="flex flex-row flex-wrap gap-4 p-10">
          {listPlatform.map((item) => (
            <div
              key={item.value}
              className="flex flex-col items-center cursor-pointer gap-1"
              onClick={() => {
                handleAuth(item);
              }}
            >
              <Platform value={item.value} />
              {item.label}
            </div>
          ))}
        </div>
      </Modal>
      <Button type="primary" id="authBtn" onClick={() => setOpen(true)}>
        新增
      </Button>
    </>
  );
}

function Page() {
  const refCRUD = useRef<any | undefined>(undefined);
  const { modal } = App.useApp();

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
          title: '所属教练',
          dataIndex: 'tagCoach',
          // @ts-expect-error 暂时不知道如何解决
          render: (_, record: Account) => record.tagCoach?.name,
        },
      ]}
      detailForm={() => (
        <div>
          <ProFormText name="id" label="ID" hidden />
          <ProFormSelect
            name="tagCoachId"
            label="所属教练"
            request={async () => {
              const res = await TagCoachAction.pageTagCoaches({
                pageSize: 100,
                current: 1,
              });
              return res.data.map((item) => ({
                label: item.name,
                value: item.id,
              }));
            }}
          />
        </div>
      )}
      request={async (params) => {
        const res = await AccountAction.pageAccounts(params);
        return res;
      }}
      disabledCreate
      requestDelete={async (id) => {
        await AccountAction.deleteAccount(id);
      }}
      requestDetail={async (id) => {
        const res = await AccountAction.getAccountById(id);
        return res;
      }}
      requestUpdate={async (values) => {
        await AccountAction.updateAccount(values as AccountAction.UpdateAccountInput);
      }}
      toolBarRenderPre={<Add refCRUD={refCRUD} />}
      renderOperate={({ record }) => {
        return (
          <>
            {record.status !== EnumAccountStatus.AUTHED && (
              <Button
                type="link"
                className="!px-0"
                onClick={() => {
                  (document.querySelector('#authBtn') as HTMLButtonElement)?.click();
                }}
              >
                重新授权
              </Button>
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

export default Page;
