'use client';

import * as AutoPublishActions from '@/app/actions/auto_publish_actions';
import * as PublishActions from '@/app/actions/publish_actions';
import { electronApi } from '@/electron';
import { AccountStatus, PublishResourceType, PublishType } from '@/generated/prisma';
import { useEffect } from 'react';

const INTERVAL = 30 * 60 * 1000;

async function runAutoPublish() {
  const { success, data: autoPublishSetting } = await AutoPublishActions.getAutoPublishSetting();

  console.log('autoPublishSetting', autoPublishSetting);

  if (!success || !autoPublishSetting) {
    console.log('获取自动发布设置失败');
    return;
  }

  const { resourceVideoDir, accounts: originalAccounts, lastRunAt, title } = autoPublishSetting;

  const accounts = originalAccounts.filter(
    (account) => !account.deletedAt && account.status === AccountStatus.AUTHED,
  );

  if (!resourceVideoDir || !accounts.length) {
    console.log('参数错误，请检查');
    return;
  }

  const { data: res } = await electronApi.getDirectoryVideoFiles({
    directory: resourceVideoDir,
    lastRunAt: lastRunAt ?? undefined,
  });

  console.log('res', res);
  const files = res?.filePaths || [];

  if (!files || !files.length) {
    console.log('没有待发布的文件');
    return;
  }

  // 创建发布
  for (const file of files) {
    await PublishActions.createPublish({
      resourceType: PublishResourceType.VIDEO,
      resourceOfVideo: file,
      title,
      description: '',
      publishType: PublishType.OFFICIAL,
      accountIds: accounts.map((account) => account.id),
    });
  }

  // 更新自动发布设置
  await AutoPublishActions.updateAutoPublishSetting({
    ...autoPublishSetting,
    lastRunAt: new Date(),
  });
}

function AutoRunPublishComponent() {
  useEffect(() => {
    if (!electronApi.isElectron()) {
      return;
    }

    const timer = setInterval(() => {
      // 先不自动运行
      // runAutoPublish();
    }, INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return null;
}

export { AutoRunPublishComponent, runAutoPublish };
