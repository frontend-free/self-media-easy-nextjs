'use client';

import { electronApi } from '@/electron';
import { App, Button } from 'antd';

function FrameComponent() {
  const { modal } = App.useApp();
  return (
    <div>
      <Button
        type="link"
        onClick={() => {
          modal.confirm({
            title: '确定关闭吗？',
            content: (
              <div>
                <span className="text-red-500">学员授权</span>和
                <span className="text-red-500">直播录制</span>
                需要程序打开状态，请谨慎操作
              </div>
            ),
            onOk: () => {
              electronApi.closeWindow();
            },
          });
        }}
      >
        关闭
      </Button>
      <Button type="link" onClick={() => electronApi.minimizeWindow()}>
        最小化
      </Button>
    </div>
  );
}

export { FrameComponent };
