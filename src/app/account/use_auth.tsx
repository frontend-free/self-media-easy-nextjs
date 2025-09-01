'use client';

import { electronApi } from '@/electron';
import { EnumAccountStatus, EnumPlatform } from '@/generated/enums';
import { App } from 'antd';
import * as AccountActions from '../actions/account_actions';
import { useIsDebug } from '../components/debug';
import { handleRequestRes } from '../lib/request';

function useAuth() {
  const { modal, message } = App.useApp();
  const { isDebug } = useIsDebug();

  const onAuth = async ({
    platform,

    silent = false,
  }: {
    platform: EnumPlatform;
    silent?: boolean;
  }) => {
    console.log('onAuth', { platform, silent });
    const res = await electronApi.platformAuth({ platform, isDebug });

    if (res.success && res.data) {
      const res2 = await AccountActions.createAccount({
        platform,
        platformId: res.data.platformId || null,
        platformName: res.data.platformName || null,
        platformAvatar: res.data.platformAvatar || null,

        status: EnumAccountStatus.AUTHED,
        authInfo: res.data.authInfo || null,
        authedAt: new Date(),
        logs: JSON.stringify(res.data.logs || []),
      } as AccountActions.CreateAccountInput);

      await handleRequestRes(res2);

      message.success('授权成功');
    } else {
      if (!silent) {
        modal.error({
          title: '授权失败',
          content: (
            <div>
              <div>{res.message || '未知错误'}</div>
              <pre className="max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                {JSON.stringify(res.data, null, 2)}
              </pre>
            </div>
          ),
        });
      }

      return Promise.reject();
    }
  };

  const onAuthCheck = async ({ id, platform, authInfo, status }) => {
    const res = await electronApi.platformAuthCheck({ platform, authInfo, isDebug });

    if (res.success) {
      message.success('账号授权信息有效');
    } else {
      message.error('账号授权信息无效');
      if (status === EnumAccountStatus.AUTHED) {
        await AccountActions.updateAccount({
          id,
          status: EnumAccountStatus.INVALID,
          logs: JSON.stringify(res.data?.logs || []),
        });
      }
    }
  };

  return { onAuth, onAuthCheck };
}

export { useAuth };
