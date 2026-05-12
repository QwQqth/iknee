// 小鹅(iKnee) - 测评页逻辑

const app = getApp();

Page({
  data: {
    hasHistory: true,
    lastScore: {
      date: '2026-05-10',
      score: 85,
      level: '良好',
      advice: '继续保持，建议加强力量训练'
    }
  },

  onLoad() {
    this.loadHistory();
  },

  onShow() {
    this.loadHistory();
  },

  // 加载历史记录
  loadHistory() {
    // 模拟历史数据
    this.setData({
      hasHistory: true,
      lastScore: {
        date: '2026-05-10',
        score: 85,
        level: '良好',
        advice: '继续保持，建议加强力量训练'
      }
    });
  },

  // 开始测评
  onStartAssessment() {
    wx.showModal({
      title: '开始测评',
      content: '即将开始膝关节健康评估，请确保环境安全，准备好了吗？',
      confirmText: '开始',
      cancelText: '稍后',
      success: res => {
        if (res.confirm) {
          // TODO: 跳转到测评流程
          wx.showToast({ title: '测评功能开发中', icon: 'none' });
        }
      }
    });
  }
});
