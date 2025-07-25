'use server';

import { Prisma, School } from '@/generated/prisma';
import { deleteModel, getModelById, needAuth, pageModel, prisma, updateModel } from './helper';

export type UpdateSchoolInput = Partial<
  Pick<School, 'name' | 'address' | 'phone' | 'authRewardHours' | 'videoRewardHours'>
> & {
  id: string;
};

export async function pageSchools(params: {
  pageSize: number;
  current: number;
  id?: string;
  name?: string;
}) {
  const { sessionUser } = await needAuth();

  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
  });

  const schoolIds = user?.schoolId?.split(',') || [];

  // 没有则新建
  for (const id of schoolIds) {
    await prisma.school.upsert({
      where: {
        id,
      },
      update: {
        userId: sessionUser.id,
      },
      create: {
        id,
        userId: sessionUser.id,
      },
    });
  }

  const whereSchoolIds = params.id ? schoolIds.filter((id) => id === params.id) : schoolIds;

  const result = await pageModel<Prisma.SchoolDelegate, School>(
    {
      model: prisma.school,
      params,
      where: {
        id: { in: whereSchoolIds },
        name: { contains: params.name },
      },
    },
    {
      withUser: true,
    },
  );

  return result;
}

export async function getSchoolById(id: string) {
  return getModelById<Prisma.SchoolDelegate, School>(
    {
      model: prisma.school,
      id,
      include: {
        user: true,
      },
    },
    {
      withUser: true,
    },
  );
}

export async function updateSchool(data: UpdateSchoolInput) {
  return updateModel<Prisma.SchoolDelegate, School, UpdateSchoolInput>(
    {
      model: prisma.school,
      data,
    },
    {
      withUser: true,
    },
  );
}

export async function deleteSchool(id: string) {
  return deleteModel<Prisma.SchoolDelegate>(
    {
      model: prisma.school,
      id,
    },
    {
      withUser: true,
    },
  );
}
