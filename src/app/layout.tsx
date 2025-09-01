import { AppMenu } from '@/app/components/menu';
import { AdminPathComponent, AuthPathComponent } from '@/app/components/path';
import { UserInfo } from '@/app/components/user_info';
import { ErrorComponent } from '@/app/lib/error';
import { initDatabase } from '@/app/lib/init_db';
import {
  HomeOutlined,
  SendOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { App, ConfigProvider, MenuProps } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { AutoRun } from './components/auto_run';
import { Version } from './components/version';
import { globalConfig } from './config';
import './globals.css';

// 初始化数据库
initDatabase().catch(console.error);

export const metadata: Metadata = {
  title: globalConfig.title,
  description: globalConfig.description,
};

const menuItems = [
  {
    key: '/home',
    label: '首页',
    icon: <HomeOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: '/account',
    label: '账号',
    icon: <UserOutlined />,
  },
  {
    key: '/publish',
    label: '手动发布',
    icon: <SendOutlined />,
  },
  {
    key: '/task',
    label: '发布任务',
    icon: <UnorderedListOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: '/recorder',
    label: '抖音直播录制',
    icon: <VideoCameraOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: '/setting',
    label: '通用设置',
    icon: <SettingOutlined />,
  },
] as MenuProps['items'];

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen w-screen flex-col">
      <div className="flex flex-1 overflow-auto">
        <div className="flex h-full w-[150px] flex-col gap-2">
          <UserInfo />
          <div className="flex flex-1 flex-col">
            <div className="flex-1">
              <AppMenu items={menuItems} />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-2">
          <div className="flex-1 overflow-y-auto rounded-lg bg-white p-4">{children}</div>
        </div>
      </div>
      <div className="flex items-center gap-5 px-4 pb-2">
        <div className="flex flex-1 items-center gap-2">
          <span className="text-lg font-bold">{globalConfig.title}</span>
          <span className="text-desc text-xs">{globalConfig.description}</span>
          <AutoRun />
        </div>
        <Version />
      </div>
    </div>
  );
}

function WrapRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gradient-to-br from-blue-200 to-cyan-200">
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
