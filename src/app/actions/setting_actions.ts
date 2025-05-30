'use server';

import { Setting } from '@/generated/prisma';
import { needAuth, prisma, wrapServerAction } from './helper';

export type UpdateSettingInput = Partial<Pick<Setting, 'publishCount'>>;

export async function getSetting() {
  return wrapServerAction(async () => {
    const { sessionUser } = await needAuth();

    let result = await prisma.setting.findUnique({
      where: {
        id: sessionUser.id,
      },
    });

    if (!result) {
      await prisma.setting.create({
        data: {
          id: sessionUser.id,
        },
      });

      result = await prisma.setting.findUnique({
        where: {
          id: sessionUser.id,
        },
      });
    }

    return result as Setting;
  });
}

export async function updateSetting(data: UpdateSettingInput) {
  return wrapServerAction(async () => {
    const { sessionUser } = await needAuth();

    // 更新设置
    await prisma.setting.update({
      where: {
        id: sessionUser.id,
      },
      data,
    });
  });
}
