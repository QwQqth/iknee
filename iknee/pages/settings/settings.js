// 小鹅(iKnee) - 设置页逻辑

const app = getApp();

Page({
  data: {
    volume: 80,
    fontIndex: 1,
    fontSizes: ['小', '标准', '大']
  },

  onLoad() {
    this.loadSettings();
  },

  // 加载设置
  loadSettings() {
    const settings = app.getSettings();
    this.setData({
      volume: Math.round((settings.volume || 1) * 100),
      fontIndex: settings.fontSize === 'small' ? 0 : settings.fontSize === 'large' ? 2 : 1
    });
  },

  // 语音开关
  onVoiceChange(e) {
    app.updateSettings({ voiceEnabled: e.detail.value });
    wx.showToast({ title: e.detail.value ? '已开启' : '已关闭', icon: 'none' });
  },

  // 音量调节
  onVolumeChange(e) {
    const volume = e.detail.value / 100;
    app.updateSettings({ volume });
  },

  // 字体大小
  onFontSizeChange(e) {
    const fontSizes = ['small', 'normal', 'large'];
    const fontSize = fontSizes[e.detail.value];
    app.updateSettings({ fontSize });
    this.setData({ fontIndex: e.detail.value });
  },

  // 隐私政策
  onPrivacy() {
    wx.showToast({ title: '隐私政策开发中', icon: 'none' });
  },

  // 用户协议
  onTerms() {
    wx.showToast({ title: '用户协议开发中', icon: 'none' });
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？',
      success: res => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  },

  // 检查更新
  onCheckUpdate() {
    wx.showToast({ title: '已是最新版本', icon: 'success' });
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: res => {
        if (res.confirm) {
          app.handleLogout();
        }
      }
    });
  }
});
