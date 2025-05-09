'use client';

import * as AuthAction from '@/app/actions/auth_action';
import { User } from '@/generated/prisma';

import { RightOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserAvatar } from './avatar';

function UserDropdown({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await AuthAction.logout();

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    AuthAction.getUser().then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <div className="p-2 pl-4">
      <UserDropdown>
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
    </div>
  );
};

export { UserInfo };
