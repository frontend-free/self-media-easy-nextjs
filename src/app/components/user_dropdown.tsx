'use client';

import * as AuthAction from '@/app/actions/auth_action';

import { Dropdown } from 'antd';
import { useRouter } from 'next/navigation';

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

export { UserDropdown };
