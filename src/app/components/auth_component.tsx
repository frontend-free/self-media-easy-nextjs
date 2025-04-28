'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

function AuthComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 如果路径以 /auth/ 开头，返回 null
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  return children;
}

function AdminComponent({ admin, children }: { admin: ReactNode; children: ReactNode }) {
  const pathname = usePathname();

  // 如果路径以 /admin/ 开头，返回 null
  if (pathname?.startsWith('/admin/')) {
    return admin || null;
  }

  return children;
}

export { AdminComponent, AuthComponent };
