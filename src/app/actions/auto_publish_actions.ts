'use server';

import { Account, AutoPublishSetting } from '@/generated/prisma';
import { needAuth, prisma, wrapServerAction } from './helper';

export type UpdateAutoPublishSettingInput = Partial<
  Pick<AutoPublishSetting, 'resourceVideoDir' | 'title' | 'lastRunAt'>
> & { accountIds?: string[] };

export type AutoPublishSettingWithRelations = AutoPublishSetting & {
  accounts: Account[];
};

export async function getAutoPublishSetting() {
  return wrapServerAction(async () => {
    const { sessionUser } = await needAuth();

    let result = await prisma.autoPublishSetting.findUnique({
      where: {
        id: sessionUser.id,
      },
      include: {
        accounts: true,
      },
    });

    if (!result) {
      await prisma.autoPublishSetting.create({
        data: {
          id: sessionUser.id,
          lastRunAt: new Date(),
        },
      });

      result = await prisma.autoPublishSetting.findUnique({
        where: {
          id: sessionUser.id,
        },
        include: {
          accounts: true,
        },
      });
    }

    return result as AutoPublishSettingWithRelations;
  });
}

export async function updateAutoPublishSetting(data?: UpdateAutoPublishSettingInput) {
  return wrapServerAction(async () => {
    const { sessionUser } = await needAuth();

    const { accountIds, ...rest } = data || {};
    await prisma.autoPublishSetting.update({
      where: {
        id: sessionUser.id,
      },
      data: {
        ...rest,
        accounts: {
          connect: accountIds?.map((id) => ({ id })),
        },
      },
    });
  });
}
