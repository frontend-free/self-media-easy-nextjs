const enums = {
  Platform: {
    TIKTOK: {
      text: '抖音',
      data: {
        icon: '/platform/tiktok.png',
      },
    },
  },
  AccountStatus: {
    UNAUTHED: {
      text: '未授权',
    },
    AUTHED: {
      text: '已授权',
    },
    INVALID: {
      text: '已失效',
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
  PublishStatus: {
    WAITING: {
      text: '等待发布',
    },
    PUBLISHED: {
      text: '已发布',
    },
    STOPPED: {
      text: '停止发布',
    },
  },
  TaskStatus: {
    SUCCESS: {
      text: '发布成功',
    },
    FAILED: {
      text: '发布失败',
    },
  },
};

module.exports = { enums };
