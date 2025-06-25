'use client';

import { electronApi } from '@/electron';
import { useCallback, useEffect } from 'react';
import * as SettingActions from '../actions/setting_actions';

function useDoAutoCheckAndRecord() {
  const doAutoCheckAndRecord = useCallback(async () => {
    const { success, data } = await SettingActions.getSetting();

    if (!success || !data || !data.recorderOutputDir) {
      // nothing
      return;
    }

    const recorderList = data.recorderList ? JSON.parse(data.recorderList) : [];

    const items = recorderList.filter((item) => item.auto);
    for (const item of items) {
      await electronApi.autoCheckAndRecord({
        roomId: item.roomId,
        outputDir: data.recorderOutputDir,
        fileName: item.fileName,
      });
    }
  }, []);

  return { doAutoCheckAndRecord };
}

function AutoRunRecord() {
  const { doAutoCheckAndRecord } = useDoAutoCheckAndRecord();

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

  return null;
}

export { AutoRunRecord, useDoAutoCheckAndRecord };
