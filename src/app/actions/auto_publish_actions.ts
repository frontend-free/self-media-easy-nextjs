'use server';

import { AutoPublishSetting } from '@/generated/prisma';
import { needAuth, prisma, wrapServerAction } from './helper';

export type UpdateAutoPublishSettingInput = Partial<
  Pick<AutoPublishSetting, 'resourceVideoDir' | 'title' | 'autoTitle' | 'publishCount'>
> & { accountIds?: string[] };

export async function getAutoPublishSetting() {
  return wrapServerAction(async () => {
    const { sessionUser } = await needAuth();

    let result = await prisma.autoPublishSetting.findUnique({
      where: {
        id: sessionUser.id,
      },
    });

    if (!result) {
      await prisma.autoPublishSetting.create({
        data: {
          id: sessionUser.id,
        },
      });

      result = await prisma.autoPublishSetting.findUnique({
        where: {
          id: sessionUser.id,
        },
      });
    }

    return result as AutoPublishSetting;
  });
}

export async function updateAutoPublishSetting(data: UpdateAutoPublishSettingInput) {
  return wrapServerAction(async () => {
    const { sessionUser } = await needAuth();

    // 更新设置
    await prisma.autoPublishSetting.update({
      where: {
        id: sessionUser.id,
      },
      data,
    });
  });
}
