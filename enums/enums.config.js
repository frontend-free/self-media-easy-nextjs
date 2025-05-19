const enums = {
  Platform: {
    TIKTOK: {
      text: '抖音',
      data: {
        icon: '/platform/tiktok.png',
      },
    },
    WEIXIN_VIDEO: {
      text: '视频号',
      data: {
        icon: '/platform/weixin_video.png',
        desc: '微信风控原因，24小时内必掉线',
      },
    },
  },
  AccountStatus: {
    UNAUTHED: {
      text: '未授权',
      color: 'default',
    },
    AUTHED: {
      text: '已授权',
      color: 'green',
    },
    INVALID: {
      text: '已失效',
      color: 'red',
    },
  },
  PublishResourceType: {
    VIDEO: {
      text: '视频',
    },
  },
  PublishType: {
    OFFICIAL: {
      text: '正式',
    },
    DRAFT: {
      text: '草稿',
    },
  },
  TaskStatus: {
    PENDING: {
      text: '等待发布',
      color: 'default',
    },
    PUBLISHING: {
      text: '发布中',
      color: 'blue',
    },
    SUCCESS: {
      text: '发布成功',
      color: 'green',
    },
    FAILED: {
      text: '发布失败',
      color: 'red',
    },
    CANCELLED: {
      text: '已取消',
      color: 'gray',
    },
  },
};

module.exports = { enums };
