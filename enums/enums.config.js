const enums = {
  Platform: {
    TIKTOK: {
      text: '抖音',
      value: 'tiktok',
      data: {
        icon: '/platform/tiktok.png',
      },
    },
  },
  AccountStatus: {
    UNAUTHED: {
      text: '未授权',
      value: 'unauthed',
    },
    AUTHED: {
      text: '已授权',
      value: 'authed',
    },
    INVALID: {
      text: '已失效',
      value: 'invalid',
    },
  },
};

module.exports = { enums };
