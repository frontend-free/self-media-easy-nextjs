'use client';

import * as AuthActions from '@/app/actions/auth_actions';
import { handleFinish } from '@/app/components/crud';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
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
    <div className="h-screen w-screen items-center justify-center flex">
      <div className="p-8 bg-white rounded-lg shadow">
        <LoginForm title="短视频工具" onFinish={handleFinish(onFinish)}>
          <div className="mt-4"></div>
          <ProFormText
            name="name"
            required
            rules={[{ required: true, message: '请输入用户名' }]}
            fieldProps={{
              size: 'large',
              placeholder: '请输入用户名',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
          />
          <ProFormText.Password
            name="password"
            required
            rules={[{ required: true, message: '请输入密码' }]}
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
              placeholder: '请输入密码',
            }}
          />
        </LoginForm>
      </div>
    </div>
  );
}
