'use client';

import { electronApi } from '@/electron';
import { useEffect, useState } from 'react';

function Version() {
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    if (!electronApi.isElectron()) {
      return;
    }

    electronApi.getVersion().then((version) => {
      setVersion(version);
    });
  }, []);

  return <div className="px-4 py-2">版本 v{version}</div>;
}

export { Version };
