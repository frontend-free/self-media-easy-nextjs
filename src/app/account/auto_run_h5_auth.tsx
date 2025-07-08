'use client';

import * as H5AuthActions from '@/app/actions/h5_auth_actions';
import { electronApi } from '@/electron';
import { EnumPlatform } from '@/generated/enums';
import { H5AuthStatus } from '@/generated/prisma';
import { useCallback, useEffect } from 'react';
import { useAuth } from './use_auth';

function AutoRunH5AuthComponent() {
  const { onAuth } = useAuth();

  const runAutoH5Auth = useCallback(async () => {
    const { success, data } = await H5AuthActions.listH5Auths();

    if (!success) {
      // 静默处理
      return;
    }

    // 取第一条
    const h5Auth = data![0];
    if (!h5Auth) {
      return;
    }

    // 更新状态
    await H5AuthActions.updateH5Auth({
      id: h5Auth.id,
      status: H5AuthStatus.QRCODE,
    });

    // 启动授权
    try {
      await onAuth({
        platform: h5Auth.platform as EnumPlatform,
        h5AuthId: h5Auth.id,
        studentId: h5Auth.studentId,
      });
      // 更新状态
      await H5AuthActions.updateH5Auth({
        id: h5Auth.id,
        status: H5AuthStatus.SUCCESS,
      });
    } catch (err) {
      console.error(err);

      // 更新状态
      await H5AuthActions.updateH5Auth({
        id: h5Auth.id,
        status: H5AuthStatus.FAILED,
      });
    }
  }, [onAuth]);

  useEffect(() => {
    if (!electronApi.isElectron()) {
      return;
    }

    const timer = setInterval(async () => {
      runAutoH5Auth();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return null;
}

export { AutoRunH5AuthComponent };
