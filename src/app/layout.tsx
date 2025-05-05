import * as AuthAction from '@/app/actions/auth_action';
import { AdminComponent, AuthComponent } from '@/app/components/auth_component';
import { AutoRunComponent } from '@/app/components/auto_run';
import { UserAvatar } from '@/app/components/avatar';
import { AppMenu } from '@/app/components/menu';
import { UserDropdown } from '@/app/components/user_dropdown';
import { ErrorComponent } from '@/app/lib/error';
import { initDatabase } from '@/app/lib/init_db';
import '@ant-design/v5-patch-for-react-19';

import {
  HomeOutlined,
  RightOutlined,
  SendOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Version } from './components/version';
import './globals.css';

// 初始化数据库
initDatabase().catch(console.error);

export const metadata: Metadata = {
  title: '驾K先锋',
  description: '驾K先锋',
};

const Icon = async () => {
  const user = await AuthAction.getUser();

  return (
    <div className="p-2 pl-4">
      <div className="flex gap-2 items-center cursor-pointer">
        <Link href="/" className="flex flex-1 gap-2 items-center">
          <UserAvatar size={30} src={user?.avatar || undefined} />
          <div className="flex-1 text-black">{user?.nickname || user?.name}</div>
        </Link>
        <UserDropdown>
          <div>
            <RightOutlined className="text-xs" />
          </div>
        </UserDropdown>
      </div>
    </div>
  );
};

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
    key: '/tag_coach',
    label: '教练',
    icon: <UserOutlined />,
  },
  {
    key: '/task',
    label: (
      <div className="flex items-center gap-2">
        <UnorderedListOutlined />
        <div>任务</div>

        <AutoRunComponent />
      </div>
    ),
  },
];

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider locale={zhCN}>
            <App>
              <ErrorComponent />
              <AdminComponent element={children}>
                <AuthComponent element={children}>
                  <div className="h-screen w-screen flex bg-gray-200">
                    <div className="w-[220px] h-full flex flex-col gap-2">
                      <div className="h-5"></div>
                      <Icon />
                      <div className="flex-1 flex flex-col">
                        <div className="flex-1">
                          <AppMenu items={menuItems} />
                        </div>
                        <Version />
                      </div>
                      <div></div>
                    </div>

                    <div className="flex-1 p-2 flex flex-col">
                      <div className="bg-white rounded-md flex-1 p-4">{children}</div>
                    </div>
                  </div>
                </AuthComponent>
              </AdminComponent>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

export default RootLayout;
