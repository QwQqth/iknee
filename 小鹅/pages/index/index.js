// pages/index/index.js
Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  onQuizTap() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  onDailyTap() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  onVideoTap() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  }
})
