// 小鹅(iKnee) - 首页逻辑

const app = getApp();
const levels = require('../../constants/levels');

Page({
  data: {
    // 用户信息
    userName: '爷爷',
    greeting: '您好',
    energyStars: 0,

    // 膝关节评分
    kneeScore: 85,
    scoreAngle: 0,
    scoreClass: 'good',
    scoreStatus: '良好',

    // 小企鹅
    penguinEmoji: '😊',
    penguinEmotion: 'happy',

    // 今日任务
    completedLevels: 3,

    // 建筑解锁状态
    buildingsUnlocked: {
      icehouse: true,
      fireplace: false,
      fispond: false
    },

    // 健康日历
    calendarDays: [],
    currentMonth: '2026年5月'
  },

  onLoad() {
    this.initHome();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.refreshData();
  },

  onPullDownRefresh() {
    this.refreshData();
    wx.stopPullDownRefresh();
  },

  // 初始化首页
  initHome() {
    this.generateCalendar();
    this.calculateScoreAngle();
    this.generateGreeting();
  },

  // 刷新数据
  refreshData() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    const levelProgress = app.globalData.levelProgress || wx.getStorageSync('levelProgress') || {};

    // 计算已完成关卡数
    let completedCount = 0;
    Object.values(levelProgress).forEach(progress => {
      if (progress.bestScore >= 60) completedCount++;
    });

    // 更新建筑解锁状态
    const buildingsUnlocked = {
      icehouse: completedCount >= 2,
      fireplace: completedCount >= 4,
      fispond: completedCount >= 6
    };

    // 计算能量星总数
    const energyStars = this.calculateTotalEnergy(levelProgress);

    this.setData({
      userName: userInfo.name || '爷爷',
      energyStars,
      completedLevels: completedCount,
      buildingsUnlocked
    });
  },

  // 生成日历
  generateCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];

    // 填充空白
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: '', stamped: false });
    }

    // 填充日期
    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfMonth = i;
      // 模拟打卡数据
      let stamped = false;
      let type = 'normal';

      if (i < now.getDate()) {
        stamped = Math.random() > 0.3;
        type = stamped ? (Math.random() > 0.5 ? 'perfect' : 'good') : 'normal';
      } else if (i === now.getDate()) {
        stamped = true;
        type = 'perfect';
      }

      days.push({
        date: dayOfMonth,
        stamped,
        type
      });
    }

    this.setData({
      calendarDays: days,
      currentMonth: `${year}年${month + 1}月`
    });
  },

  // 计算评分角度
  calculateScoreAngle() {
    const score = this.data.kneeScore;
    // 评分转角度 (0-180度)
    const angle = Math.round(score * 1.8);

    let scoreClass = 'normal';
    let scoreStatus = '一般';

    if (score >= 90) {
      scoreClass = 'excellent';
      scoreStatus = '优秀';
    } else if (score >= 75) {
      scoreClass = 'good';
      scoreStatus = '良好';
    } else if (score >= 60) {
      scoreClass = 'normal';
      scoreStatus = '一般';
    }

    this.setData({
      scoreAngle: angle,
      scoreClass,
      scoreStatus
    });
  },

  // 生成问候语
  generateGreeting() {
    const hour = new Date().getHours();
    let greeting = '您好';

    if (hour < 12) greeting = '早上好';
    else if (hour < 18) greeting = '下午好';
    else greeting = '晚上好';

    this.setData({ greeting });
  },

  // 计算能量星总数
  calculateTotalEnergy(levelProgress) {
    let total = 0;
    Object.values(levelProgress).forEach(progress => {
      if (progress.starCount) {
        total += progress.starCount * 10;
      }
    });
    return total;
  },

  // 小企鹅点击
  onPenguinTap() {
    const emotions = ['😊', '🤔', '😮', '🥰', '😴'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    this.setData({
      penguinEmoji: randomEmotion
    });

    setTimeout(() => {
      this.setData({ penguinEmoji: '😊' });
    }, 2000);

    // 播放点击音效
    const voice = require('../../services/voice');
    voice.playEffect('click');
  },

  // 点击今日任务
  onTaskTap() {
    wx.switchTab({
      url: '/pages/training/training'
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

  // 跳转家人绑定
  onBind() {
    wx.navigateTo({
      url: '/pages/bind/bind'
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '小鹅陪你练一练，关节轻松又灵活',
      path: '/pages/index/index',
      imageUrl: '/assets/images/share-cover.png'
    };
  }
});
