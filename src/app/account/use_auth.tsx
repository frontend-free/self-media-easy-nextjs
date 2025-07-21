'use client';

import { electronApi } from '@/electron';
import { EnumAccountStatus, EnumPlatform } from '@/generated/enums';
import { PublishResourceType, PublishType } from '@/generated/prisma';
import { App } from 'antd';
import * as AccountActions from '../actions/account_actions';
import * as AutoPublishActions from '../actions/auto_publish_actions';
import * as PublishActions from '../actions/publish_actions';
import * as SchoolActions from '../actions/school_actions';
import { useIsDebug } from '../components/debug';
import { isTitleValid } from '../components/form/pro_form_text_with_select';
import { getFileName } from '../components/resource';

// 授权成功后，创建两个视频发布任务。
async function authedAndCreatePublish(accountId: string) {
  // 获取自动发布目录
  const { data: autoPublishSetting, message: autoPublishSettingMessage } =
    await AutoPublishActions.getAutoPublishSetting();
  if (!autoPublishSetting?.resourceVideoDir) {
    console.log('没有获取到视频目录', autoPublishSettingMessage);
    return;
  }

  // 获取视频
  const { data, message } = await electronApi.getDirectoryVideoFiles({
    directory: autoPublishSetting.resourceVideoDir,
  });

  if (!data) {
    // nothing
    console.log('没有获取到视频文件', message);
    return;
  }

  let files = data?.filePaths || [];

  // 如果开启了自动标题，则过滤下不合法的标题
  if (autoPublishSetting.autoTitle) {
    files = files.filter((file) => {
      const fileName = getFileName(file);
      return isTitleValid(fileName);
    });
  }

  if (files.length === 0) {
    // nothing
    console.log('没有视频文件');
    return;
  }

  // 随机选择最多N个视频
  const randomFilePaths = files
    .sort(() => Math.random() - 0.5)
    .slice(0, autoPublishSetting.publishCount || 2);

  let adTexts: string[] = [];
  // 如果开启了自动广告
  if (autoPublishSetting.autoAdText) {
    const { data: schools } = await SchoolActions.pageSchools({
      pageSize: 1000,
      current: 1,
    });

    // 有名字则认为有效
    const validSchools = schools.filter((item) => item.name);
    if (validSchools.length === 0) {
      console.log('没有驾校信息');
    }

    adTexts = validSchools.map((item) => {
      const arr: string[] = [];
      if (item.name) {
        arr.push(item.name);
      }
      if (item.phone) {
        arr.push('驾校电话 ' + item.phone);
      }
      if (item.address) {
        arr.push('驾校地址 ' + item.address);
      }
      return arr.join('\n');
    });

    // 随机选择最多N个文案
    const randomAdTexts = adTexts
      .sort(() => Math.random() - 0.5)
      .slice(0, autoPublishSetting.publishCount || 2);
    adTexts = randomAdTexts;
  }

  // 创建发布任务
  randomFilePaths.forEach((filePath, index) => {
    PublishActions.createPublish({
      resourceType: PublishResourceType.VIDEO,
      resourceOfVideo: filePath,
      // 如果开启了自动标题，则取文件名作为标题，否则用设置的标题，否则 undefined
      title: autoPublishSetting.autoTitle ? getFileName(filePath) : autoPublishSetting.title,
      description: '',
      // 降级
      adText: adTexts[index] || adTexts[0] || '',
      accountIds: [accountId],
      publishType: PublishType.OFFICIAL,
    });
  });
}

function useAuth() {
  const { modal, message } = App.useApp();
  const { isDebug } = useIsDebug();

  const onAuth = async ({
    platform,
    studentId,
    h5AuthId,
    silent = false,
  }: {
    platform: EnumPlatform;
    h5AuthId?: string;
    studentId?: string;
    silent?: boolean;
  }) => {
    const res = await electronApi.platformAuth({ platform, h5AuthId, isDebug });

    if (res.success && res.data) {
      const account = await AccountActions.createAccount({
        platform,
        platformId: res.data.platformId || null,
        platformName: res.data.platformName || null,
        platformAvatar: res.data.platformAvatar || null,

        status: EnumAccountStatus.AUTHED,
        authInfo: res.data.authInfo || null,
        authedAt: new Date(),
        logs: JSON.stringify(res.data.logs || []),

        studentId,
      } as AccountActions.CreateAccountInput);

      // 带 studentId 则认为是 h5 授权来的。 随机发布视频。
      if (studentId) {
        // 不阻塞。
        authedAndCreatePublish(account.id);
      }

      message.success('授权成功');
    } else {
      if (!silent) {
        modal.error({
          title: '授权失败',
          content: (
            <div>
              <div>{res.message || '未知错误'}</div>
              <pre className="whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {JSON.stringify(res.data, null, 2)}
              </pre>
            </div>
          ),
        });
      }

      return Promise.reject();
    }
  };

  const onAuthCheck = async ({ id, platform, authInfo, status }) => {
    const res = await electronApi.platformAuthCheck({ platform, authInfo, isDebug });

    if (res.success) {
      message.success('账号授权信息有效');
    } else {
      message.error('账号授权信息无效');
      if (status === EnumAccountStatus.AUTHED) {
        await AccountActions.updateAccount({
          id,
          status: EnumAccountStatus.INVALID,
          logs: JSON.stringify(res.data?.logs || []),
        });
      }
    }
  };

  return { onAuth, onAuthCheck };
}

export { useAuth };
