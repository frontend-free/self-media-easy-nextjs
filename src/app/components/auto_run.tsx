'use client';

import { AutoRunRecord } from '../recorder/auto_run_record';
import { AutoRunTaskComponent } from '../task/auto_run_task';
import { AuthComponent } from './auth';

function AutoRun() {
  return (
    <div className="absolute top-0 right-0 py-2 px-4 flex items-center gap-2">
      <AuthComponent>
        <AutoRunRecord />

        <AutoRunTaskComponent />
      </AuthComponent>
    </div>
  );
}

export { AutoRun };
