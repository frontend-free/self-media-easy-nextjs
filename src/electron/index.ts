'use client';

import { EnumPlatform } from '@/generated/enums';
import { Platform, PublishType } from '@/generated/prisma';
import { electronApiOfRecorder } from './electron_recorder';
import { getElectron } from './helper';

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

interface ShowOpenDialogOfOpenDirectoryResult {
  success: boolean;
  data?: {
    filePaths: string[];
  };
  message?: string;
}

interface GetDirectoryVideoFilesParams {
  directory: string;
  lastRunAt?: Date;
}
interface GetDirectoryVideoFilesResult {
  success: boolean;
  data?: {
    filePaths: string[];
  };
  message?: string;
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

    console.log('platformAuth params', params);
    const res: PlatformAuthResult = await electron.ipcRenderer.invoke('platformAuth', params);

    console.log('platformAuth res', res);
    return res;
  },
  platformAuthCheck: async (params: PlatformAuthCheckParams): Promise<PlatformAuthCheckResult> => {
    const electron = getElectron();

    console.log('platformAuthCheck params', params);
    const res: PlatformAuthCheckResult = await electron.ipcRenderer.invoke(
      'platformAuthCheck',
      params,
    );

    return res;
  },
  platformPublish: async (params: PlatformPublishParams): Promise<PlatformPublishResult> => {
    const electron = getElectron();

    console.log('platformPublish params', params);
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
  showOpenDialogOfOpenDirectory: async (): Promise<ShowOpenDialogOfOpenDirectoryResult> => {
    const electron = getElectron();

    const res: ShowOpenDialogOfOpenDirectoryResult = await electron.ipcRenderer.invoke(
      'showOpenDialogOfOpenDirectory',
    );

    console.log('showOpenDialogOfOpenDirectory res', res);

    return res;
  },
  getDirectoryVideoFiles: async (
    params: GetDirectoryVideoFilesParams,
  ): Promise<GetDirectoryVideoFilesResult> => {
    const electron = getElectron();

    console.log('getDirectoryVideoFiles params', params);
    const res: GetDirectoryVideoFilesResult = await electron.ipcRenderer.invoke(
      'getDirectoryVideoFiles',
      params,
    );

    console.log('getDirectoryVideoFiles res', res);

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
  ...electronApiOfRecorder,
};

// 拦截打日志
Object.keys(electronApi).forEach((key) => {
  const func = electronApi[key];

  if (key !== 'isElectron') {
    electronApi[key] = async (params) => {
      console.log(key, 'params', params);

      const res = await func(params);

      console.log(key, 'res', res);

      return res;
    };
  }
});

export { electronApi, EnumCode };
