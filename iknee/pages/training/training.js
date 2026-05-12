// 小鹅(iKnee) - 训练页逻辑

const app = getApp();
const levels = require('../../constants/levels');

Page({
  data: {
    levels: [],
    completedCount: 0,
    progressPercent: 0,
    todayDate: '',
    penguinTip: '加油！今天的训练就差一点点啦~'
  },

  onLoad() {
    this.initTraining();
  },

  onShow() {
    this.loadLevelProgress();
  },

  onPullDownRefresh() {
    this.loadLevelProgress();
    wx.stopPullDownRefresh();
  },

  // 初始化训练页
  initTraining() {
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 星期${['日', '一', '二', '三', '四', '五', '六'][now.getDay()]}`;
    this.setData({ todayDate: dateStr });

    this.loadLevelProgress();
    this.generatePenguinTip();
  },

  // 加载关卡进度
  loadLevelProgress() {
    const levelProgress = app.globalData.levelProgress || wx.getStorageSync('levelProgress') || {};
    const allLevels = levels.levels;

    let completedCount = 0;
    const levelsWithProgress = allLevels.map((level, index) => {
      const progress = levelProgress[level.id] || {};

      // 判断是否解锁
      let unlocked = index === 0;
      if (!unlocked) {
        const prevLevel = allLevels[index - 1];
        const prevProgress = levelProgress[prevLevel.id];
        if (prevProgress && prevProgress.bestScore >= 60) {
          unlocked = true;
        }
      }

      // 判断是否完成
      const completed = progress.bestScore >= 60;

      if (completed) completedCount++;

      return {
        ...level,
        unlocked,
        completed,
        starCount: progress.starCount || 0,
        bestScore: progress.bestScore || 0,
        attemptCount: progress.attemptCount || 0
      };
    });

    this.setData({
      levels: levelsWithProgress,
      completedCount,
      progressPercent: Math.round((completedCount / 6) * 100)
    });
  },

  // 生成小企鹅提示
  generatePenguinTip() {
    const tips = [
      '加油！今天的训练就差一点点啦~',
      '坚持就是胜利，小鹅陪您一起加油！',
      '完成全部训练可以获得额外奖励哦~',
      '每个动作都要认真做，效果会更好！',
      '今天感觉怎么样？状态好的话多练几关吧~'
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    this.setData({ penguinTip: randomTip });
  },

  // 点击关卡
  onLevelTap(e) {
    const level = e.currentTarget.dataset.level;

    if (!level.unlocked) {
      wx.showToast({
        title: '请先完成前一关',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 记录埋点
    this.trackEvent('level_start', { level_id: level.id });

    // 跳转到练习页
    wx.navigateTo({
      url: `/pages/training/practice/practice?levelId=${level.id}&from=list`
    });
  },

  // 埋点
  trackEvent(eventName, data = {}) {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};

    // 实际项目中发送到埋点服务
    console.log('埋点:', eventName, {
      ...data,
      userId: userInfo.name,
      time: new Date().toISOString()
    });
  }
});
