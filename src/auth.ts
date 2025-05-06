import * as AuthAction from '@/app/actions/auth_action';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    isAdmin: boolean;
  }

  interface Session {
    user: User;
    expires: DefaultSession['expires'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        name: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' },
      },
      authorize: async (credentials) => {
        const user = await AuthAction.getUserByNamePassword({
          name: credentials.name as string,
          password: credentials.password as string,
        });

        if (!user) {
          throw new Error('用户名或密码错误');
        }

        return {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          isAdmin: token.isAdmin as boolean,
        };
      }
      return session;
    },
  },
  trustHost: true,
});
