import * as AuthAction from '@/app/actions/auth_action';
import { UserAvatar } from '@/app/components/avatar';
import UserDropdown from '@/app/components/user_dropdown';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '驾K先锋',
  description: '驾K先锋',
};

const Icon = async () => {
  const user = await AuthAction.getUser();

  return (
    <UserDropdown>
      <div className="flex gap-2 items-center cursor-pointer">
        <div className="flex gap-2 items-center">
          <UserAvatar size={30} src={user?.avatar || undefined} />
          <div>{user?.name}</div>
        </div>
      </div>
    </UserDropdown>
  );
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="h-screen w-screen flex bg-gray-200">
          <div className="w-[220px] p-2">
            <div className="h-5"></div>
            <Icon />
          </div>

          <div className="flex-1 p-2 flex flex-col">
            <div className="bg-white rounded-md flex-1 p-2">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
