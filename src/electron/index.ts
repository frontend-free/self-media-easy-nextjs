'use client';

import { EnumPlatform } from '@/generated/enums';
import { Platform, PublishType } from '@/generated/prisma';

enum EnumCode {
  /** 浏览器被关闭了 */
  ERROR_CLOSED = 'ERROR_CLOSED',
  /** 授权信息无效 */
  ERROR_AUTH_INFO_INVALID = 'ERROR_AUTH_INFO_INVALID',
}

interface PlatformAuthParams {
  platform: EnumPlatform;
  isDebug?: boolean;
}
interface PlatformAuthResult {
  success: boolean;
  data?: {
    code: EnumCode;
    platform: string;
    platformName?: string;
    platformAvatar?: string;
    platformId?: string;
    authInfo?: string;
    logs?: string[];
  };
  message?: string;
}

interface PlatformAuthCheckParams {
  platform: EnumPlatform;
  authInfo: string;
  isDebug?: boolean;
}
interface PlatformAuthCheckResult {
  success: boolean;
  data?: {
    code: EnumCode;
    platform: EnumPlatform;
    logs?: string[];
  };
  message?: string;
}

interface PlatformPublishParams {
  platform: Platform;
  authInfo: string;
  resourceOfVideo: string;
  title?: string;
  description?: string;
  publishType?: PublishType;
  isDebug?: boolean;
}
interface PlatformPublishResult {
  success: boolean;
  data?: {
    code: EnumCode;
    platform: Platform;
    logs?: string[];
  };
  message?: string;
}

interface ShowOpenDialogOfOpenFileResult {
  success: boolean;
  data?: {
    filePaths: string[];
  };
  message?: string;
}

function getElectron(): any {
  // @ts-expect-error 先忽略
  if (typeof window !== 'undefined' && window.electron) {
    // @ts-expect-error 先忽略
    return window.electron;
  }

  throw new Error('需要在桌面端使用');
}

// 都封装在这里
const electronApi = {
  isElectron: () => {
    try {
      getElectron();
      return true;
    } catch (err) {
      console.error('isElectron error', err);
      // nothing
      return false;
    }
  },
  getVersion: async (): Promise<string> => {
    const electron = getElectron();

    const res: string = await electron.ipcRenderer.invoke('getVersion');

    return res;
  },
  platformAuth: async (params: PlatformAuthParams): Promise<PlatformAuthResult> => {
    const electron = getElectron();

    const res: PlatformAuthResult = await electron.ipcRenderer.invoke('platformAuth', params);

    console.log('platformAuth res', res);
    return res;
  },
  platformAuthCheck: async (params: PlatformAuthCheckParams): Promise<PlatformAuthCheckResult> => {
    const electron = getElectron();

    const res: PlatformAuthCheckResult = await electron.ipcRenderer.invoke(
      'platformAuthCheck',
      params,
    );

    return res;
  },
  platformPublish: async (params: PlatformPublishParams): Promise<PlatformPublishResult> => {
    const electron = getElectron();

    const res: PlatformPublishResult = await electron.ipcRenderer.invoke('platformPublish', params);

    console.log('platformPublish res', res);

    return res;
  },
  showOpenDialogOfOpenFile: async (): Promise<ShowOpenDialogOfOpenFileResult> => {
    const electron = getElectron();

    const res: ShowOpenDialogOfOpenFileResult = await electron.ipcRenderer.invoke(
      'showOpenDialogOfOpenFile',
    );

    console.log('showOpenDialogOfOpenFile res', res);

    return res;
  },
  checkPlaywrightBrowser: async (): Promise<void> => {
    const electron = getElectron();

    await electron.ipcRenderer.invoke('checkPlaywrightBrowser');
  },
  installPlaywrightBrowser: async (): Promise<void> => {
    const electron = getElectron();

    await electron.ipcRenderer.invoke('installPlaywrightBrowser');
  },
};

export { electronApi, EnumCode };
