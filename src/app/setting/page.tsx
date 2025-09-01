'use client';

import { LoadingButton } from '@/components/loading_button';
import { electronApi } from '@/electron';
import { Alert, App, Button, Divider, Switch } from 'antd';
import { useEffect, useState } from 'react';

function InstallBrowser() {
  return (
    <Alert
      type={'info'}
      message={
        <div>
          <span>发布视频 - 需要 Chrome 浏览器。</span>
          <Button
            type="link"
            className="!px-0"
            href="https://www.google.cn/intl/zh-CN/chrome/"
            target="_blank"
          >
            点我安装 Chrome
          </Button>
          。
        </div>
      }
    />
  );
}

function FFMPEGCheck() {
  const [isInstalled, setIsInstalled] = useState(false);
  const { message } = App.useApp();

  const checkFfmpeg = async ({ silent }: { silent?: boolean } = {}) => {
    const res = await electronApi.checkFfmpeg();
    setIsInstalled(!!res.data);

    if (!res.data) {
      if (!silent) {
        message.error('请确保本地已安装好 ffmpeg 插件');
      }
    }
    return res;
  };

  useEffect(() => {
    checkFfmpeg({ silent: true });
  }, []);

  return (
    <Alert
      type={'info'}
      message={
        <div>
          <span>直播录制 - 需要 ffmpeg 插件。</span>
          {isInstalled ? (
            <span>已安装。</span>
          ) : (
            <>
              <LoadingButton
                type="link"
                className="!px-0"
                style={{
                  padding: 0,
                }}
                onClick={async () => {
                  const res = await checkFfmpeg();

                  if (res.data) {
                    message.success('已安装');
                    setIsInstalled(true);
                    return;
                  }

                  message.info('未安装，开始安装...');
                  await electronApi.installFfmpeg();
                  const res2 = await checkFfmpeg();
                  if (res2.success) {
                    message.success('安装成功');
                  } else {
                    message.error('安装失败，请重试');
                  }
                }}
              >
                点我检查和安装
              </LoadingButton>
              <span>，请耐心等待，大约 70MB。</span>
            </>
          )}
        </div>
      }
    />
  );
}

function OpenAtLogin() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    electronApi.openAtLogin().then((res) => {
      setOpen(res.data!.open);
    });
  }, []);

  return (
    <div>
      <div>开机自启动</div>
      <Switch
        checked={open}
        onChange={async (checked) => {
          await electronApi.openAtLogin({ open: checked });

          setOpen(checked);
        }}
      />
    </div>
  );
}

function SettingPage() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <h1 className="text-2xl font-bold">首次使用，请先进行设置。</h1>
      <InstallBrowser />
      <FFMPEGCheck />
      <Divider />
      <OpenAtLogin />
    </div>
  );
}

export default SettingPage;
