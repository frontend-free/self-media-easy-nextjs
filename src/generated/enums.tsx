import type { TagProps } from 'antd';
import { Tag } from 'antd';

// --- Platform

export enum EnumPlatform {
  TIKTOK = 'TIKTOK',
  WEIXIN_VIDEO = 'WEIXIN_VIDEO',
}

export const valueEnumPlatform = {
  [EnumPlatform.TIKTOK]: {
    text: '抖音',
    value: 'TIKTOK',
    data: { icon: '/platform/tiktok.png' },
  },
  [EnumPlatform.WEIXIN_VIDEO]: {
    text: '视频号',
    value: 'WEIXIN_VIDEO',
    data: { icon: '/platform/weixin_video.png', desc: '微信风控原因，24小时内必掉线' },
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
  UNAUTHED = 'UNAUTHED',
  AUTHED = 'AUTHED',
  INVALID = 'INVALID',
}

export const valueEnumAccountStatus = {
  [EnumAccountStatus.UNAUTHED]: {
    text: '未授权',
    value: 'UNAUTHED',
    color: 'default',
  },
  [EnumAccountStatus.AUTHED]: {
    text: '已授权',
    value: 'AUTHED',
    color: 'green',
  },
  [EnumAccountStatus.INVALID]: {
    text: '已失效',
    value: 'INVALID',
    color: 'red',
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

// --- PublishResourceType

export enum EnumPublishResourceType {
  VIDEO = 'VIDEO',
}

export const valueEnumPublishResourceType = {
  [EnumPublishResourceType.VIDEO]: {
    text: '视频',
    value: 'VIDEO',
  },
};

export const listPublishResourceType = Object.keys(valueEnumPublishResourceType).map((key) => {
  const item = valueEnumPublishResourceType[key];

  return {
    value: item.value !== undefined ? item.value : key,
    label: item.text,
    originData: item.data,
  };
});

export function TagPublishResourceType(
  props: { value?: EnumPublishResourceType | string } & TagProps,
) {
  const item = props.value && valueEnumPublishResourceType[props.value];

  if (item) {
    return (
      <Tag color={item.color} {...props}>
        {item.text}
      </Tag>
    );
  }

  return null;
}

// --- PublishType

export enum EnumPublishType {
  OFFICIAL = 'OFFICIAL',
  DRAFT = 'DRAFT',
}

export const valueEnumPublishType = {
  [EnumPublishType.OFFICIAL]: {
    text: '正式',
    value: 'OFFICIAL',
  },
  [EnumPublishType.DRAFT]: {
    text: '草稿',
    value: 'DRAFT',
  },
};

export const listPublishType = Object.keys(valueEnumPublishType).map((key) => {
  const item = valueEnumPublishType[key];

  return {
    value: item.value !== undefined ? item.value : key,
    label: item.text,
    originData: item.data,
  };
});

export function TagPublishType(props: { value?: EnumPublishType | string } & TagProps) {
  const item = props.value && valueEnumPublishType[props.value];

  if (item) {
    return (
      <Tag color={item.color} {...props}>
        {item.text}
      </Tag>
    );
  }

  return null;
}

// --- TaskStatus

export enum EnumTaskStatus {
  PENDING = 'PENDING',
  PUBLISHING = 'PUBLISHING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export const valueEnumTaskStatus = {
  [EnumTaskStatus.PENDING]: {
    text: '等待发布',
    value: 'PENDING',
    color: '#2db7f5',
  },
  [EnumTaskStatus.PUBLISHING]: {
    text: '发布中',
    value: 'PUBLISHING',
    color: 'blue',
  },
  [EnumTaskStatus.SUCCESS]: {
    text: '发布成功',
    value: 'SUCCESS',
    color: 'green',
  },
  [EnumTaskStatus.FAILED]: {
    text: '发布失败',
    value: 'FAILED',
    color: 'red',
  },
  [EnumTaskStatus.CANCELLED]: {
    text: '已取消',
    value: 'CANCELLED',
    color: 'gray',
  },
};

export const listTaskStatus = Object.keys(valueEnumTaskStatus).map((key) => {
  const item = valueEnumTaskStatus[key];

  return {
    value: item.value !== undefined ? item.value : key,
    label: item.text,
    originData: item.data,
  };
});

export function TagTaskStatus(props: { value?: EnumTaskStatus | string } & TagProps) {
  const item = props.value && valueEnumTaskStatus[props.value];

  if (item) {
    return (
      <Tag color={item.color} {...props}>
        {item.text}
      </Tag>
    );
  }

  return null;
}

// --- RecorderStatus

export enum EnumRecorderStatus {
  INIT = 'INIT',
  RECORDING = 'RECORDING',
  END = 'END',
}

export const valueEnumRecorderStatus = {
  [EnumRecorderStatus.INIT]: {
    text: '初始化',
    value: 'INIT',
    color: 'default',
  },
  [EnumRecorderStatus.RECORDING]: {
    text: '录制中',
    value: 'RECORDING',
    color: 'red',
  },
  [EnumRecorderStatus.END]: {
    text: '已结束',
    value: 'END',
  },
};

export const listRecorderStatus = Object.keys(valueEnumRecorderStatus).map((key) => {
  const item = valueEnumRecorderStatus[key];

  return {
    value: item.value !== undefined ? item.value : key,
    label: item.text,
    originData: item.data,
  };
});

export function TagRecorderStatus(props: { value?: EnumRecorderStatus | string } & TagProps) {
  const item = props.value && valueEnumRecorderStatus[props.value];

  if (item) {
    return (
      <Tag color={item.color} {...props}>
        {item.text}
      </Tag>
    );
  }

  return null;
}
