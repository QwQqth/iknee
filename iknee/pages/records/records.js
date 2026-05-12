// 小鹅(iKnee) - 训练记录页逻辑

Page({
  data: {
    currentTab: 'week',
    stats: {
      totalDays: 15,
      totalTimes: 42,
      totalMins: 380,
      streakDays: 5
    },
    records: []
  },

  onLoad() {
    this.loadRecords();
  },

  // 加载记录
  loadRecords() {
    // 模拟数据
    this.setData({
      records: [
        {
          id: 'r1',
          levelNum: 1,
          actionName: '靠墙静蹲',
          stars: 3,
          score: 92,
          date: '今天 10:30'
        },
        {
          id: 'r2',
          levelNum: 2,
          actionName: '坐姿抬腿',
          stars: 2,
          score: 85,
          date: '今天 10:15'
        },
        {
          id: 'r3',
          levelNum: 3,
          actionName: '坐姿体前屈',
          stars: 3,
          score: 88,
          date: '昨天 16:20'
        },
        {
          id: 'r4',
          levelNum: 1,
          actionName: '靠墙静蹲',
          stars: 2,
          score: 78,
          date: '昨天 10:00'
        }
      ]
    });
  },

  // 切换标签
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.loadRecords();
  }
});
