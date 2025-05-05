import { EnumPlatform, valueEnumPlatform } from '@/generated/enums';
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
  size = 20,
}: {
  name?: string;
  value?: EnumPlatform;
  size?: number;
}) {
  return (
    <div className="flex flex-row items-center gap-1">
      <Platform value={value} size={size} />
      {name}
    </div>
  );
}

export { Platform, PlatformWithName };
