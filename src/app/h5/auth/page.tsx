'use client';

import * as H5AuthActions from '@/app/actions/h5_auth_actions';
import { Platform } from '@/app/components/platform';
import { listPlatform } from '@/generated/enums';
import { H5AuthStatus } from '@/generated/prisma';
import { App } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import bg from './bg.jpg';

function H5AuthPage({ searchParams }) {
  const { schoolId, studentId } = use<{ schoolId: string; studentId: string }>(searchParams);
  const { message } = App.useApp();

  const router = useRouter();

  if (!schoolId || !studentId) {
    return <div>缺少驾校ID或学员ID</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Image src={bg} style={{ width: '100%', height: '100%' }} alt="bg" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',

          position: 'absolute',
          top: 100,
          left: 20,
        }}
      >
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>点击下面的平台开启授权</div>
        {listPlatform.map(function (item) {
          return (
            <div
              key={item.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '0.5rem',
              }}
              onTouchStart={function () {
                alert('onTouchStart');
              }}
              onClick={function () {
                alert('test');

                H5AuthActions.createH5Auth({
                  schoolId,
                  studentId,
                  platform: item.value,
                  status: H5AuthStatus.PENDING,
                }).then(({ success, data, message: errorMessage }) => {
                  if (!success) {
                    message.error(errorMessage);
                    return;
                  }

                  router.push(`/h5/auth/${data!.id}`);
                });
              }}
            >
              <Platform value={item.value} />
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '0.5rem' }}>
                <div>{item.label}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {item.originData.authDesc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default H5AuthPage;
