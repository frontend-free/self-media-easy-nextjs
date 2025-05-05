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

  return <div className="p-2">版本：V{version}</div>;
}

export { Version };
