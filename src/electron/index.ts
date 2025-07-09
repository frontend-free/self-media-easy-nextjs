'use client';

import * as H5AuthActions from '@/app/actions/h5_auth_actions';
import { EnumPlatform } from '@/generated/enums';
import { H5AuthStatus, Platform, PublishType } from '@/generated/prisma';
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
  platformAuth: async (params: {
    platform: EnumPlatform;
    h5AuthId?: string;
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
    lastRunAt?: Date;
  }): ElectronApiResult<{
    filePaths: string[];
  }> => {
    return await getElectron().ipcRenderer.invoke('getDirectoryVideoFiles', params);
  },
  checkPlaywrightBrowser: async (): Promise<void> => {
    await getElectron().ipcRenderer.invoke('checkPlaywrightBrowser');
  },
  installPlaywrightBrowser: async (): Promise<void> => {
    await getElectron().ipcRenderer.invoke('installPlaywrightBrowser');
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

async function handleH5Auth(
  _,
  arg: {
    type: H5AuthStatus;
    data: {
      h5AuthId: string;
      qrcode?: string;
    };
  },
) {
  console.log('handleH5Auth', arg);
  const {
    type,
    data: { h5AuthId, qrcode },
  } = arg;

  if (type === H5AuthStatus.QRCODE) {
    await H5AuthActions.updateH5Auth({
      id: h5AuthId,
      qrcode,
      status: H5AuthStatus.QRCODE,
    });
  } else if (type === H5AuthStatus.MOBILE_CODE) {
    await H5AuthActions.updateH5Auth({
      id: h5AuthId,
      status: H5AuthStatus.MOBILE_CODE,
    });
  }
}

async function handleMobileCode(_, arg: { h5AuthId: string; resultKey: string }) {
  console.log('handleMobileCode', arg);
  const { h5AuthId, resultKey } = arg;

  let timer: any = null;

  async function fetchMobileCode() {
    const { success, data } = await H5AuthActions.getH5AuthById(h5AuthId);

    // 获取到 mobile，则发送。
    if (success && data && data.mobileCode) {
      getElectron().ipcRenderer.invoke(resultKey, {
        mobileCode: data.mobileCode,
      });

      // 清理
      clearInterval(timer);
    } else {
      // 啥也不做
    }
  }

  // 轮训获取数据
  timer = setInterval(fetchMobileCode, 2000);
  // 超时
  setTimeout(
    () => {
      clearInterval(timer);
    },
    1000 * 60 * 1,
  );
}

function on() {
  if (!electronApi.isElectron()) {
    return;
  }

  const electron = getElectron();

  electron.ipcRenderer.on('h5Auth', handleH5Auth);

  electron.ipcRenderer.on('h5AuthMobileCode', handleMobileCode);
}

on();

export { electronApi, EnumCode };
