'use client';

import { electronApi } from '@/electron';
import { EnumPlatform } from '@/generated/enums';
import { Button } from 'antd';

function Page() {
  return (
    <div>
      <Button
        onClick={async () => {
          const res = await electronApi.platformAuth({
            platform: EnumPlatform.TIKTOK,
          });

          console.log(res);
        }}
      >
        debug tiktok auth
      </Button>
    </div>
  );
}

export default Page;
