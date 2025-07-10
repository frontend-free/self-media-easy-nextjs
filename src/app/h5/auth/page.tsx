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
    return <div className="text-center p-4">缺少驾校ID或学员ID</div>;
  }

  return (
    <div className="flex flex-col gap-4 h-screen w-screen">
      <Image src={bg} className="w-full h-full" alt="bg" />
      <div className=" flex flex-col justify-center gap-4 absolute top-[100px] left-[20px]">
        <div className=" text-2xl">点击下面的平台开启授权</div>
        {listPlatform.map((item) => (
          <div
            key={item.value}
            className="flex items-center cursor-pointer gap-2"
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
            <div className="flex flex-col">
              <div>{item.label}</div>
              <div className="text-sm text-gray-500">{item.originData.authDesc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default H5AuthPage;
