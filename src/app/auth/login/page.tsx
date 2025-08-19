'use client';

import * as AuthActions from '@/app/actions/auth_actions';
import { handleFinish } from '@/app/components/crud';
import { globalConfig } from '@/app/config';
import logo from '@/assets/logo.png';
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
    <div className="h-screen w-screen items-center justify-center flex shadow-lg">
      <div className="p-8 bg-white rounded-lg shadow">
        <LoginForm onFinish={handleFinish(onFinish)}>
          <div className="mb-10 flex flex-col items-center gap-2">
            <Image src={logo} alt="logo" className="w-[100px] h-[100px]" />
            <span className="text-2xl font-bold">{globalConfig.title}</span>
            <span className="text-sm text-gray-500 text-center">{globalConfig.description}</span>
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
