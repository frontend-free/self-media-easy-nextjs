'use client';

import { EnumPlatform } from '@/generated/enums';
import { Platform, PublishType } from '@/generated/prisma';
import { electronApiOfRecorder } from './electron_recorder';
import { ElectronApiResult, getElectron } from './helper';

enum EnumCode {
  /** 浏览器被关闭了 */
  ERROR_CLOSED = 'ERROR_CLOSED',
  /** 授权信息无效 */
  ERROR_AUTH_INFO_INVALID = 'ERROR_AUTH_INFO_INVALID',
}

// 都封装在这里
const electronApi = {
  isElectron: () => {
    try {
      getElectron();
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // nothing
      return false;
    }
  },
  getVersion: async (): ElectronApiResult<string> => {
    return await getElectron().ipcRenderer.invoke('getVersion');
  },
  openAtLogin: async (params?: { open: boolean }): ElectronApiResult<{ open: boolean } | void> => {
    return await getElectron().ipcRenderer.invoke('openAtLogin', params);
  },
  platformAuth: async (params: {
    platform: EnumPlatform;
    isDebug?: boolean;
  }): ElectronApiResult<{
    code: EnumCode;
    platform: string;
    platformName?: string;
    platformAvatar?: string;
    platformId?: string;
    authInfo?: string;
    logs?: string[];
  }> => {
    return await getElectron().ipcRenderer.invoke('platformAuth', params);
  },
  platformAuthCheck: async (params: {
    platform: EnumPlatform;
    authInfo: string;
    isDebug?: boolean;
  }): ElectronApiResult<{
    code: EnumCode;
    platform: EnumPlatform;
    logs?: string[];
  }> => {
    return await getElectron().ipcRenderer.invoke('platformAuthCheck', params);
  },
  platformPublish: async (params: {
    platform: Platform;
    authInfo: string;
    resourceOfVideo: string;
    title?: string;
    description?: string;
    publishType?: PublishType;
    isDebug?: boolean;
  }): ElectronApiResult<{
    code: EnumCode;
    platform: Platform;
    logs?: string[];
  }> => {
    return await getElectron().ipcRenderer.invoke('platformPublish', params);
  },
  showOpenDialogOfOpenFile: async (): ElectronApiResult<{
    filePaths: string[];
  }> => {
    return await getElectron().ipcRenderer.invoke('showOpenDialogOfOpenFile');
  },
  showOpenDialogOfOpenDirectory: async (): ElectronApiResult<{
    filePaths: string[];
  }> => {
    return await getElectron().ipcRenderer.invoke('showOpenDialogOfOpenDirectory');
  },
  getDirectoryVideoFiles: async (params: {
    directory: string;
  }): ElectronApiResult<{
    filePaths: string[];
  }> => {
    return await getElectron().ipcRenderer.invoke('getDirectoryVideoFiles', params);
  },
  checkFfmpeg: async (): ElectronApiResult<string> => {
    return await getElectron().ipcRenderer.invoke('checkFfmpeg');
  },
  installFfmpeg: async (): ElectronApiResult<void> => {
    return await getElectron().ipcRenderer.invoke('installFfmpeg');
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
