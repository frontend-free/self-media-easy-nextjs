'use client';

import { globalStorageKey } from '@/app/config';
import { App, Divider } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function Page() {
  const { modal } = App.useApp();
  const router = useRouter();

  useEffect(() => {
    const firstUse = localStorage.getItem(globalStorageKey.UN_FIRST_USE);
    if (!firstUse) {
      modal.confirm({
        title: '首次使用，请先进行设置。',
        onOk: () => {
          localStorage.setItem(globalStorageKey.UN_FIRST_USE, 'true');
          router.push('/setting');
        },
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-2 p-4">
      <div>
        首次使用，
        <a href="/setting">前往设置。</a>
      </div>
      <Divider />
      <div>敬请期待-视频统计数据</div>
    </div>
  );
}

export default Page;
