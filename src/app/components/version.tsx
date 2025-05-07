'use client';

import { electronApi } from '@/electron';
import { Button } from 'antd';
import { useEffect, useState } from 'react';

function Version() {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    if (!electronApi.isElectron()) {
      return;
    }

    electronApi.checkForUpdatesAndNotify();

    electronApi.getVersion().then((version) => {
      setVersion(version);
    });
  }, []);

  return (
    <div className="px-2 py-2 flex items-center gap-1">
      <div>版本 v{version}</div>
      <Button type="text" className="!px-0" onClick={() => electronApi.checkForUpdatesAndNotify()}>
        检查更新
      </Button>
    </div>
  );
}

export { Version };
