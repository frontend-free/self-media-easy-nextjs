'use client';

import { usePathname } from 'next/navigation';

function AuthComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 如果路径以 /auth/ 开头，返回 null
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  return children;
}

export { AuthComponent };
