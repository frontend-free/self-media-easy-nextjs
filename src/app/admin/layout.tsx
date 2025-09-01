'use client';

import { AppMenu } from '@/components/menu';
import { UserOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

const menuItems = [
  {
    key: '/admin/users',
    label: '用户列表',
    icon: <UserOutlined />,
  },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="flex h-screen w-screen bg-gray-200">
      <div className="flex h-full w-[220px] flex-col gap-2">
        <div className="h-5"></div>
        <div className="text-center text-2xl font-bold">Admin</div>
        <Button onClick={() => router.push('/')}>返回</Button>
        <div className="flex-1">
          <AppMenu items={menuItems} />
        </div>
        <div></div>
      </div>

      <div className="flex flex-1 flex-col p-2">
        <div className="flex-1 overflow-y-auto rounded-md bg-white p-4">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
