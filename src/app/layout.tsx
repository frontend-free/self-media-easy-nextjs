import * as AuthAction from '@/app/actions/auth_action';
import { AuthComponent } from '@/app/components/auth_component';
import { UserAvatar } from '@/app/components/avatar';
import { AppMenu } from '@/app/components/menu';
import { UserDropdown } from '@/app/components/user_dropdown';
import { RightOutlined } from '@ant-design/icons';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

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
          <div className="flex-1">{user?.name}</div>
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

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <div className="h-screen w-screen flex bg-gray-200">
            <AuthComponent>
              <div className="w-[220px] h-full flex flex-col gap-2">
                <div className="h-5"></div>
                <Icon />
                <div className="flex-1">
                  <AppMenu />
                </div>
                <div></div>
              </div>
            </AuthComponent>

            <div className="flex-1 p-2 flex flex-col">
              <div className="bg-white rounded-md flex-1 p-2">{children}</div>
            </div>
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}

export default RootLayout;
