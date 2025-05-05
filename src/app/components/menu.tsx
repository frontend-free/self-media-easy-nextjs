'use client';

import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

function AppMenu({ items }: { items: MenuProps['items'] }) {
  const router = useRouter();
  const pathname = usePathname();

  const selectedKeys =
    items?.filter((item) => item!.key === pathname).map((item) => item!.key as string) ?? [];

  return (
    <Menu
      className="!bg-transparent !border-r-0"
      selectedKeys={selectedKeys}
      items={items}
      onClick={(e) => {
        router.push(e.key);
      }}
    />
  );
}

export { AppMenu };
