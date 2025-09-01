'use client';

import * as SettingActions from '@/app/actions/setting_actions';
import { Setting } from '@/generated/prisma';
import { useCallback, useEffect, useState } from 'react';
import { Records } from './setting';

function RecorderPage() {
  const [data, setData] = useState<Setting | undefined>(undefined);

  const refresh = useCallback(async () => {
    const { success, data, message } = await SettingActions.getSetting();

    if (!success) {
      throw new Error(message);
    }

    setData(data);
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="p-4">
      <Records data={data} refresh={refresh} />
    </div>
  );
}

export default RecorderPage;
