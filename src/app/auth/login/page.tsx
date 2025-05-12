'use client';

import * as AuthActions from '@/app/actions/auth_action';
import { handleFinish } from '@/app/components/crud';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const onFinish = async (values: { name: string; password: string }) => {
    try {
      await AuthActions.login({
        name: values.name,
        password: values.password,
      });
      router.push('/');
      window.location.reload();
    } catch (error) {
      console.error(error);
      throw new Error('用户名或密码错误');
    }
  };

  return (
    <div className="h-screen w-screen items-center justify-center flex bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow">
        <LoginForm title="驾K先锋" subTitle="多媒体" onFinish={handleFinish(onFinish)}>
          <ProFormText name="name" required rules={[{ required: true }]} />
          <ProFormText.Password name="password" required rules={[{ required: true }]} />
        </LoginForm>
      </div>
    </div>
  );
}
