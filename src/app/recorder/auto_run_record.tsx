'use client';

import * as SettingActions from '@/app/actions/setting_actions';
import { electronApi } from '@/electron';
import { SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';

function useDoAutoCheckAndRecord() {
  const [isRunning, setIsRunning] = useState(false);

  const doAutoCheckAndRecord = useCallback(async () => {
    const { success, data } = await SettingActions.getSetting();

    if (!success || !data || !data.recorderOutputDir) {
      // nothing
      return;
    }

    const recorderList = data.recorderList ? JSON.parse(data.recorderList) : [];

    const items = recorderList.filter((item) => item.auto);

    setIsRunning(items.length > 0);

    for (const item of items) {
      await electronApi.autoCheckAndRecord({
        roomId: item.roomId,
        outputDir: data.recorderOutputDir,
        fileName: item.title,
      });
    }
  }, []);

  return { doAutoCheckAndRecord, isRunning };
}

function AutoRunRecord() {
  const { doAutoCheckAndRecord, isRunning } = useDoAutoCheckAndRecord();

  useEffect(() => {
    // 一分钟检查一次 autoCheckAndRecord
    const timer = setInterval(() => {
      doAutoCheckAndRecord();
    }, 1000 * 60);

    // 开始扫描一次
    doAutoCheckAndRecord();

    return () => {
      clearInterval(timer);
    };
  }, [doAutoCheckAndRecord]);

  return (
    <Button type="text" icon={<SyncOutlined spin={isRunning} />}>
      抖音直播录制
    </Button>
  );
}

export { AutoRunRecord, useDoAutoCheckAndRecord };
