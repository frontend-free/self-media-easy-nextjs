'use client';

import { AutoRunRecord } from '@/app/recorder/auto_run_record';
import { AutoRunTaskComponent } from '@/app/task/auto_run_task';
import { AuthComponent } from './auth';

function AutoRun() {
  return (
    <AuthComponent>
      <div className="flex items-center gap-2">
        <AutoRunRecord />
        <AutoRunTaskComponent />
      </div>
    </AuthComponent>
  );
}

export { AutoRun };
