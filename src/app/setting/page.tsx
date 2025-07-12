'use client';

import { electronApi } from '@/electron';
import { Setting } from '@/generated/prisma';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import { App, Divider, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import * as SettingActions from '../actions/setting_actions';

function OpenAtLogin() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    electronApi.openAtLogin().then((res) => {
      setOpen(res.data!.open);
    });
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div>开机自启动</div>
      <Switch
        checked={open}
        onChange={async (checked) => {
          await electronApi.openAtLogin({ open: checked });

          setOpen(checked);
        }}
      />
    </div>
  );
}

function SettingPage() {
  const [form] = ProForm.useForm();

  const [data, setData] = useState<Setting | undefined>(undefined);

  const { message } = App.useApp();

  const getData = useCallback(async () => {
    const { success, data, message } = await SettingActions.getSetting();

    if (!success) {
      throw new Error(message);
    }

    setData(data);
    form.setFieldsValue(data);
  }, [form]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {data && (
        <ProForm
          form={form}
          onFinish={async (values) => {
            await SettingActions.updateSetting(values);

            getData();

            message.success('更新成功');
          }}
        >
          <ProFormSelect
            name="publishCount"
            label="每个账号发布数量"
            options={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
              { label: '4', value: 4 },
              { label: '5', value: 5 },
              { label: '6', value: 6 },
              { label: '7', value: 7 },
              { label: '8', value: 8 },
              { label: '9', value: 9 },
              { label: '10', value: 10 },
            ]}
            extra="每个账号每天最多发布数量，默认 1 个"
          />
        </ProForm>
      )}
      <Divider />
      <OpenAtLogin />
    </div>
  );
}

export default SettingPage;
