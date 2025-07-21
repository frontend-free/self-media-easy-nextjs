'use client';

import { electronApi } from '@/electron';
import { AutoPublishSetting } from '@/generated/prisma';
import {
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { Alert, App, Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import * as AutoPublishActions from '../actions/auto_publish_actions';
import { ProFormTextWithSelect } from '../components/form/pro_form_text_with_select';

function Directory(props: { value: string; onChange: (value?: string) => void }) {
  const { value, onChange } = props;

  return (
    <div className="flex flex-row items-center gap-2">
      <Button
        onClick={async () => {
          const res = await electronApi.showOpenDialogOfOpenDirectory();
          if (res.success) {
            onChange?.(res.data?.filePaths[0] || undefined);
          }
        }}
      >
        选择目录
      </Button>
      <div>{value}</div>
    </div>
  );
}

function ProFormDirectory(props) {
  /* eslint-disable-next-line */
  const { cacheForSwr, proFieldKey, onBlur, fieldProps, ...rest } = props;

  return (
    <ProForm.Item {...rest}>
      <Directory {...fieldProps} />
    </ProForm.Item>
  );
}

function Page() {
  const { message } = App.useApp();

  const [form] = ProForm.useForm();

  const [data, setData] = useState<AutoPublishSetting | undefined>(undefined);

  const getData = useCallback(async () => {
    const { success, data, message } = await AutoPublishActions.getAutoPublishSetting();

    if (!success) {
      throw new Error(message);
    }

    setData(data);

    form.setFieldsValue(data);
  }, [form]);

  useEffect(() => {
    getData();
  }, []);

  const autoTitle = ProForm.useWatch('autoTitle', form);
  useEffect(() => {
    if (autoTitle) {
      form.setFieldValue('title', '');
    }
  }, [autoTitle, form]);

  return (
    <div>
      <div className="mb-4">
        <Alert message="授权成功会从目录随机挑选 2 个视频，并随机贴上广告，之后发布。" />
      </div>
      <div>
        {data && (
          <ProForm
            form={form}
            onFinish={async (values) => {
              await AutoPublishActions.updateAutoPublishSetting(values);

              getData();

              message.success('更新成功');
            }}
          >
            <ProFormDirectory
              name="resourceVideoDir"
              label="视频目录"
              required
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="publishCount"
              label="发布数量"
              required
              rules={[{ required: true }]}
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
            />
            <ProFormSwitch
              name="autoAdText"
              label="自动广告文案"
              required
              extra="自动取驾校信息作为文案，剪辑到视频左上角。"
            />
            <ProFormSwitch
              name="autoTitle"
              label="自动标题"
              required
              extra="取视频文件名作为标题，但是按标题的规则填入，非法标题会过滤。"
            />
            <ProFormDependency name={['autoTitle']}>
              {({ autoTitle }) => {
                return (
                  <ProFormTextWithSelect name="title" label="标题" fieldProps={{ autoTitle }} />
                );
              }}
            </ProFormDependency>
          </ProForm>
        )}
      </div>
    </div>
  );
}

export default Page;
