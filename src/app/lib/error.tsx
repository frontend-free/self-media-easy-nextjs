'use client';

import { App } from 'antd';
import { useEffect } from 'react';

function ErrorComponent() {
  const { message, modal } = App.useApp();

  useEffect(() => {
    function handleError(event) {
      console.log('handleError', event);

      if (event?.reason?.message || event.message) {
        let msg = (event.reason?.message || event.message) as string;

        msg = msg.replace('Uncaught Error: ', '');

        if (msg.includes('Unsupported chromium channel')) {
          modal.confirm({
            title: '请先安装 Chrome 浏览器',
            onOk: () => {
              window.open('https://www.google.cn/intl/zh-CN/chrome/', '_blank');
            },
          });

          return;
        }

        message.error(msg);

        return;
      }

      // unknown error
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  return null;
}

export { ErrorComponent };
