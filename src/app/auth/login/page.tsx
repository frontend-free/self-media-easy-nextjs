'use client';

import * as AuthActions from '@/app/actions/auth_actions';
import { handleFinish } from '@/app/components/crud';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const onFinish = async (values: { name: string; password: string }) => {
    const { success } = await AuthActions.login({
      name: values.name,
      password: values.password,
    });

    if (!success) {
      throw new Error('用户名或密码错误');
    }

    router.push('/');
    window.location.reload();
  };

  return (
    <div className="h-screen w-screen items-center justify-center flex bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow">
        <LoginForm
          title="驾K先锋-多媒体"
          subTitle={<div>每年给驾校/教练带来10-100倍招生广告效果！</div>}
          onFinish={handleFinish(onFinish)}
        >
          <ProFormText name="name" required rules={[{ required: true }]} />
          <ProFormText.Password name="password" required rules={[{ required: true }]} />
        </LoginForm>
      </div>
    </div>
  );
}
