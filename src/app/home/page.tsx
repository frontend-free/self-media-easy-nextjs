'use client';

import { electronApi } from '@/electron';
import { Alert, App, Button, Spin } from 'antd';
import { useEffect, useState } from 'react';
function InstallBrowser() {
  const { modal, message } = App.useApp();

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    electronApi.checkPlaywrightBrowser().then(
      () => {
        setIsInstalled(true);
      },
      () => {
        setIsInstalled(false);
      },
    );
  }, []);

  return (
    <Alert
      type={isInstalled ? 'success' : 'info'}
      message={
        <div className="flex items-center gap-2">
          <div>
            {isInstalled
              ? '已安装插件。'
              : '首次使用需要安装浏览器插件，点击安装（插件约 250MB，请耐心等待）。'}
          </div>
          {!isInstalled && (
            <Button
              type="primary"
              onClick={async () => {
                const instance = modal.info({
                  title: '安装浏览器插件',
                  content: (
                    <div className="flex flex-col items-center justify-center gap-2 p-4">
                      <Spin size="large"></Spin>
                      <div>请耐心等待</div>
                    </div>
                  ),
                });

                await electronApi.installPlaywrightBrowser();

                message.success('安装成功');

                instance.destroy();

                setIsInstalled(true);
              }}
            >
              安装插件
            </Button>
          )}
        </div>
      }
    />
  );
}

function Page() {
  return (
    <div>
      <InstallBrowser />
    </div>
  );
}

export default Page;
