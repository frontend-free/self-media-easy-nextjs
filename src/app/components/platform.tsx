import { EnumPlatform, TagAccountStatus, valueEnumPlatform } from '@/generated/enums';
import { AccountStatus } from '@/generated/prisma';
import cn from 'classnames';
import Image from 'next/image';

function Platform({
  name,
  value,
  status,
  deletedAt,
  size = 20,
}: {
  value: EnumPlatform;
  name?: string;
  status?: AccountStatus;
  size?: number;
  deletedAt?: Date;
}) {
  const platform = valueEnumPlatform[value];

  return (
    <div
      className={cn('flex flex-row items-center gap-1', {
        'opacity-50': status === AccountStatus.INVALID || deletedAt,
      })}
    >
      <Image src={platform.data.icon} alt={platform.text} width={size} height={size} />

      <div>{name}</div>
      {deletedAt && <div>账号已删除</div>}
      {!deletedAt && status && <TagAccountStatus value={status} />}
    </div>
  );
}

export { Platform };
