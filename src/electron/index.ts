'use client';

import { EnumPlatform } from '@/generated/enums';

let electron: any = null;

if (typeof window !== 'undefined') {
  // @ts-expect-error 先忽略
  electron = window.electron;
}

interface PlatformResult {
  success: boolean;
  data?: {
    platform: string;
    platformName?: string;
    platformAvatar?: string;
    platformId?: string;
    authInfo: string;
  };
  message?: string;
}

// 都封装在这里
const electronApi = {
  platformAuth: async ({ platform }: { platform: EnumPlatform }): Promise<PlatformResult> => {
    const res: PlatformResult = await electron.ipcRenderer.invoke('platformAuth', { platform });
    return res;
  },
};

export { electronApi };
