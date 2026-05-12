// 小鹅(iKnee) - 应用入口
// 腾讯公益项目「企鹅抗腿队」

App({
  // 全局数据
  globalData: {
    userInfo: null,           // 用户信息
    isFirstLaunch: true,      // 是否首次启动
    voiceEnabled: true,       // 语音是否启用
    volume: 1.0,               // 音量 0-1
    fontSize: 'normal',        // 字体大小: small/normal/large
    kneeScore: 0,             // 膝关节评分
    energyStars: 0,           // 能量星数量
    currentLevel: 1,           // 当前关卡
    levelProgress: {},         // 关卡进度 { levelId: { unlocked, starCount, bestScore } }
  },

  // 小程序启动
  onLaunch() {
    // 1. 检查更新
    this.checkForUpdate();

    // 2. 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'iknee-prod-xxxx',  // 云环境ID
        traceUser: true,
      });
    }

    // 3. 加载本地存储数据
    this.loadLocalData();

    // 4. 检查登录状态
    this.checkLoginStatus();
  },

  // 检查更新
  checkForUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();

      updateManager.onCheckForUpdate(res => {
        if (res.hasUpdate) {
          console.log('有新版本可用');
        }
      });

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success: res => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(() => {
        wx.showModal({
          title: '更新失败',
          content: '新版本下载失败，请检查网络后重试',
          showCancel: false
        });
      });
    }
  },

  // 加载本地存储数据
  loadLocalData() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const levelProgress = wx.getStorageSync('levelProgress');
      const settings = wx.getStorageSync('settings');

      if (userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.isFirstLaunch = false;
      }

      if (levelProgress) {
        this.globalData.levelProgress = levelProgress;
      }

      if (settings) {
        this.globalData.voiceEnabled = settings.voiceEnabled;
        this.globalData.volume = settings.volume || 1.0;
        this.globalData.fontSize = settings.fontSize || 'normal';
      }

      console.log('本地数据加载完成', this.globalData);
    } catch (e) {
      console.error('加载本地数据失败', e);
    }
  },

  // 保存数据到本地
  saveLocalData(key, value) {
    try {
      wx.setStorageSync(key, value);
      this.globalData[key] = value;
    } catch (e) {
      console.error('保存本地数据失败', e);
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token) {
      // token存在，验证有效性
      this.validateToken(token);
    } else {
      // 未登录，等待用户触发
      this.globalData.isFirstLaunch = true;
    }
  },

  // 验证Token有效性
  validateToken(token) {
    // 实际项目中调用云函数验证
    wx.cloud.callFunction({
      name: 'validateToken',
      data: { token },
      success: res => {
        if (res.result.valid) {
          this.globalData.userInfo = res.result.userInfo;
        } else {
          // Token失效，清除登录状态
          this.handleLogout();
        }
      },
      fail: err => {
        console.error('Token验证失败', err);
      }
    });
  },

  // 用户登录
  doLogin(callback) {
    // 微信登录
    wx.login({
      success: loginRes => {
        if (loginRes.code) {
          // 调用云函数进行登录
          wx.cloud.callFunction({
            name: 'login',
            data: { code: loginRes.code },
            success: res => {
              if (res.result.success) {
                const { userInfo, token } = res.result;
                this.globalData.userInfo = userInfo;
                this.globalData.isFirstLaunch = false;

                // 保存Token
                wx.setStorageSync('token', token);
                wx.setStorageSync('userInfo', userInfo);

                if (callback && callback.success) {
                  callback.success(userInfo);
                }
              } else {
                if (callback && callback.fail) {
                  callback.fail(res.result.message);
                }
              }
            },
            fail: err => {
              console.error('登录请求失败', err);
              if (callback && callback.fail) {
                callback.fail('网络错误，请重试');
              }
            }
          });
        }
      },
      fail: () => {
        if (callback && callback.fail) {
          callback.fail('微信登录失败');
        }
      }
    });
  },

  // 退出登录
  handleLogout() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    this.globalData.userInfo = null;
    this.globalData.isFirstLaunch = true;

    // 跳转到引导页
    wx.reLaunch({
      url: '/pages/guide/guide'
    });
  },

  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo;
  },

  // 更新用户信息
  updateUserInfo(userInfo) {
    this.globalData.userInfo = { ...this.globalData.userInfo, ...userInfo };
    wx.setStorageSync('userInfo', this.globalData.userInfo);

    // 同步到云端
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: { userInfo: this.globalData.userInfo }
    });
  },

  // 获取设置
  getSettings() {
    return {
      voiceEnabled: this.globalData.voiceEnabled,
      volume: this.globalData.volume,
      fontSize: this.globalData.fontSize
    };
  },

  // 更新设置
  updateSettings(settings) {
    this.globalData.voiceEnabled = settings.voiceEnabled ?? this.globalData.voiceEnabled;
    this.globalData.volume = settings.volume ?? this.globalData.volume;
    this.globalData.fontSize = settings.fontSize ?? this.globalData.fontSize;

    wx.setStorageSync('settings', {
      voiceEnabled: this.globalData.voiceEnabled,
      volume: this.globalData.volume,
      fontSize: this.globalData.fontSize
    });
  },

  // 全局分享配置
  onShareAppMessage() {
    return {
      title: '小鹅陪你练一练，关节轻松又灵活',
      path: '/pages/index/index',
      imageUrl: '/assets/images/share-cover.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '小鹅陪你练一练，关节轻松又灵活',
      query: 'from=share',
      imageUrl: '/assets/images/share-cover.png'
    };
  }
});
