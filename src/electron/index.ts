'use client';

import { EnumPlatform } from '@/generated/enums';

let electron: any = null;

if (typeof window !== 'undefined') {
  // @ts-expect-error 先忽略
  electron = window.electron;
}

interface PlatformResult<D> {
  success: boolean;
  data?: D;
  message?: string;
}

// 都封装在这里
const electronApi = {
  platformAuth: async ({ platform }: { platform: EnumPlatform }) => {
    // something
    console.log('platformAuth', platform);
    // 调用平台授权接口，返回授权结果
    // 返回值类型：{ success: boolean, data?: { token: string, userId: string }, error?: string }
    const res: PlatformResult<{
      name: string;
      avatar: string;
      authInfo: string;
    }> = await electron.ipcRenderer.invoke('platformAuth', { platform });
    return res;
  },
};

export { electronApi };
