'use client';

import * as H5AuthActions from '@/app/actions/h5_auth_actions';
import { Platform } from '@/app/components/platform';
import { listPlatform } from '@/generated/enums';
import { H5AuthStatus } from '@/generated/prisma';
import { Alert, App } from 'antd';
import { useRouter } from 'next/navigation';
import { use } from 'react';

function H5AuthPage({ searchParams }) {
  const { schoolId, studentId } = use<{ schoolId: string; studentId: string }>(searchParams);
  const { message } = App.useApp();

  const router = useRouter();

  if (!schoolId || !studentId) {
    return <div className="text-center p-4">缺少驾校ID或学员ID</div>;
  }

  return (
    <div className="flex flex-col gap-4 h-screen w-screen">
      <div className="p-4">
        <Alert
          message={
            <div>
              请提前准备好扫码，避免二维码过期。
              <br />
              抖音：打开「抖音APP」点击左上角 三 进行扫一扫。
            </div>
          }
          type="info"
        />
      </div>
      <div className="flex-1 flex justify-center gap-4">
        {listPlatform.map((item) => (
          <div
            key={item.value}
            className="flex flex-col items-center cursor-pointer gap-2 w-[100px]"
            onClick={async () => {
              const {
                success,
                data,
                message: errorMessage,
              } = await H5AuthActions.createH5Auth({
                schoolId,
                studentId,
                platform: item.value,
                status: H5AuthStatus.PENDING,
              });

              if (!success) {
                message.error(errorMessage);
                return;
              }

              router.push(`/h5/auth/${data!.id}`);
            }}
          >
            <Platform value={item.value} />
            <div>{item.label}</div>
            <div className="text-sm text-gray-500">{item.originData.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default H5AuthPage;
