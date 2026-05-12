// 小鹅(iKnee) - 全局配置
// 腾讯公益项目「企鹅抗腿队」

module.exports = {
  // App信息
  app: {
    name: '小鹅抗腿队',
    slogan: '小鹅陪你练一练，关节轻松又灵活',
    version: '1.0.0',
    updateTime: '2026-05-12'
  },

  // API配置
  api: {
    baseUrl: 'https://api.iknee.com/miniapp/v1',
    timeout: 30000,
    cloudPrefix: 'iknee'
  },

  // 云环境配置
  cloud: {
    env: 'iknee-prod-xxxx',
    envTest: 'iknee-test-xxxx'
  },

  // 音频配置
  audio: {
    defaultVolume: 1.0,
    defaultRate: 0.8,
    bgmVolume: 0.3,
    sfxVolume: 0.8
  },

  // AI检测配置
  ai: {
    poseDetectInterval: 100,
    failFrameThreshold: 3,
    feedbackDelayThreshold: 300,
    dynamicThresholdAdjust: 5
  },

  // 游戏化配置
  gamification: {
    baseEnergy: 30,
    completeBonus: 20,
    starToEnergy: 10,
    dailyFirstBonus: 50,
    streakBonus: [0, 10, 20, 30, 50, 80]
  },

  // 适老化配置
  a11y: {
    fontSizeLevels: {
      small: { body: 34, title: 44 },
      normal: { body: 40, title: 48 },
      large: { body: 48, title: 56 }
    },
    buttonHotspot: 30,
    voiceRate: 0.8,
    voiceVolume: 1.0
  },

  // 存储Key
  storage: {
    userInfo: 'userInfo',
    token: 'token',
    levelProgress: 'levelProgress',
    settings: 'settings',
    dailyRecord: 'dailyRecord',
    cacheVideoList: 'cacheVideoList'
  },

  // 埋点事件
  events: {
    moduleEnter: 'module_enter',
    levelStart: 'level_start',
    videoReplay: 'video_replay',
    aiCorrection: 'ai_correction',
    levelComplete: 'level_complete',
    allLevelsComplete: 'all_levels_complete'
  },

  // 获取云环境ID
  getCloudEnv() {
    return this.env === 'prod' ? this.cloud.env : this.cloud.envTest;
  }
};
