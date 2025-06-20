'use client';

import { electronApi } from '@/electron';
import { Setting } from '@/generated/prisma';
import { ModalForm, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Alert, Button, Switch } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as SettingActions from '../actions/setting_actions';

function Detail({
  data,
  onFinish,
  children,
}: {
  data?: any;
  onFinish: (values: any) => Promise<boolean | void>;
  children: React.ReactNode;
}) {
  return (
    <ModalForm
      trigger={children}
      autoFocusFirstInput
      modalProps={{
        destroyOnHidden: true,
      }}
      initialValues={data}
      onFinish={onFinish}
    >
      <ProFormText name="roomId" label="直播间ID" />
      <ProFormText name="description" label="备注" />
      <ProFormSwitch name="auto" label="自动录制" />
    </ModalForm>
  );
}

function RecordItem({ item, onItem }) {
  useEffect(() => {}, []);

  return (
    <div key={item.roomId} className="flex gap-4 items-center c-border-bottom p-2">
      <div>直播间ID: {item.roomId}</div>
      <div>备注: {item.description}</div>
      <div>
        自动录制&nbsp;&nbsp;
        <Switch
          checked={item.auto}
          onChange={async (checked) => {
            onItem({
              ...item,
              auto: checked,
            });
          }}
        />
      </div>
      <Detail
        data={item}
        onFinish={async (values) => {
          onItem({
            ...item,
            ...values,
          });
          return true;
        }}
      >
        <Button
          type="link"
          onClick={() => {
            onItem({
              ...item,
              auto: !item.auto,
            });
          }}
        >
          编辑
        </Button>
      </Detail>
      <Button
        type="link"
        danger
        onClick={() => {
          onItem(undefined);
        }}
      >
        删除
      </Button>
    </div>
  );
}

function Records() {
  const [data, setData] = useState<Setting | undefined>(undefined);

  const refresh = useCallback(async () => {
    const { success, data, message } = await SettingActions.getSetting();

    if (!success) {
      throw new Error(message);
    }

    setData(data);
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const recorderList = useMemo(() => {
    return data?.recorderList ? JSON.parse(data.recorderList) : [];
  }, [data]);

  return (
    <div className="flex flex-col gap-2">
      <Alert message="请根据自身网络情况，设置录制直播间数量，一般 5 个左右。" type="info" />
      <div className="flex items-center gap-2">
        视频存放目录：
        <Button
          onClick={async () => {
            const res = await electronApi.showOpenDialogOfOpenDirectory();
            if (res.success) {
              SettingActions.updateSetting({
                recorderOutputDir: res.data?.filePaths[0] || undefined,
              });
              refresh();
            }
          }}
        >
          选择目录
        </Button>
        {data?.recorderOutputDir}
      </div>
      {recorderList.map((item, index) => (
        <RecordItem
          key={item.roomId}
          item={item}
          onItem={(newItem) => {
            let newRecorderList = [...recorderList];
            newRecorderList[index] = newItem;
            newRecorderList = newRecorderList.filter((item) => !!item);

            SettingActions.updateSetting({ recorderList: JSON.stringify(newRecorderList) });

            refresh();
          }}
        />
      ))}
      <div className="flex items-center gap-2">
        <Detail
          onFinish={async (values) => {
            const newRecorderList = [...recorderList, values];

            SettingActions.updateSetting({ recorderList: JSON.stringify(newRecorderList) });

            refresh();

            return true;
          }}
        >
          <Button type="primary">添加直播间</Button>
        </Detail>
      </div>
    </div>
  );
}

function RecorderPage() {
  return (
    <div>
      <Records />
    </div>
  );
}

export default RecorderPage;
