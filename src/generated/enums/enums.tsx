import type { TagProps } from 'antd';
import { Tag } from 'antd';

// --- Platform

export enum EnumPlatform {
  TIKTOK = 'tiktok',
}

export const valueEnumPlatform = {
  [EnumPlatform.TIKTOK]: {
    text: '抖音',
    value: 'tiktok',
  },
};

export const listPlatform = Object.keys(valueEnumPlatform).map((key) => {
  const item = valueEnumPlatform[key];

  return {
    value: item.value !== undefined ? item.value : key,
    label: item.text,
    originData: item.data,
  };
});

export function TagPlatform(props: { value?: EnumPlatform | string } & TagProps) {
  const item = props.value && valueEnumPlatform[props.value];

  if (item) {
    return (
      <Tag color={item.color} {...props}>
        {item.text}
      </Tag>
    );
  }

  return null;
}
