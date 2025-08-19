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
    <div className="h-screen w-screen flex flex-col relative">
      <div className="px-4 py-2 text-center flex  items-center gap-5">
        <span className="font-bold text-lg">{globalConfig.title}</span>
        <span className="text-xs text-desc">{globalConfig.description}</span>
      </div>
      <div className="flex-1 flex overflow-auto">
        <div className="w-[180px] h-full flex flex-col gap-2">
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
          <div className="bg-white rounded-lg flex-1 p-4 overflow-y-auto">{children}</div>
        </div>
      </div>
      <AutoRun />
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
