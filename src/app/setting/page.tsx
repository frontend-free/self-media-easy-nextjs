'use client';

import { electronApi } from '@/electron';
import { Switch } from 'antd';
import { useEffect, useState } from 'react';

function OpenAtLogin() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    electronApi.openAtLogin().then((res) => {
      setOpen(res.data!.open);
    });
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div>开机自启动</div>
      <Switch
        checked={open}
        onChange={async (checked) => {
          await electronApi.openAtLogin({ open: checked });

          setOpen(checked);
        }}
      />
    </div>
  );
}

function SettingPage() {
  return (
    <div>
      <OpenAtLogin />
    </div>
  );
}

export default SettingPage;
