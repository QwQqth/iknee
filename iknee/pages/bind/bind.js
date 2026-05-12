// 小鹅(iKnee) - 家人绑定页逻辑

Page({
  data: {
    boundFamilies: [],
    qrcodeUrl: '/assets/images/qrcode-placeholder.png'
  },

  onLoad() {
    this.loadBoundFamilies();
  },

  // 加载已绑定家人
  loadBoundFamilies() {
    // 模拟数据
    this.setData({
      boundFamilies: [
        {
          id: 'f1',
          name: '王小明',
          relation: '儿子',
          avatar: ''
        }
      ]
    });
  },

  // 扫码绑定
  onScanBind() {
    wx.scanCode({
      success: res => {
        wx.showToast({ title: '扫码成功', icon: 'success' });
        // TODO: 处理绑定逻辑
      },
      fail: () => {
        wx.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
  },

  // 输入码绑定
  onCodeBind() {
    wx.showModal({
      title: '输入绑定码',
      editable: true,
      placeholderText: '请输入绑定码',
      success: res => {
        if (res.confirm && res.content) {
          wx.showToast({ title: '绑定功能开发中', icon: 'none' });
        }
      }
    });
  },

  // 复制绑定码
  onCopyCode() {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const code = `IKNEE_${userInfo.name || 'USER'}_${Date.now()}`;

    wx.setClipboardData({
      data: code,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  // 解除绑定
  onUnbind(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '解除绑定',
      content: '确定要解除与该家人的绑定吗？',
      success: res => {
        if (res.confirm) {
          wx.showToast({ title: '已解除', icon: 'success' });
          this.loadBoundFamilies();
        }
      }
    });
  }
});
