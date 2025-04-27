'use client';

import { HomeOutlined, ScheduleOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  {
    key: '/home',
    label: '首页',
    icon: <HomeOutlined />,
  },
  {
    key: '/publish',
    label: '发布',
    icon: <SendOutlined />,
  },
  {
    key: '/account',
    label: '账号',
    icon: <UserOutlined />,
  },
  {
    key: '/schedule',
    label: '任务',
    icon: <ScheduleOutlined />,
  },
];

function AppMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const selectedKeys = menuItems.filter((item) => item.key === pathname).map((item) => item.key);

  return (
    <Menu
      className="!bg-transparent h-full !border-r-0"
      selectedKeys={selectedKeys}
      items={menuItems}
      onClick={(e) => {
        router.push(e.key);
      }}
    />
  );
}

export { AppMenu };
