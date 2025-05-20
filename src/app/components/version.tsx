'use client';

import { electronApi } from '@/electron';
import { App } from 'antd';
import { useEffect, useState } from 'react';
import semver from 'semver';
import * as OtherAction from '../actions/other_action';
import { DebugWrapVersion } from './debug';
import { LoadingButton } from './loading_button';
import { useGlobalSWRMutation } from './use_global_swr';

function getDownLoadURL({ version }: { version: string }) {
  const prefix = `${process.env.NEXT_PUBLIC_DOWNLOAD_SERVER}/subject-media-electron-${version}`;
  if (navigator.userAgent.includes('Mac')) {
    return `${prefix}.dmg`;
  }

  return `${prefix}-setup.exe`;
}

function Version() {
  const [version, setVersion] = useState<string | undefined>(undefined);

  const { modal } = App.useApp();

  const { data: res, trigger } = useGlobalSWRMutation(
    'OtherAction.getLatestAppVersion',
    async () => {
      return await OtherAction.getLatestAppVersion();
    },
  );
  const latestVersion = res?.data;

  useEffect(() => {
    if (!electronApi.isElectron()) {
      return;
    }

    electronApi.getVersion().then((version) => {
      setVersion(version);
    });
  }, []);

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    if (!latestVersion || !version) {
      return;
    }

    const res = semver.compare(latestVersion, version);

    if (res === 1) {
      modal.confirm({
        title: `发现新版本`,
        content: `当前版本: v${version}，最新版本: v${latestVersion}，请升级！`,
        okText: '升级',
        onOk: () => {
          window.open(getDownLoadURL({ version: latestVersion }));
        },
      });
    }
  }, [latestVersion, modal, version]);

  return (
    <div>
      <div className="px-2 py-2 flex items-center justify-between gap-1">
        <DebugWrapVersion>
          <div>版本 v{version}</div>
        </DebugWrapVersion>
        <LoadingButton
          type="text"
          // className="!px-0"
          onClick={async () => {
            const data = await trigger();

            if (version && data.data === version) {
              modal.success({
                title: '已是最新版本',
              });
            }

            console.log(res);
          }}
        >
          检查更新
        </LoadingButton>
      </div>
    </div>
  );
}

export { Version };
