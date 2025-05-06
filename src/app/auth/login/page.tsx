'use client';

import * as AuthActions from '@/app/actions/auth_action';
import { LoginForm, ProFormText } from '@ant-design/pro-components';

export default function LoginPage() {
  const onFinish = async (values: { name: string; password: string }) => {
    await AuthActions.login({
      name: values.name,
      password: values.password,
    });
  };

  return (
    <div className="h-screen w-screen items-center justify-center flex bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow">
        <LoginForm title="驾K先锋" subTitle="多媒体" onFinish={onFinish}>
          <ProFormText name="name" required rules={[{ required: true }]} />
          <ProFormText.Password name="password" required rules={[{ required: true }]} />
        </LoginForm>
      </div>
    </div>
  );
}
