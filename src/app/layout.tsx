import { AuthComponent } from '@/app/components/auth';
import { AutoRunComponent } from '@/app/components/auto_run';
import { AppMenu } from '@/app/components/menu';
import { AdminPathComponent, AuthPathComponent } from '@/app/components/path';
import { UserInfo } from '@/app/components/user_info';
import { ErrorComponent } from '@/app/lib/error';
import { initDatabase } from '@/app/lib/init_db';

import '@ant-design/v5-patch-for-react-19';

import {
  HomeOutlined,
  SendOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Version } from './components/version';
import './globals.css';

// 初始化数据库
initDatabase().catch(console.error);

export const metadata: Metadata = {
  title: '驾K先锋-多媒体',
  description: '',
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
  // {
  //   key: '/tag_coach',
  //   label: '教练',
  //   icon: <UserOutlined />,
  // },
  {
    key: '/task',
    label: (
      <div className="flex items-center gap-2">
        <UnorderedListOutlined />
        <div>发布任务</div>
        <AuthComponent>
          <AutoRunComponent />
        </AuthComponent>
      </div>
    ),
  },
  {
    key: '/auto_publish',
    label: '自动发布设置',
    icon: <SettingOutlined />,
  },
];

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex bg-gray-200">
      <div className="w-[220px] h-full flex flex-col gap-2">
        <div></div>
        <UserInfo />
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <AppMenu items={menuItems} />
          </div>
          <Version />
        </div>
        <div></div>
      </div>

      <div className="flex-1 p-2 flex flex-col ">
        <div className="bg-white rounded-md flex-1 p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function WrapRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider locale={zhCN}>
            <SessionProvider>
              <App>
                <ErrorComponent />
                <AdminPathComponent element={children}>
                  <AuthPathComponent element={children}>
                    <RootLayout>{children}</RootLayout>
                  </AuthPathComponent>
                </AdminPathComponent>
              </App>
            </SessionProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

export default WrapRootLayout;
