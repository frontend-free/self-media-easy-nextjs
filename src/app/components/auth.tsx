'use client';

import { useSession } from 'next-auth/react';

function AuthComponent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  console.log(session);

  if (!session || !session.user) {
    return null;
  }

  return children;
}

export { AuthComponent };
