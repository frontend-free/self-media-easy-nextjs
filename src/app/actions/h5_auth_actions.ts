'use server';

import { needAuth, prisma, wrapServerAction } from '@/app/actions/helper';
import { H5Auth, H5AuthStatus } from '@/generated/prisma';

export type CreateH5AuthInput = Pick<H5Auth, 'platform' | 'status' | 'schoolId' | 'studentId'>;
export type UpdateH5AuthInput = Partial<Pick<H5Auth, 'qrcode' | 'mobileCode' | 'status'>> & {
  id: string;
};

// 需登录
export async function listH5Auths() {
  return wrapServerAction(async () => {
    const { sessionUser } = await needAuth();

    // 找出超时的
    const willDeletes = await prisma.h5Auth.findMany({
      where: {
        userId: sessionUser.id,
        deletedAt: null,
        createdAt: {
          // 正常 5min 超时，避免莫名问题，10分钟的都删除
          lte: new Date(Date.now() - 1000 * 60 * 10),
        },
      },
    });
    // 删除超时的
    if (willDeletes.length > 0) {
      await prisma.h5Auth.updateMany({
        where: {
          id: {
            in: willDeletes.map((item) => item.id),
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }

    // 在查询
    return await prisma.h5Auth.findMany({
      where: {
        userId: sessionUser.id,
        status: H5AuthStatus.PENDING,
        deletedAt: null,
      },
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
    });
  });
}

// 无需登录
export async function createH5Auth(data: CreateH5AuthInput) {
  return wrapServerAction(async () => {
    // 通过 schoolId 获取 user
    const user = await prisma.user.findFirst({
      where: {
        schoolId: data.schoolId,
      },
    });

    if (!user) {
      throw new Error('驾校用户不存在');
    }

    const result = await prisma.h5Auth.create({
      data: {
        ...data,
        userId: user.id,
      },
    });

    return result as H5Auth;
  });
}

// 无需登录
export async function getH5AuthById(id: string) {
  return wrapServerAction(async () => {
    const result = await prisma.h5Auth.findUnique({
      where: { id },
    });

    if (!result) {
      throw new Error('数据不存在');
    }

    return result;
  });
}

// 无需登录
export async function updateH5Auth(data: UpdateH5AuthInput) {
  return wrapServerAction(async () => {
    const result = await prisma.h5Auth.update({
      where: {
        id: data.id,
      },
      data,
    });

    if (!result) {
      throw new Error('数据不存在');
    }

    return result;
  });
}

// 无需登录
export async function deleteH5Auth(id: string) {
  return wrapServerAction(async () => {
    // 直接删除
    const result = await prisma.h5Auth.delete({
      where: {
        id,
      },
    });

    if (!result) {
      throw new Error('数据不存在');
    }
  });
}
