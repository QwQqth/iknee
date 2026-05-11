// pages/settings/settings.js
Page({
  data: {
    userName: '小鹅用户',
    genderText: '',
    age: '',
    // 通用开关
    notifyEnabled: true,
    soundEnabled: true,
    // 功能开关
    autoRecord: true
  },

  onLoad() {
    const profile = wx.getStorageSync('userProfile')
    if (profile) {
      this.setData({
        userName: profile.name || '小鹅用户',
        genderText: profile.gender === 'male' ? '男' : '女',
        age: profile.age || ''
      })
    }
  },

  // 开关变更
  onSwitchChange(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [key]: e.detail.value })
  },

  // 关于小鹅
  onAbout() {
    wx.showModal({
      title: '关于小鹅',
      content: '科学健老 · 小鹅\n版本 1.0.0\n\n一款专注于老年群体膝关节运动健康的公益小程序，由腾讯公益支持开发。',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#e87840'
    })
  },

  // 帮助中心
  onHelp() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  // 切换账号
  onSwitchAccount() {
    wx.reLaunch({ url: '/pages/intro/intro' })
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      confirmColor: '#e87840',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync('userProfile')
          wx.reLaunch({ url: '/pages/intro/intro' })
        }
      }
    })
  },

  // 菜单项占位
  onMenuTap(e) {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  }
})
