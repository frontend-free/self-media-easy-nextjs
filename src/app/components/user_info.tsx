'use client';

import * as AuthActions from '@/app/actions/auth_actions';
import * as UserActions from '@/app/actions/user_actions';
import { User } from '@/generated/prisma';

import { RightOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { App, Dropdown, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserAvatar } from './avatar';
import { handleFinish } from './crud';

function UserDropdown({
  user,
  children,
  setShow,
}: {
  user?: User;
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
          user?.isAdmin && {
            key: 'user_manage',
            label: '用户管理',
            onClick: () => {
              router.push('/admin/users');
            },
          },
        ].filter(Boolean) as MenuProps['items'],
      }}
    >
      {children}
    </Dropdown>
  );
}

const UserInfo = () => {
  const [show, setShow] = useState(false);
  const { message } = App.useApp();

  const [user, setUser] = useState<User | undefined>(undefined);

  async function getUser() {
    const { success, data, message: errorMessage } = await AuthActions.getUser();

    if (!success) {
      throw new Error(errorMessage || '获取用户信息失败');
    }

    setUser(data);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="p-2 pl-4">
      <UserDropdown setShow={setShow} user={user}>
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
            const { success, message: errorMessage } = await UserActions.updateUser(values);

            if (!success) {
              throw new Error(errorMessage || '修改失败');
            }

            message.success('修改成功');
            getUser();
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
