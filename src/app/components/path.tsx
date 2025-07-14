'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

function AuthPathComponent({
  element,
  children,
}: {
  element: ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 如果路径以 /auth/ 开头，返回 null
  if (pathname?.startsWith('/auth/')) {
    return element || null;
  }

  return children;
}

function AdminPathComponent({ element, children }: { element: ReactNode; children: ReactNode }) {
  const pathname = usePathname();

  // 如果路径以 /admin/ 开头，返回 null
  if (pathname?.startsWith('/admin/')) {
    return element || null;
  }

  return children;
}

export { AdminPathComponent, AuthPathComponent };
