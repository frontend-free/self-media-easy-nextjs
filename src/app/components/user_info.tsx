'use client';

import * as AuthActions from '@/app/actions/auth_actions';
import * as UserActions from '@/app/actions/user_actions';
import { User } from '@/generated/prisma';

import { RightOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { App, Dropdown } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserAvatar } from './avatar';
import { handleFinish } from './crud';
import { useGlobalSWR } from './use_global_swr';

function UserDropdown({
  children,
  setShow,
}: {
  children: React.ReactNode;
  setShow: (show: boolean) => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await AuthActions.logout();

    router.push('/auth/login');
    window.location.reload();
  };

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{
        items: [
          {
            key: `info`,
            label: '修改信息',
            onClick: () => {
              setShow(true);
            },
          },
          {
            key: 'logout',
            label: '退出',
            onClick: handleLogout,
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  );
}

const UserInfo = () => {
  const [show, setShow] = useState(false);
  const { message } = App.useApp();

  const { data: res, mutate } = useGlobalSWR('AuthActions.getUser', async () => {
    return await AuthActions.getUser();
  });

  const user = res?.data as User | undefined;

  return (
    <div className="p-2 pl-4">
      <UserDropdown setShow={setShow}>
        <div className="flex gap-2 items-center cursor-pointer">
          <div className="flex flex-1 gap-2 items-center">
            <UserAvatar size={30} src={user?.avatar || undefined} />
            <div className="flex-1 text-black">{user?.nickname || user?.name}</div>
          </div>
          <div>
            <RightOutlined className="text-xs" />
          </div>
        </div>
      </UserDropdown>
      {show && (
        <ModalForm
          title="信息"
          open={show}
          onOpenChange={setShow}
          initialValues={user || {}}
          onFinish={handleFinish(async (values) => {
            await UserActions.updateUser(values);

            message.success('修改成功');

            mutate();

            return true;
          })}
          modalProps={{
            destroyOnClose: true,
          }}
        >
          <ProFormText name="id" hidden />
          <ProFormText name="nickname" label="昵称" />
          <ProFormText.Password name="oldPassword" label="旧密码" />
          <ProFormText.Password name="password" label="密码" />
        </ModalForm>
      )}
    </div>
  );
};

export { UserInfo };
