'use client';

import { Alert } from 'antd';

function InstallBrowser() {
  return (
    <Alert
      type={'info'}
      message={
        <div>
          <span>请确保本地已安装好 Chrome 浏览器，</span>
          <a href="https://www.google.cn/intl/zh-CN/chrome/" target="_blank">
            点我安装 Chrome
          </a>
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
