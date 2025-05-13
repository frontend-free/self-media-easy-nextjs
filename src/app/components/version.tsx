'use client';

import { electronApi } from '@/electron';
import { App, Button } from 'antd';
import { useEffect, useState } from 'react';
import semver from 'semver';
import * as OtherAction from '../actions/other_action';
import { DebugWrapVersion } from './debug';

function getDownLoadURL({ version }: { version: string }) {
  const prefix = `${process.env.NEXT_PUBLIC_DOWNLOAD_SERVER}/subject-media-electron-${version}`;
  if (navigator.userAgent.includes('Mac')) {
    return `${prefix}.dmg`;
  }

  return `${prefix}-setup.exe`;
}

async function checkVersionAndUpdate({ modal, silent = true }) {
  const nowAppVersion = await electronApi.getVersion();

  const latestAppVersion = await OtherAction.getLatestAppVersion();

  const res = semver.compare(latestAppVersion, nowAppVersion);

  // 需要更新
  if (res === 1) {
    modal.confirm({
      title: `发现新版本`,
      content: `当前版本: v${nowAppVersion}，最新版本: v${latestAppVersion}，请升级！`,
      okText: '升级',
      onOk: () => {
        window.open(getDownLoadURL({ version: latestAppVersion }));
      },
    });
  } else {
    if (res === 0) {
      if (!silent) {
        modal.success({
          title: '当前版本是最新版本',
        });
      }
    }
    // nothing
  }
}

function Version() {
  const [version, setVersion] = useState<string>('');
  const { modal } = App.useApp();

  useEffect(() => {
    if (!electronApi.isElectron()) {
      return;
    }

    checkVersionAndUpdate({ modal });

    electronApi.getVersion().then((version) => {
      setVersion(version);
    });
  }, []);

  return (
    <div>
      <div className="px-2 py-2 flex items-center justify-between gap-1">
        <DebugWrapVersion>
          <div>版本 v{version}</div>
        </DebugWrapVersion>
        <Button
          type="text"
          // className="!px-0"
          onClick={() => checkVersionAndUpdate({ modal, silent: false })}
        >
          检查更新
        </Button>
      </div>
    </div>
  );
}

export { Version };
