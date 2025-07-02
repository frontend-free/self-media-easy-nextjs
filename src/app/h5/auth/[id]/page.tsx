'use client';

import * as H5AuthActions from '@/app/actions/h5_auth_actions';
import { LoadingButton } from '@/app/components/loading_button';
import { EnumPlatform } from '@/generated/enums';
import { H5Auth, H5AuthStatus } from '@/generated/prisma';
import { useCountDown } from 'ahooks';
import { App, Button, InputNumber, Result, Spin } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';

let interval: any;

function H5AuthDetailPage({ params }) {
  const { id } = use<{ id: string }>(params);
  const { message } = App.useApp();
  const router = useRouter();

  const [data, setData] = useState<H5Auth | undefined>(undefined);
  const [code, setCode] = useState<string>('');

  // 2min 后超时
  const [countdown] = useCountDown({
    leftTime: 1000 * 60 * 2,
    onEnd: () => {
      clearInterval(interval);
    },
  });

  const getData = useCallback(async () => {
    const { success, data, message: errorMessage } = await H5AuthActions.getH5AuthById(id);

    if (!success) {
      message.error(errorMessage);
      return;
    }

    setData(data!);
  }, [id, message]);

  useEffect(() => {
    getData();

    interval = setInterval(() => {
      getData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const failed = (title) => (
    <div>
      <Result
        status="warning"
        title={title}
        extra={[
          <Button
            key="reauth"
            type="primary"
            size="large"
            onClick={() => {
              try {
                H5AuthActions.deleteH5Auth(id);
              } catch (e) {
                // nothing
                console.error(e);
              }

              router.back();
            }}
          >
            重新授权
          </Button>,
        ]}
      />
    </div>
  );

  // 非结果状态，且超时，则提示超时
  if (!countdown && data?.status !== H5AuthStatus.SUCCESS && data?.status !== H5AuthStatus.FAILED) {
    return failed('授权超时');
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="p-4 flex items-center justify-between">
        <Button type="link" onClick={() => router.back()}>
          返回
        </Button>
        <div>{Math.floor(countdown / 1000)}s</div>
      </div>
      <div className="px-4 flex flex-col gap-4">
        {data?.status === H5AuthStatus.PENDING && (
          <div className="flex items-center gap-2">
            <div>二维码准备中</div>
            <Spin />
          </div>
        )}
        {(data?.status === H5AuthStatus.QRCODE || data?.status === H5AuthStatus.MOBILE_CODE) && (
          <div>
            <div>1 扫码登录。</div>
            <div className="flex flex-col items-center justify-center">
              {data?.qrcode && (
                <Image src={data.qrcode || ''} alt="qrcode" width={200} height={200} />
              )}
              {data.platform === EnumPlatform.TIKTOK && (
                <div>打开「抖音APP」点击左上角 三 进行扫一扫。</div>
              )}
              {data.platform === EnumPlatform.WEIXIN_VIDEO && <div>微信扫码登录 视频号助手</div>}
              <div>如果超时请返回重新授权。</div>
            </div>
          </div>
        )}
        {data?.status === H5AuthStatus.MOBILE_CODE && (
          <div>
            <div>2 输入手机验证码</div>
            <div className="flex flex-col items-center gap-2">
              <InputNumber
                className="!w-full"
                size="large"
                value={code}
                onChange={(value) => setCode(value || '')}
              />
              <LoadingButton
                className="!w-full"
                type="primary"
                size="large"
                disabled={!code}
                onClick={async () => {
                  // 更新数据
                  const { success, message: errorMessage } = await H5AuthActions.updateH5Auth({
                    id,
                    mobileCode: code + '',
                  });

                  if (!success) {
                    message.error(errorMessage);
                    return;
                  }

                  message.success('验证码已发送，请耐心等待');
                }}
              >
                确定
              </LoadingButton>
            </div>
          </div>
        )}
        {data?.status === H5AuthStatus.SUCCESS && (
          <div>
            <Result
              status="success"
              title="授权成功"
              extra={
                <Button
                  key="reauth"
                  type="primary"
                  size="large"
                  onClick={() => {
                    try {
                      H5AuthActions.deleteH5Auth(id);
                    } catch (e) {
                      // nothing
                      console.error(e);
                    }

                    router.back();
                  }}
                >
                  继续授权
                </Button>
              }
            />
          </div>
        )}
        {data?.status === H5AuthStatus.FAILED && failed('授权失败')}
      </div>
    </div>
  );
}

export default H5AuthDetailPage;
