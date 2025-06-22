'use client';

import { electronApi } from '@/electron';
import { Setting } from '@/generated/prisma';
import { Tabs } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import * as SettingActions from '../actions/setting_actions';
import { Records } from './setting';

function Files({ data }) {
  const { recorderOutputDir } = data || {};
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    async function getFiles() {
      const { success, data, message } = await electronApi.getDirectoryVideoFiles({
        directory: recorderOutputDir,
      });

      if (!success) {
        throw new Error(message);
      }

      setFiles((data?.filePaths || []).reverse());
    }

    getFiles();
  }, [recorderOutputDir]);

  return (
    <div>
      {files.map((file) => (
        <div key={file} className="p-2 c-border-bottom">
          {file}
        </div>
      ))}
    </div>
  );
}

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
    <div className="flex flex-col gap-4">
      <Tabs
        items={[
          {
            label: '录制设置',
            key: 'records',
            children: <Records data={data} refresh={refresh} />,
          },
          { label: '视频列表', key: 'files', children: <Files data={data} /> },
        ]}
      />
    </div>
  );
}

export default RecorderPage;
