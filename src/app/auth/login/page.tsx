'use client';

import * as AuthActions from '@/app/actions/auth_actions';
import { globalConfig } from '@/app/config';
import logo from '@/assets/logo.png';
import { handleFinish } from '@/components/crud';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import Image from 'next/image';
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
    <div className="flex h-screen w-screen items-center justify-center shadow-lg">
      <div className="rounded-lg bg-white p-8 shadow">
        <LoginForm onFinish={handleFinish(onFinish)}>
          <div className="mb-10 flex flex-col items-center gap-2">
            <Image src={logo} alt="logo" className="h-[100px] w-[100px]" />
            <span className="text-center text-sm">{globalConfig.description}</span>
          </div>
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
