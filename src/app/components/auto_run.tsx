'use client';

import { AutoRunH5AuthComponent } from '@/app/account/auto_run_h5_auth';
import { SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { AutoRunRecord } from '../recorder/auto_run_record';
import { AutoRunTaskComponent } from '../task/auto_run_task';
import { AuthComponent } from './auth';

function AutoRun() {
  return (
    <div className="absolute top-0 right-0 py-2 px-4 flex gap-2">
      <AuthComponent>
        <Button type="text" icon={<SyncOutlined spin />}>
          H5授权
        </Button>
        <AutoRunH5AuthComponent />

        <Button type="text" icon={<SyncOutlined spin />}>
          抖音直播录制
        </Button>
        <AutoRunRecord />

        <div className="flex gap-2 items-center">
          <Button type="text" icon={<SyncOutlined spin />}>
            发布任务 <AutoRunTaskComponent />
          </Button>
        </div>
      </AuthComponent>
    </div>
  );
}

export { AutoRun };
