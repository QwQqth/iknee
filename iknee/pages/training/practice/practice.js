// 小鹅(iKnee) - AI练习页逻辑
// 核心功能：姿态检测、实时反馈

const app = getApp();
const levels = require('../../constants/levels');
const voice = require('../../services/voice');

Page({
  data: {
    // 关卡信息
    levelId: '',
    levelName: '',
    level: null,

    // 当前阶段: video | practice | result
    phase: 'video',

    // 视频相关
    videoUrl: '',
    penguinMessage: '爷爷，刚才的动作看清楚了吗？您学会了吗？',

    // 练习相关
    isRecording: false,
    currentCount: 0,
    targetCount: 0,
    gameProgress: 0,
    showStartHint: true,

    // 小企鹅状态
    penguinState: 'default',
    penguinEmoji: '😊',

    // 反馈
    feedbackVisible: false,
    feedbackText: '',
    feedbackTimer: null,

    // 结果
    resultScore: 0,
    resultStars: 0,
    resultMessage: '',

    // AI检测状态
    cameraContext: null,
    poseDetectTimer: null,
    consecutiveFailFrames: 0,
    dynamicThreshold: 0,

    // 模拟数据
    correctCount: 0,
    totalAttempts: 0
  },

  onLoad(options) {
    const { levelId, from } = options;

    if (!levelId) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      wx.navigateBack();
      return;
    }

    this.setData({ levelId });
    this.loadLevelData(levelId);

    // 记录埋点
    this.trackEvent('level_start', { level_id: levelId, from: from || 'direct' });
  },

  onReady() {
    // 页面准备好后自动开始
  },

  onUnload() {
    this.cleanup();
  },

  // 加载关卡数据
  loadLevelData(levelId) {
    const level = levels.levels.find(l => l.id === levelId);
    if (!level) {
      wx.showToast({ title: '关卡不存在', icon: 'none' });
      wx.navigateBack();
      return;
    }

    // 模拟视频URL（实际项目中使用真实视频）
    const videoUrls = {
      'level_01': 'https://example.com/videos/squat.mp4',
      'level_02': 'https://example.com/videos/leg_raise.mp4',
      'level_03': 'https://example.com/videos/forward_bend.mp4',
      'level_04': 'https://example.com/videos/hip_bridge.mp4',
      'level_05': 'https://example.com/videos/single_leg.mp4',
      'level_06': 'https://example.com/videos/ankle.mp4'
    };

    this.setData({
      level,
      levelName: level.name,
      targetCount: level.count || Math.ceil(level.duration) || 10,
      videoUrl: videoUrls[levelId] || ''
    });
  },

  // ========== 阶段1: 视频学习 ==========

  // 视频播放完成
  onVideoEnd() {
    this.setData({
      penguinMessage: '爷爷，刚才的动作看清楚了吗？您学会了吗？'
    });
  },

  // 重播视频
  onReplayVideo() {
    this.trackEvent('video_replay', { level_id: this.data.levelId });
    wx.showToast({ title: '重新播放中...', icon: 'none' });
    // 实际项目中重新播放视频
  },

  // 开始练习
  onStartPractice() {
    this.setData({ phase: 'practice' });
    this.initCamera();
  },

  // ========== 阶段2: AI练习 ==========

  // 初始化摄像头
  initCamera() {
    // 显示开始提示
    this.setData({ showStartHint: true });

    // 语音提示
    voice.speak('请站在镜头前，保持全身可见', { rate: 0.8 });

    // 隐藏提示
    setTimeout(() => {
      this.setData({ showStartHint: false });
    }, 3000);

    // 初始化摄像头上下文
    this.setData({ cameraContext: wx.createCameraContext() });
  },

  // 切换练习状态
  togglePractice() {
    if (this.data.isRecording) {
      this.stopPractice();
    } else {
      this.startPractice();
    }
  },

  // 开始练习
  startPractice() {
    this.setData({ isRecording: true });
    this.startPoseDetection();
    voice.speak('开始！', { rate: 0.8 });
  },

  // 停止练习
  stopPractice() {
    this.setData({ isRecording: false });
    this.stopPoseDetection();
  },

  // 开始姿态检测
  startPoseDetection() {
    if (this.data.poseDetectTimer) return;

    const timer = setInterval(() => {
      this.detectPose();
    }, 100);

    this.setData({ poseDetectTimer: timer });
  },

  // 停止姿态检测
  stopPoseDetection() {
    if (this.data.poseDetectTimer) {
      clearInterval(this.data.poseDetectTimer);
      this.setData({ poseDetectTimer: null });
    }
  },

  // 检测姿态（模拟）
  detectPose() {
    // 实际项目中调用云函数进行姿态检测
    // 这里模拟检测结果

    const { level, currentCount, targetCount } = this.data;
    const threshold = level.threshold || 10;
    const standardAngle = level.standardAngle || 90;

    // 模拟：70%概率动作标准
    const isCorrect = Math.random() > 0.3;

    if (isCorrect) {
      this.handleCorrectPosture();
    } else {
      this.handleWrongPosture();
    }

    // 检查是否完成
    if (currentCount >= targetCount) {
      this.completePractice();
    }
  },

  // 处理标准姿势
  handleCorrectPosture() {
    const { currentCount, targetCount } = this.data;

    // 更新计数
    this.setData({
      currentCount: currentCount + 1,
      correctCount: this.data.correctCount + 1,
      gameProgress: Math.round((currentCount + 1) / targetCount * 100)
    });

    // 小企鹅反馈
    this.setPenguinFeedback('correct');

    // 播放正确音效
    voice.playEffect('correct');
  },

  // 处理错误姿势
  handleWrongPosture() {
    const { level, consecutiveFailFrames } = this.data;

    // 连续错误计数
    const newFailFrames = consecutiveFailFrames + 1;
    this.setData({ consecutiveFailFrames: newFailFrames });

    // 连续3帧错误才反馈
    if (newFailFrames >= 3) {
      // 语音纠正
      const corrections = level.tips || ['注意动作'];
      const correction = corrections[Math.floor(Math.random() * corrections.length)];

      this.showFeedback(correction);
      voice.speak(correction, { rate: 0.8 });

      // 小企鹅反馈
      this.setPenguinFeedback('wrong');

      // 重置计数
      this.setData({ consecutiveFailFrames: 0 });
    }
  },

  // 显示反馈
  showFeedback(text) {
    this.setData({
      feedbackText: text,
      feedbackVisible: true
    });

    // 2秒后隐藏
    if (this.data.feedbackTimer) {
      clearTimeout(this.data.feedbackTimer);
    }

    const timer = setTimeout(() => {
      this.setData({ feedbackVisible: false });
    }, 2000);

    this.setData({ feedbackTimer: timer });
  },

  // 小企鹅反馈表情
  setPenguinFeedback(type) {
    const feedbacks = {
      correct: { state: 'happy', emoji: '😊' },
      wrong: { state: 'worried', emoji: '😟' },
      perfect: { state: 'excited', emoji: '🤩' },
      complete: { state: 'celebrate', emoji: '🎉' }
    };

    const feedback = feedbacks[type] || feedbacks.correct;
    this.setData({
      penguinState: feedback.state,
      penguinEmoji: feedback.emoji
    });

    // 2秒后恢复默认
    setTimeout(() => {
      this.setData({
        penguinState: 'default',
        penguinEmoji: '😊'
      });
    }, 1500);
  },

  // 完成练习
  completePractice() {
    this.stopPractice();

    // 计算结果
    const { correctCount, totalAttempts } = this.data;
    const score = Math.round((correctCount / Math.max(totalAttempts, 1)) * 100);
    const stars = levels.calculateStars(this.data.levelId, score, 0);

    // 保存进度
    this.saveProgress(score, stars);

    // 切换到结果阶段
    this.setData({
      phase: 'result',
      resultScore: score,
      resultStars: stars,
      resultMessage: this.getResultMessage(score, stars)
    });

    // 播放完成音效
    voice.playEffect('complete');
    voice.speak(this.data.resultMessage, { rate: 0.8 });

    // 埋点
    this.trackEvent('level_complete', {
      level_id: this.data.levelId,
      score,
      stars,
      attempts: this.data.totalAttempts
    });
  },

  // 获取结果消息
  getResultMessage(score, stars) {
    if (stars === 3) {
      return '太厉害了！您帮小企鹅完成了任务！';
    } else if (stars === 2) {
      return '做得很好！再接再厉可以做得更好！';
    } else if (stars === 1) {
      return '完成了！继续练习会越来越好的！';
    } else {
      return '没关系，多练习几次就好了！';
    }
  },

  // 保存进度
  saveProgress(score, stars) {
    const app = getApp();
    const levelProgress = app.globalData.levelProgress || {};

    const currentProgress = levelProgress[this.data.levelId] || {};
    const newProgress = {
      unlocked: true,
      starCount: Math.max(currentProgress.starCount || 0, stars),
      bestScore: Math.max(currentProgress.bestScore || 0, score),
      attemptCount: (currentProgress.attemptCount || 0) + 1,
      lastAttemptAt: new Date().toISOString()
    };

    levelProgress[this.data.levelId] = newProgress;
    app.globalData.levelProgress = levelProgress;
    wx.setStorageSync('levelProgress', levelProgress);

    // 同步到云端
    this.syncToCloud(newProgress);
  },

  // 同步到云端
  syncToCloud(progress) {
    wx.cloud.callFunction({
      name: 'saveLevelProgress',
      data: {
        levelId: this.data.levelId,
        progress
      }
    });
  },

  // ========== 阶段3: 结果 ==========

  // 再练一次
  onRetry() {
    this.setData({
      phase: 'practice',
      currentCount: 0,
      gameProgress: 0,
      correctCount: 0,
      totalAttempts: 0,
      consecutiveFailFrames: 0
    });

    this.initCamera();
  },

  // 返回首页
  onGoHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // ========== 其他 ==========

  // 返回
  onBack() {
    if (this.data.phase === 'practice' && this.data.isRecording) {
      wx.showModal({
        title: '提示',
        content: '训练进行中，确定要退出吗？',
        success: res => {
          if (res.confirm) {
            this.cleanup();
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  },

  // 关闭
  onClose() {
    this.onBack();
  },

  // 摄像头错误
  onCameraError(e) {
    console.error('摄像头错误:', e);
    wx.showToast({
      title: '摄像头不可用',
      icon: 'none'
    });
  },

  // 清理
  cleanup() {
    this.stopPractice();
    if (this.data.feedbackTimer) {
      clearTimeout(this.data.feedbackTimer);
    }
    voice.stopSpeak();
  },

  // 埋点
  trackEvent(eventName, data = {}) {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    console.log('埋点:', eventName, {
      ...data,
      userId: userInfo.name,
      time: new Date().toISOString()
    });
  }
});
