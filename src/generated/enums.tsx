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
    data: { icon: '/platform/tiktok.png' },
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

// --- AccountStatus

export enum EnumAccountStatus {
  UNAUTHED = 'unauthed',
  AUTHED = 'authed',
  INVALID = 'invalid',
}

export const valueEnumAccountStatus = {
  [EnumAccountStatus.UNAUTHED]: {
    text: '未授权',
    value: 'unauthed',
  },
  [EnumAccountStatus.AUTHED]: {
    text: '已授权',
    value: 'authed',
  },
  [EnumAccountStatus.INVALID]: {
    text: '已失效',
    value: 'invalid',
  },
};

export const listAccountStatus = Object.keys(valueEnumAccountStatus).map((key) => {
  const item = valueEnumAccountStatus[key];

  return {
    value: item.value !== undefined ? item.value : key,
    label: item.text,
    originData: item.data,
  };
});

export function TagAccountStatus(props: { value?: EnumAccountStatus | string } & TagProps) {
  const item = props.value && valueEnumAccountStatus[props.value];

  if (item) {
    return (
      <Tag color={item.color} {...props}>
        {item.text}
      </Tag>
    );
  }

  return null;
}
