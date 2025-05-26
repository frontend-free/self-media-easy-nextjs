'use client';

import * as AutoPublishActions from '@/app/actions/auto_publish_actions';
import * as PublishActions from '@/app/actions/publish_actions';
import { electronApi } from '@/electron';
import { AccountStatus, PublishResourceType, PublishType } from '@/generated/prisma';
import { App } from 'antd';
import { useEffect } from 'react';
import { getMatchTitle } from './form/pro_form_text_with_select';

const INTERVAL = 30 * 60 * 1000;

async function runAutoPublish({ notification }) {
  const { success, data: autoPublishSetting } = await AutoPublishActions.getAutoPublishSetting();

  console.log('autoPublishSetting', autoPublishSetting);

  if (!success || !autoPublishSetting) {
    console.log('获取自动发布设置失败');
    return;
  }

  if (!autoPublishSetting.enabled) {
    console.log('自动发布未启用');
    return;
  }

  const {
    resourceVideoDir,
    accounts: originalAccounts,
    title,
    autoTitle,
    runResourceOfVideos,
  } = autoPublishSetting;

  const accounts = originalAccounts.filter(
    (account) => !account.deletedAt && account.status === AccountStatus.AUTHED,
  );

  if (!resourceVideoDir || !accounts.length) {
    console.log('参数错误，请检查');
    return;
  }

  // 获取到文件列表
  const { data: res } = await electronApi.getDirectoryVideoFiles({
    directory: resourceVideoDir,
  });

  console.log('res', res);

  // 更新自动发布设置
  const { success: updateSuccess, message: updateMessage } =
    await AutoPublishActions.updateAutoPublishSetting({
      // 全部文件
      runResourceOfVideos: JSON.stringify(res?.filePaths || []),
      lastRunAt: new Date(),
    });

  if (!updateSuccess) {
    notification.error({
      message: updateMessage,
    });
    return;
  }

  const hasRunFiles = runResourceOfVideos ? JSON.parse(runResourceOfVideos) : [];
  const files = (res?.filePaths || []).filter((file) => !hasRunFiles.includes(file));
  console.log('待发布的文件', files);

  if (!files.length) {
    notification.info({
      message: `没有待发布的文件`,
    });
    console.log('没有待发布的文件');
    return;
  }

  // 继续过滤出合法的文件
  const validFiles = files.filter((file) => {
    const title = file.split('/').pop()?.split('.')[0];
    const matchTitle = getMatchTitle(title);
    return matchTitle.length >= 6 && matchTitle.length <= 30;
  });
  const validFilesTitle = validFiles.map((file) => file.split('/').pop()?.split('.')[0]);
  console.log('合法未扫描文件', validFilesTitle, validFilesTitle);

  let message = `待发布视频文件 ${files.length} 个。`;

  if (validFiles.length !== files.length) {
    message += `但有 ${files.length - validFiles.length} 个文件被跳过，因为标题不合法。`;
  }

  notification.info({
    message,
  });

  // 创建发布
  validFiles.forEach((file, index) => {
    const fileTitle = validFilesTitle[index]!;

    PublishActions.createPublish({
      resourceType: PublishResourceType.VIDEO,
      resourceOfVideo: file,
      title: (autoTitle ? fileTitle : title) || '',
      description: '',
      publishType: PublishType.OFFICIAL,
      accountIds: accounts.map((account) => account.id),
    });
  });
}

function AutoRunPublishComponent() {
  const { notification } = App.useApp();

  useEffect(() => {
    if (!electronApi.isElectron()) {
      return;
    }

    const timer = setInterval(async () => {
      const { success, data: autoPublishSetting } =
        await AutoPublishActions.getAutoPublishSetting();

      // 启用才运行
      if (success && autoPublishSetting && autoPublishSetting.enabled) {
        await runAutoPublish({ notification });
      }
    }, INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return null;
}

export { AutoRunPublishComponent, runAutoPublish };
