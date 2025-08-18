'use client';

import { SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { AutoRunRecord } from '../recorder/auto_run_record';
import { AutoRunTaskComponent } from '../task/auto_run_task';
import { AuthComponent } from './auth';

function AutoRun() {
  return (
    <div className="absolute top-0 right-0 py-2 px-4 flex items-center gap-2">
      <AuthComponent>
        <Button type="text" icon={<SyncOutlined spin />}>
          抖音直播录制
        </Button>
        <AutoRunRecord />

        <AutoRunTaskComponent />
      </AuthComponent>
    </div>
  );
}

export { AutoRun };
