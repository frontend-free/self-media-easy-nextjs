'use client';

import { EnumPlatform } from '@/generated/enums';

function getElectron(): any {
  // @ts-expect-error 先忽略
  if (typeof window !== 'undefined' && window.electron) {
    // @ts-expect-error 先忽略
    electron = window.electron;
  }

  throw new Error('需要在桌面端使用');
}

interface PlatformResult {
  success: boolean;
  data: {
    platform: string;
    platformName?: string;
    platformAvatar?: string;
    platformId?: string;
    authInfo?: string;
    logs?: string[];
  };
  message?: string;
}

// 都封装在这里
const electronApi = {
  platformAuth: async ({ platform }: { platform: EnumPlatform }): Promise<PlatformResult> => {
    const electron = getElectron();

    const res: PlatformResult = await electron.ipcRenderer.invoke('platformAuth', { platform });
    return res;
  },
};

export { electronApi };
