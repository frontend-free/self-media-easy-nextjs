'use server';

import * as UserActions from '@/app/actions/user_actions';
import { signIn, signOut } from '@/auth';
import { User } from '@/generated/prisma';
import { needAuth, prisma, wrapServerAction } from './helper';

export async function login({ name, password }: { name: string; password: string }) {
  return wrapServerAction(async () => {
    await signIn('credentials', {
      name,
      password,
      redirect: false,
    });
  });
}

export async function logout() {
  return wrapServerAction(async () => {
    await signOut({
      redirect: false,
    });
  });
}

export async function getUser() {
  return wrapServerAction(async () => {
    const { sessionUser } = await needAuth();

    const user = await UserActions.getUserById(sessionUser.id);

    return user as User;
  });
}

// 根据用户名获取用户
export async function getUserByNamePassword({
  name,
  password,
}: {
  name: string;
  password: string;
}) {
  return wrapServerAction(async () => {
    return prisma.user.findUnique({
      where: { name, password },
    });
  });
}
