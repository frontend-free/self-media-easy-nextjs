'use client';

import { useIsDebug } from '@/components/debug';
import { App, Switch } from 'antd';

function Page() {
  const { isDebug, setIsDebug } = useIsDebug();
  const { message } = App.useApp();

  return (
    <div>
      isDebug:
      <Switch
        checked={isDebug}
        onChange={(checked) => {
          setIsDebug(checked);
          message.success('设置成功，请重启应用');
        }}
      />
    </div>
  );
}

export default Page;
