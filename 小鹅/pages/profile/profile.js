// pages/profile/profile.js
Page({
  data: {
    userName: '小鹅用户',
    genderText: '',
    age: '',
    kneeLevel: '未知',
    showBindModal: false
  },

  onShow() {
    // 更新自定义 tabBar 选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }

    const profile = wx.getStorageSync('userProfile')
    if (profile) {
      this.setData({
        userName: profile.name || '小鹅用户',
        genderText: profile.gender === 'male' ? '男' : '女',
        age: profile.age || '',
        kneeLevel: profile.kneeLevel || '未知'
      })
    }
  },

  onMenuTap(e) {
    const key = e.currentTarget.dataset.key
    if (key === 'settings') {
      wx.navigateTo({ url: '/pages/settings/settings' })
      return
    }
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  onBindChild() {
    this.setData({ showBindModal: true })
  },

  onCloseBindModal() {
    this.setData({ showBindModal: false })
  }
})
