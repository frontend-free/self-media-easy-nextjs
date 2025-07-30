'use client';

import { electronApi } from '@/electron';
import { EnumAccountStatus, EnumPlatform } from '@/generated/enums';
import { AutoPublishSetting, PublishResourceType, PublishType } from '@/generated/prisma';
import { App } from 'antd';
import path from 'path';
import * as AccountActions from '../actions/account_actions';
import * as AutoPublishActions from '../actions/auto_publish_actions';
import * as PublishActions from '../actions/publish_actions';
import * as SchoolActions from '../actions/school_actions';
import { useIsDebug } from '../components/debug';
import { isTitleValid } from '../components/form/pro_form_text_with_select';
import { getFileName } from '../components/resource';

async function getVideos({
  autoPublishSetting,
  schoolId,
}: {
  autoPublishSetting: AutoPublishSetting;
  schoolId?: string;
}): Promise<string[] | undefined> {
  console.log('getVideos', { autoPublishSetting, schoolId });
  // 获取视频
  let { data } = await electronApi.getDirectoryVideoFiles({
    directory: autoPublishSetting.resourceVideoDir!,
  });

  // 如果 schoolId 存在，目录下有视频，则取 schoolId 目录下的
  if (schoolId) {
    const { data: dataSchool } = await electronApi.getDirectoryVideoFiles({
      directory: path.join(autoPublishSetting.resourceVideoDir!, schoolId),
    });

    // 覆盖
    if (dataSchool) {
      console.log('取 schoolId 目录下的视频');
      data = dataSchool;
    }
  }

  if (!data) {
    // nothing
    console.log('没有获取到视频文件');
    return undefined;
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
    return undefined;
  }

  // 随机选择最多N个视频
  const randomFilePaths = files
    .sort(() => Math.random() - 0.5)
    .slice(0, autoPublishSetting.publishCount || 2);

  return randomFilePaths;
}

async function getAdText({
  schoolId,
  coachPhone,
}: {
  schoolId: string;
  coachPhone?: string;
}): Promise<string | undefined> {
  console.log('getAdText', { schoolId, coachPhone });
  try {
    const school = await SchoolActions.getSchoolById(schoolId);
    // 如果没有有效信息
    if (!school || !(school.name || school.description || school.address)) {
      return undefined;
    }

    return [
      school.name,
      school.description,
      school.address,
      coachPhone && `报名热线：${coachPhone}`,
    ]
      .filter(Boolean)
      .join('\n');
  } catch (error) {
    // 不报错，返回 undefined
    console.error('获取驾校信息失败', error);
    return undefined;
  }
}

// 授权成功后，创建两个视频发布任务。
async function authedAndCreatePublish({
  accountId,
  schoolId,
  coachPhone,
}: {
  accountId: string;
  schoolId?: string;
  coachPhone?: string;
}) {
  // 获取自动发布目录
  const { data: autoPublishSetting, message: autoPublishSettingMessage } =
    await AutoPublishActions.getAutoPublishSetting();
  if (!autoPublishSetting?.resourceVideoDir) {
    console.log('没有获取到视频目录', autoPublishSettingMessage);
    return;
  }

  const videos = await getVideos({ autoPublishSetting, schoolId });

  if (!videos) {
    return;
  }

  let adText: string | undefined;
  // 如果开启了自动广告
  if (autoPublishSetting.autoAdText && schoolId) {
    adText = await getAdText({ schoolId, coachPhone });
  }

  // 创建发布任务
  videos.forEach((filePath) => {
    PublishActions.createPublish({
      resourceType: PublishResourceType.VIDEO,
      resourceOfVideo: filePath,
      // 如果开启了自动标题，则取文件名作为标题，否则用设置的标题，否则 undefined
      title: autoPublishSetting.autoTitle ? getFileName(filePath) : autoPublishSetting.title,
      description: '',
      // 降级
      adText: adText || '',
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
    schoolId,
    coachPhone,
    h5AuthId,
    silent = false,
  }: {
    platform: EnumPlatform;
    h5AuthId?: string;
    studentId?: string;
    schoolId?: string;
    coachPhone?: string;
    silent?: boolean;
  }) => {
    console.log('onAuth', { platform, h5AuthId, studentId, schoolId, coachPhone, silent });
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
        schoolId,
        coachPhone,
      } as AccountActions.CreateAccountInput);

      // 带 studentId 则认为是 h5 授权来的。 随机发布视频。
      if (studentId) {
        // 不阻塞。
        authedAndCreatePublish({ accountId: account.id, schoolId, coachPhone });
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
