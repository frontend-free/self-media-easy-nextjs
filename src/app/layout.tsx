import { AuthComponent } from '@/app/components/auth';
import { AppMenu } from '@/app/components/menu';
import { AdminPathComponent, AuthPathComponent } from '@/app/components/path';
import { UserInfo } from '@/app/components/user_info';
import { ErrorComponent } from '@/app/lib/error';
import { initDatabase } from '@/app/lib/init_db';
import { AutoRunTaskComponent } from '@/app/task/auto_run_task';
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
import { AutoRunH5AuthComponent } from './account/auto_run_h5_auth';
import { FrameComponent } from './components/frame';
import { Version } from './components/version';
import './globals.css';
import { AutoRunRecord } from './recorder/auto_run_record';

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
    type: 'divider',
  },
  {
    key: '/account',
    label: (
      <div className="flex items-center gap-2">
        <UserOutlined />
        <div>账号</div>
        <AuthComponent>
          <AutoRunH5AuthComponent />
        </AuthComponent>
      </div>
    ),
  },
  {
    key: '/auto_publish',
    label: '授权自动发布设置',
    icon: <SettingOutlined />,
  },
  {
    key: '/school',
    label: '驾校信息',
    icon: <HomeOutlined />,
  },
  {
    key: '/task',
    label: (
      <div className="flex items-center gap-2">
        <UnorderedListOutlined />
        <div>发布任务</div>
        <AuthComponent>
          <AutoRunTaskComponent />
        </AuthComponent>
      </div>
    ),
  },
  {
    key: '/publish',
    label: '手动发布',
    icon: <SendOutlined />,
  },
  {
    type: 'divider',
  },
  {
    key: '/recorder',
    label: (
      <div className="flex items-center gap-2">
        <VideoCameraOutlined />
        <div>抖音直播录制</div>
        <AuthComponent>
          <AutoRunRecord />
        </AuthComponent>
      </div>
    ),
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
    <div className="h-screen w-screen flex flex-col bg-gray-200">
      <div
        className="px-4 py-2 text-center flex  items-center gap-5"
        style={{
          // @ts-expect-error 类型错误
          WebkitAppRegion: 'drag',
        }}
      >
        <span className="font-bold text-lg">多媒体-驾K先锋</span>
        <span className="text-xs">给驾校/教练带来10-100倍招生广告效果！</span>
      </div>
      <div className="flex-1 flex overflow-auto">
        <div className="w-[220px] h-full flex flex-col gap-2">
          <div></div>
          <UserInfo />
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <AppMenu items={menuItems} />
            </div>
            <FrameComponent />
            <Version />
          </div>
          <div></div>
        </div>

        <div className="flex-1 p-2 flex flex-col ">
          <div className="bg-white rounded-md flex-1 p-4 overflow-y-auto">{children}</div>
        </div>
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
