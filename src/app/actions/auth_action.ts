'use server';

import * as UserAction from '@/app/actions/user_action';
import { signIn, signOut } from '@/auth';
import { User } from '@/generated/prisma';
import { needAuth, prisma } from './helper';

export async function login({ name, password }: { name: string; password: string }) {
  await signIn('credentials', {
    name,
    password,
    redirectTo: '/',
  });
}

export async function logout() {
  await signOut({
    redirect: false,
  });
}

export async function getUser() {
  const { sessionUser } = await needAuth();

  const user = await UserAction.getUserById(sessionUser.id);

  return user as User;
}

// 根据用户名获取用户
export async function getUserByNamePassword({
  name,
  password,
}: {
  name: string;
  password: string;
}) {
  return prisma.user.findUnique({
    where: { name, password },
  });
}
