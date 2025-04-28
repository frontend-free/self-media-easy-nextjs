import { AppMenu } from '@/app/components/menu';
import { UserOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '驾K先锋',
  description: '驾K先锋',
};

const menuItems = [
  {
    key: '/admin/users',
    label: '用户列表',
    icon: <UserOutlined />,
  },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex bg-gray-200">
      <div className="w-[220px] h-full flex flex-col gap-2">
        <div className="h-5"></div>
        <div className="text-2xl font-bold text-center">Admin</div>
        <div className="flex-1">
          <AppMenu items={menuItems} />
        </div>
        <div></div>
      </div>

      <div className="flex-1 p-2 flex flex-col">
        <div className="bg-white rounded-md flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
