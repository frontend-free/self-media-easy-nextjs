'use client';

import * as H5AuthActions from '@/app/actions/h5_auth_actions';
import { LoadingButton } from '@/app/components/loading_button';
import { EnumPlatform, valueEnumPlatform } from '@/generated/enums';
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
    }, 1000);

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <div
        style={{
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1 }}>
          <Button type="link" size="large" onClick={() => router.back()}>
            返回
          </Button>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          {data?.platform && valueEnumPlatform[data.platform]?.text}
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>{Math.floor(countdown / 1000)}s</div>
      </div>
      <div
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {data?.status === H5AuthStatus.PENDING && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div>二维码准备中</div>
            <Spin />
          </div>
        )}
        {(data?.status === H5AuthStatus.QRCODE || data?.status === H5AuthStatus.MOBILE_CODE) && (
          <div>
            <div>1 扫码登录。</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {data?.qrcode ? (
                <Image src={data.qrcode || ''} alt="qrcode" width={200} height={200} />
              ) : (
                <Spin />
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
            <div>2 验证码。</div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ textAlign: 'center' }}>请输入抖音发送的短信验证码。</div>
              <InputNumber
                style={{ width: '100%' }}
                size="large"
                value={code}
                onChange={(value) => setCode(value || '')}
              />
              <LoadingButton
                style={{ width: '100%' }}
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
