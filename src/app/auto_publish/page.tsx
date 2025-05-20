'use client';

import { electronApi } from '@/electron';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Alert, App, Button, Divider } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import * as AutoPublishActions from '../actions/auto_publish_actions';
import { AutoPublishSettingWithRelations } from '../actions/auto_publish_actions';
import { runAutoPublish } from '../components/auto_run_publish';
import { ProFormSelectAccounts } from '../components/form/pro_form_select_accounts';

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
  const [form] = ProForm.useForm();
  const [data, setData] = useState<
    (AutoPublishSettingWithRelations & { accountIds: string[] }) | undefined
  >(undefined);

  const { message } = App.useApp();

  const getData = useCallback(async () => {
    const { success, data, message } = await AutoPublishActions.getAutoPublishSetting();

    if (!success) {
      throw new Error(message);
    }

    setData({
      ...data!,
      accountIds: data!.accounts.map((account) => account.id) || [],
    });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Alert message="每30分钟扫描目录，扫描出新的视频文件，并发布！" />
      <div className="mt-4 flex flex-row justify-end">
        <Button
          type="primary"
          onClick={() => {
            runAutoPublish();
          }}
        >
          手动触发扫描
        </Button>
      </div>
      <Divider />
      <div>
        {data && (
          <ProForm
            key={data.updatedAt.getTime()}
            form={form}
            initialValues={data}
            onFinish={async (values) => {
              await AutoPublishActions.updateAutoPublishSetting(values);

              getData();

              message.success('更新成功');
            }}
          >
            <ProFormDirectory
              name="resourceVideoDir"
              label="目录"
              required
              rules={[{ required: true }]}
            />
            <ProFormText
              name="title"
              label="标题"
              required
              rules={[
                {
                  required: true,
                  min: 6,
                  message: '标题至少需要6个字',
                },
              ]}
            />
            <ProFormSelectAccounts
              name="accountIds"
              label="账号"
              required
              rules={[{ required: true }]}
            />
          </ProForm>
        )}
      </div>
    </div>
  );
}

export default Page;
