'use client';

import { EnumPlatform } from '@/generated/enums';

let electron: any = null;

if (typeof window !== 'undefined') {
  // @ts-expect-error 先忽略
  electron = window.electron;
}

// 都封装在这里
const electronApi = {
  platformAuth: async (platform: EnumPlatform) => {
    // something
    console.log('platformAuth', platform);
    const res = await electron.platformAuth(platform);
    return res;
  },
};

export { electronApi };
