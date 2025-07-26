'use client';

import { electronApi } from '@/electron';
import { App } from 'antd';
import { useEffect, useState } from 'react';
import semver from 'semver';
import { DebugWrapVersion } from './debug';
import { LoadingButton } from './loading_button';

async function getLatestAppVersion() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_UPDATER_SERVER}/latest.json?t=${Date.now()}`,
  ).then((res) => res.json());

  return {
    latestVersion: res.version,
    downloadUrl: `${process.env.NEXT_PUBLIC_UPDATER_SERVER}/${res.path}`,
  };
}

function Version() {
  const [version, setVersion] = useState<string | undefined>(undefined);

  const { modal } = App.useApp();

  async function getLatestVersion({ silent }: { silent: boolean }) {
    const { latestVersion, downloadUrl } = await getLatestAppVersion();

    const res = semver.compare(latestVersion, version);

    if (res === 1) {
      modal.confirm({
        title: `发现新版本`,
        content: `当前版本: v${version}，最新版本: v${latestVersion}，请升级！`,
        okText: '升级',
        onOk: () => {
          window.open(downloadUrl);
        },
      });
    } else {
      if (!silent) {
        modal.success({
          title: '已是最新版本',
        });
      }
    }
  }

  useEffect(() => {
    if (!electronApi.isElectron()) {
      return;
    }

    electronApi.getVersion().then((res) => {
      setVersion(res.data as string);
    });
  }, []);

  useEffect(() => {
    if (!version) {
      return;
    }

    const timer = setInterval(
      () => {
        getLatestVersion({ silent: true });
      },
      1000 * 60 * 30,
    );

    getLatestVersion({ silent: true });

    return () => {
      clearInterval(timer);
    };
  }, [version]);

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
            await getLatestVersion({ silent: false });
          }}
        >
          检查更新
        </LoadingButton>
      </div>
    </div>
  );
}

export { Version };
