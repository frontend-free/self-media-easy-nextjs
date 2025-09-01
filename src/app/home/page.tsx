'use client';

import { Divider } from 'antd';

function Page() {
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
