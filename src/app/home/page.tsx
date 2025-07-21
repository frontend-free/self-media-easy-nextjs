'use client';

import { LoadingButton } from '@/app/components/loading_button';
import { Alert, App } from 'antd';
import { useEffect, useState } from 'react';
import { electronApi } from '../../electron/index';

function InstallBrowser() {
  return (
    <Alert
      type={'info'}
      message={
        <div>
          <span>请确保本地已安装好 Chrome 浏览器。如需，</span>
          <a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">
            点我安装 Chrome
          </a>
          。
        </div>
      }
    />
  );
}

function FFMPEGCheck() {
  const [isInstalled, setIsInstalled] = useState(false);
  const { message } = App.useApp();

  const checkFfmpeg = async () => {
    const res = await electronApi.checkFfmpeg();
    setIsInstalled(!!res.data);

    if (!res.data) {
      message.error('请确保本地已安装好 ffmpeg 插件');
    }
    return res;
  };

  useEffect(() => {
    checkFfmpeg();
  }, []);

  return (
    <Alert
      type={isInstalled ? 'info' : 'error'}
      message={
        <div>
          <span>请确保本地已安装好 ffmpeg 插件：</span>
          {isInstalled ? (
            <span>已安装。</span>
          ) : (
            <>
              <LoadingButton
                type="link"
                className="!px-0"
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

function Page() {
  return (
    <div className="flex flex-col gap-2">
      <InstallBrowser />
      <FFMPEGCheck />
    </div>
  );
}

export default Page;
