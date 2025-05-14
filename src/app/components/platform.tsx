import { EnumPlatform, TagAccountStatus, valueEnumPlatform } from '@/generated/enums';
import { AccountStatus } from '@/generated/prisma';
import cn from 'classnames';
import Image from 'next/image';

function Platform({ value, size = 50 }: { value?: EnumPlatform; size?: number }) {
  if (!value) {
    return null;
  }

  const platform = valueEnumPlatform[value];

  return <Image src={platform.data.icon} alt={platform.text} width={size} height={size} />;
}

function PlatformWithName({
  name,
  value,
  status,
  size = 20,
}: {
  name?: string;
  value?: EnumPlatform;
  status?: AccountStatus;
  size?: number;
}) {
  return (
    <div
      className={cn('flex flex-row items-center gap-1', {
        'opacity-50': status === AccountStatus.INVALID,
      })}
    >
      <Platform value={value} size={size} />
      <div>
        <div>{name}</div>
        <TagAccountStatus value={status} />
      </div>
    </div>
  );
}

export { Platform, PlatformWithName };
