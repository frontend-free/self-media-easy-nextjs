"use client";

import { useState } from "react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { LoginForm, ProFormText } from "@ant-design/pro-components";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { mobile: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("登录成功");
        router.push("/");
      } else {
        const data = await response.json();
        message.error(data.message || "登录失败");
      }
    } catch (error) {
      message.error("登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <LoginForm
          title="驾K先锋-多媒体工具"
          loading={loading}
          onFinish={onFinish}
        >
          <ProFormText
            name="mobile"
            placeholder="请输入手机号"
            required
            rules={[{ required: true }]}
          />
          <ProFormText.Password
            name="password"
            placeholder="请输入密码"
            required
            rules={[{ required: true }]}
          />
        </LoginForm>
      </div>
    </div>
  );
}
