'use server';

import * as UserAction from '@/app/actions/user_action';
import { auth, signIn, signOut } from '@/auth';
import { PrismaClient, User } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function login({ name, password }: { name: string; password: string }) {
  await signIn('credentials', {
    name,
    password,
    redirectTo: '/',
  });
}

export async function logout() {
  await signOut({
    redirectTo: '/auth/login',
  });
}

export async function getUser() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const user = await UserAction.getUserById(session.user.id);

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
