'use client';

import { electronApi } from '@/electron';
import {
  EnumAccountStatus,
  listPlatform,
  valueEnumAccountStatus,
  valueEnumPlatform,
} from '@/generated/enums';
import { Account } from '@/generated/prisma';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { App, Button, Modal } from 'antd';
import Image from 'next/image';
import { useRef, useState } from 'react';
import * as AccountAction from '../actions/account_action';
import * as TagCoachAction from '../actions/tag_coach_action';
import { CRUD } from '../components/crud';

function Add({ refCRUD }) {
  const [open, setOpen] = useState(false);

  const { modal, message } = App.useApp();

  const handleAuth = async (item) => {
    const platform = item.value;

    const res = await electronApi.platformAuth({ platform });

    if (res.success && res.data) {
      await AccountAction.createAccount({
        platform,
        platformId: res.data.platformId || null,
        platformName: res.data.platformName || null,
        platformAvatar: res.data.platformAvatar || null,

        status: EnumAccountStatus.AUTHED,
        authInfo: res.data.authInfo || null,
        authedAt: new Date(),
        logs: JSON.stringify(res.data.logs || []),
      });

      message.success('授权成功');
      refCRUD.current?.reload();
    } else {
      modal.error({
        title: '授权失败',
        content: res.message || '未知错误',
      });
    }

    setOpen(false);
  };

  return (
    <>
      <Modal
        title="新增账号"
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={null}
      >
        <div className="flex flex-row flex-wrap gap-4 p-10">
          {listPlatform.map((item) => (
            <div
              key={item.value}
              className="flex flex-row items-center cursor-pointer"
              onClick={() => {
                handleAuth(item);
              }}
            >
              <Image src={item.originData.icon} alt={item.label} width={50} height={50} />
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

  return (
    <CRUD<Account>
      ref={refCRUD}
      title="账号"
      columns={[
        {
          title: '平台',
          dataIndex: 'platform',
          valueEnum: valueEnumPlatform,
        },
        {
          title: '平台账号',
          dataIndex: 'platformName',
        },
        {
          title: '状态',
          dataIndex: 'status',
          valueEnum: valueEnumAccountStatus,
        },
        {
          title: '授权时间',
          dataIndex: 'authedAt',
          valueType: 'dateTime',
          search: false,
        },
        {
          title: '所属教练',
          dataIndex: 'tagCoach',
          // @ts-expect-error 暂时不知道如何解决
          render: (_, record: Account) => record.tagCoach?.name,
        },
        {
          title: '创建时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          valueType: 'dateTime',
          search: false,
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
    />
  );
}

export default Page;
