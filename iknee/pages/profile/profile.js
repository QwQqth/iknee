// 小鹅(iKnee) - 我的页面逻辑

const app = getApp();

Page({
  data: {
    userInfo: {
      name: '',
      gender: '',
      age: 0,
      avatar: ''
    },
    stats: {
      totalDays: 0,
      totalStars: 0,
      avgScore: 0
    }
  },

  onLoad() {
    this.loadUserData();
  },

  onShow() {
    this.loadUserData();
  },

  // 加载用户数据
  loadUserData() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    const levelProgress = app.globalData.levelProgress || wx.getStorageSync('levelProgress') || {};

    // 计算统计
    let totalStars = 0;
    let totalScore = 0;
    let countWithScore = 0;

    Object.values(levelProgress).forEach(progress => {
      if (progress.starCount) totalStars += progress.starCount;
      if (progress.bestScore) {
        totalScore += progress.bestScore;
        countWithScore++;
      }
    });

    // 模拟训练天数
    const totalDays = Object.keys(levelProgress).length || 15;

    this.setData({
      userInfo: {
        ...userInfo,
        age: userInfo.birthYear ? new Date().getFullYear() - userInfo.birthYear : 0
      },
      stats: {
        totalDays,
        totalStars,
        avgScore: countWithScore > 0 ? Math.round(totalScore / countWithScore) : 85
      }
    });
  },

  // 跳转测评
  onAssessment() {
    wx.navigateTo({
      url: '/pages/assessment/assessment'
    });
  },

  // 跳转记录
  onRecords() {
    wx.navigateTo({
      url: '/pages/records/records'
    });
  },

  // 跳转绑定
  onBind() {
    wx.navigateTo({
      url: '/pages/bind/bind'
    });
  },

  // 跳转设置
  onSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 健康档案
  onHealthRecord() {
    wx.showToast({ title: '健康档案开发中', icon: 'none' });
  },

  // 子女绑定
  onBindChild() {
    wx.navigateTo({
      url: '/pages/bind/bind'
    });
  },

  // 使用帮助
  onHelp() {
    wx.showToast({ title: '帮助中心开发中', icon: 'none' });
  },

  // 关于我们
  onAbout() {
    wx.showModal({
      title: '关于我们',
      content: '小鹅抗腿队 - 腾讯公益项目\n旨在帮助老年人科学预防膝关节疾病\n\n版本: v1.0.0\n\n© 2026 腾讯公益',
      showCancel: false
    });
  }
});
