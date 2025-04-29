'use client';

import { electronApi } from '@/electron';
import {
  EnumPlatform,
  listPlatform,
  valueEnumAccountStatus,
  valueEnumPlatform,
} from '@/generated/enums';
import { Account } from '@/generated/prisma';
import { PlusCircleOutlined } from '@ant-design/icons';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import Image from 'next/image';
import { useState } from 'react';
import * as AccountAction from '../actions/account_action';
import * as TagCoachAction from '../actions/tag_coach_action';
import { CRUD } from '../components/crud';

function Add() {
  const [open, setOpen] = useState(false);
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
                electronApi.platformAuth(item.value);
              }}
            >
              <Image src={item.originData.icon} alt={item.label} width={50} height={50} />
            </div>
          ))}
        </div>
      </Modal>
      <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => setOpen(true)}>
        新增
      </Button>
    </>
  );
}

function Page() {
  return (
    <CRUD<Account, Partial<Pick<Account, 'name'>>>
      title="账号"
      columns={[
        {
          title: '账号',
          dataIndex: 'name',
        },
        {
          title: '所属教练',
          dataIndex: 'tagCoach',
          render: (_, record: Account) => record.tagCoach?.name,
        },
        {
          title: '平台',
          dataIndex: 'platform',
          valueEnum: valueEnumPlatform,
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
          <ProFormText name="name" label="用户名" required rules={[{ required: true }]} />
          <ProFormSelect
            name="type"
            label="平台"
            options={listPlatform}
            initialValue={EnumPlatform.TIKTOK}
            required
            rules={[{ required: true }]}
          />
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
      toolBarRenderPre={<Add />}
    />
  );
}

export default Page;
