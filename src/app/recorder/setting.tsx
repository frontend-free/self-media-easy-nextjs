'use client';

import { electronApi } from '@/electron';
import { RecorderInfo } from '@/electron/electron_recorder';
import { TagRecorderStatus } from '@/generated/enums';
import { ModalForm, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { usePrevious } from 'ahooks';
import { Alert, App, Button, Divider, Tag } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as SettingActions from '../actions/setting_actions';
import { LoadingButton } from '../components/loading_button';

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
      <ProFormText
        name="roomId"
        label="直播间ID或者贴入直播间地址"
        extra="如 46766877522，或者 https://live.douyin.com/46766877522"
        rules={[{ required: true }]}
        transform={(value) => {
          if (value.includes('live.douyin.com/')) {
            return new URL(value).pathname.slice(1);
          }
          return value;
        }}
        disabled={!!data?.roomId}
      />
      <ProFormText name="description" label="备注" />
      <ProFormSwitch name="auto" label="自动录制" />
    </ModalForm>
  );
}

function RecordItem({ item, onItem, info }) {
  useEffect(() => {}, []);

  return (
    <div key={item.roomId} className="flex gap-4 items-center c-border-bottom p-2">
      <div>直播间ID: {item.roomId}</div>
      <div>备注: {item.description}</div>
      <div>
        自动录制: <Tag color={item.auto ? 'green' : 'default'}>{item.auto ? '开启' : '关闭'}</Tag>
      </div>
      <div>
        状态: &nbsp;
        <TagRecorderStatus value={info?.status} />
      </div>

      <div className="flex-1"></div>
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
        <Button type="link" className="!px-0">
          编辑
        </Button>
      </Detail>
      <Button
        type="link"
        className="!px-0"
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

function FFMPEGCheck() {
  const [isInstalled, setIsInstalled] = useState(false);
  const { message } = App.useApp();

  const checkFfmpeg = async () => {
    const res = await electronApi.checkFfmpeg();
    setIsInstalled(!!res.data);
    return res;
  };

  useEffect(() => {
    checkFfmpeg();
  }, []);

  return (
    <Alert
      type={isInstalled ? 'info' : 'error'}
      message={
        <div>
          <span>请确保本地已安装好 ffmpeg 插件：</span>
          {isInstalled ? (
            <span>已安装。</span>
          ) : (
            <>
              <LoadingButton
                type="link"
                className="!px-0"
                onClick={async () => {
                  const res = await checkFfmpeg();

                  if (res.data) {
                    message.success('已安装');
                    setIsInstalled(true);
                    return;
                  }

                  message.info('未安装，开始安装...');
                  await electronApi.installFfmpeg();
                  await checkFfmpeg();
                  message.success('安装成功');
                }}
              >
                点我检查和安装
              </LoadingButton>
              <span>，请耐心等待，大约 70MB。</span>
            </>
          )}
        </div>
      }
    />
  );
}

function Records({ data, refresh }) {
  const { message } = App.useApp();
  const recorderList = useMemo(() => {
    return data?.recorderList ? JSON.parse(data.recorderList) : [];
  }, [data]);

  const autoRoomIds = useMemo(() => {
    return recorderList.filter((item) => item.auto).map((item) => item.roomId);
  }, [recorderList]);

  const [infos, setInfos] = useState<Record<string, RecorderInfo>>({});

  const doAutoCheckAndRecord = useCallback(async () => {
    for (const roomId of autoRoomIds) {
      // 没目录，忽略
      if (!data?.recorderOutputDir) {
        return;
      }

      await electronApi.autoCheckAndRecord({
        roomId,
        outputDir: data.recorderOutputDir,
      });
    }
  }, [autoRoomIds, data?.recorderOutputDir]);

  useEffect(() => {
    // 一分钟检查一次 autoCheckAndRecord
    const timer = setInterval(() => {
      doAutoCheckAndRecord();
    }, 1000 * 60);

    // 开始扫描一次
    doAutoCheckAndRecord();

    return () => {
      clearInterval(timer);
    };
  }, [doAutoCheckAndRecord]);

  useEffect(() => {
    async function getRecords() {
      const res = await electronApi.getRecorders();

      setInfos(res.data || {});
    }

    // 5s 检查一次状态
    const timer = setInterval(() => {
      getRecords();
    }, 1000 * 5);

    return () => {
      clearInterval(timer);
    };
  }, [autoRoomIds]);

  const preAutoRoomIds = usePrevious(autoRoomIds);
  // 自动录制状态变更的，则停止
  useEffect(() => {
    preAutoRoomIds
      ?.filter((id) => !autoRoomIds.includes(id))
      .forEach((roomId) => {
        electronApi.stopRecord({
          roomId,
        });
      });
  }, [autoRoomIds, preAutoRoomIds]);

  return (
    <div className="flex flex-col gap-2">
      <FFMPEGCheck />
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
      <Divider />
      <div className="flex items-center gap-2">
        <Detail
          onFinish={async (values) => {
            const exist = recorderList.find((item) => item.roomId === values.roomId);
            if (exist) {
              message.error('直播间已存在');
              return false;
            }

            const newRecorderList = [...recorderList, values];

            SettingActions.updateSetting({ recorderList: JSON.stringify(newRecorderList) });

            refresh();

            return true;
          }}
        >
          <Button type="primary">添加直播间</Button>
        </Detail>
        <span className="text-gray-500">
          请根据自身网络情况设置录制直播间数量，一般同时直播 3 个左右。
        </span>
        <div className="flex-1"></div>
        <span className="text-gray-500">默认一分钟扫描一次</span>
        <LoadingButton
          onClick={async () => {
            await doAutoCheckAndRecord();
            message.info('扫描中');

            return new Promise((resolve) => {
              setTimeout(() => resolve(), 500);
            });
          }}
        >
          立即扫描
        </LoadingButton>
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
          info={infos[item.roomId]}
        />
      ))}
    </div>
  );
}

export { Records };
