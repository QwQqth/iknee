// 小鹅(iKnee) - 引导页逻辑
// 语音交互引导用户完成注册

const voice = require('../../services/voice');
const levels = require('../../constants/levels');

// 阶段定义
const STAGE = {
  IDLE: 'idle',           // 等待开始
  WAIT_NAME: 'wait_name',   // 等待称呼
  WAIT_GENDER: 'wait_gender', // 等待性别
  WAIT_YEAR: 'wait_year',    // 等待出生年份
  COMPLETE: 'complete'       // 完成
};

Page({
  data: {
    // 语音状态
    voiceState: 'default',  // default | recording | loading
    showHint: false,
    showBubble: false,
    recognizedText: '',
    penguinEmotion: '👋',

    // 欢迎文字
    welcomeTitle: '您好！',
    welcomeSubtitle: '我是小鹅，我来帮您了解膝关节健康',

    // 语音提示
    voiceHint: '请按住按钮告诉我您的称呼',

    // 当前阶段
    currentStage: STAGE.IDLE,

    // 用户信息
    userInfo: {
      name: '',
      gender: '',
      birthYear: 0
    },

    // 录音器实例
    recorderManager: null,

    // 超时定时器
    timeoutTimer: null
  },

  onLoad() {
    // 初始化
    this.initGuide();
  },

  onReady() {
    // 页面准备好后自动开始引导
    setTimeout(() => {
      this.startGuide();
    }, 500);
  },

  // 初始化引导
  initGuide() {
    // 请求录音权限
    voice.requestPermission().catch(err => {
      console.log('录音权限未授权:', err);
    });

    // 初始化录音管理器
    const recorderManager = wx.getRecorderManager();
    this.setData({ recorderManager });

    recorderManager.onStart(() => {
      console.log('录音开始');
    });

    recorderManager.onStop(res => {
      console.log('录音结束', res);
      this.handleVoiceResult(res.tempFilePath);
    });

    recorderManager.onError(err => {
      console.error('录音错误:', err);
      this.setData({ voiceState: 'default' });
    });
  },

  // 开始引导
  startGuide() {
    // 欢迎语
    this.speakAndShow('您好！我是小鹅，我来帮您了解膝关节健康', () => {
      setTimeout(() => {
        this.nextStage(STAGE.WAIT_NAME);
      }, 500);
    });
  },

  // 进入下一阶段
  nextStage(stage) {
    const stageConfig = {
      [STAGE.WAIT_NAME]: {
        title: '您好！',
        subtitle: '请告诉我您怎么称呼？',
        hint: '请按住按钮说"我姓X"或"叫我X"',
        emotion: '😊'
      },
      [STAGE.WAIT_GENDER]: {
        title: '好的，{{name}}！',
        subtitle: '请问您是爷爷还是奶奶？',
        hint: '请说"爷爷"或"奶奶"',
        emotion: '🤔'
      },
      [STAGE.WAIT_YEAR]: {
        title: '{{gender}}好！',
        subtitle: '请问您是哪一年出生的？',
        hint: '请按住按钮说出您的出生年份',
        emotion: '😊'
      },
      [STAGE.COMPLETE]: {
        title: '太好了！',
        subtitle: '欢迎加入小鹅大家庭',
        hint: '',
        emotion: '🎉'
      }
    };

    const config = stageConfig[stage];
    if (!config) return;

    this.setData({
      currentStage: stage,
      showBubble: true,
      penguinEmotion: config.emotion,
      welcomeTitle: config.title.replace('{{name}}', this.data.userInfo.name || '').replace('{{gender}}', this.data.userInfo.gender || ''),
      welcomeSubtitle: config.subtitle,
      voiceHint: config.hint,
      showHint: !!config.hint,
      recognizedText: ''
    });

    // 完成阶段
    if (stage === STAGE.COMPLETE) {
      setTimeout(() => {
        this.completeGuide();
      }, 1500);
    } else {
      // 自动播放提示语
      this.speakAndShow(config.subtitle);
    }
  },

  // 语音按钮按下
  onVoiceStart(e) {
    if (this.data.voiceState !== 'default') return;
    
    this.setData({ voiceState: 'recording' });
    
    // 开始录音
    this.data.recorderManager.start({
      duration: 10000,  // 最多10秒
      sampleRate: 16000,
      format: 'mp3'
    });

    // 设置超时
    const timer = setTimeout(() => {
      this.onVoiceEnd();
    }, 10000);
    this.setData({ timeoutTimer: timer });
  },

  // 语音按钮松开
  onVoiceEnd() {
    if (this.data.voiceState !== 'recording') return;

    // 清除超时
    if (this.data.timeoutTimer) {
      clearTimeout(this.data.timeoutTimer);
      this.setData({ timeoutTimer: null });
    }

    this.setData({ voiceState: 'loading' });
    this.data.recorderManager.stop();
  },

  // 处理语音识别结果
  handleVoiceResult(tempFilePath) {
    // 模拟识别结果（实际项目中调用云函数ASR）
    const result = this.simulateRecognize(tempFilePath);
    
    this.setData({
      recognizedText: result.text,
      voiceState: 'default'
    });

    // 根据当前阶段处理结果
    this.processStageInput(result.text);
  },

  // 模拟语音识别
  simulateRecognize(filePath) {
    // 实际项目中应该调用云函数进行ASR
    // 这里返回模拟数据
    const stage = this.data.currentStage;
    
    // 模拟识别到的文本
    const mockTexts = {
      [STAGE.WAIT_NAME]: ['我姓王', '叫我李老师', '小张'],
      [STAGE.WAIT_GENDER]: ['爷爷', '奶奶'],
      [STAGE.WAIT_YEAR]: ['六五年', '1960年', '五五年']
    };

    const options = mockTexts[stage] || [''];
    const randomText = options[Math.floor(Math.random() * options.length)];

    return {
      text: randomText,
      confidence: 0.9
    };
  },

  // 处理阶段输入
  processStageInput(text) {
    const stage = this.data.currentStage;
    let userInfo = { ...this.data.userInfo };

    switch (stage) {
      case STAGE.WAIT_NAME:
        // 提取姓名
        const name = this.extractName(text);
        if (name) {
          userInfo.name = name;
          this.setData({ userInfo });
          this.nextStage(STAGE.WAIT_GENDER);
        } else {
          this.speakAndShow('不好意思，我没听清楚，请再说一次您的称呼？');
        }
        break;

      case STAGE.WAIT_GENDER:
        // 提取性别
        const gender = this.extractGender(text);
        if (gender) {
          userInfo.gender = gender;
          this.setData({ userInfo });
          this.nextStage(STAGE.WAIT_YEAR);
        } else {
          this.speakAndShow('不好意思，我没听清楚，请说"爷爷"或"奶奶"？');
        }
        break;

      case STAGE.WAIT_YEAR:
        // 提取出生年份
        const year = this.extractYear(text);
        if (year) {
          userInfo.birthYear = year;
          this.setData({ userInfo });
          this.nextStage(STAGE.COMPLETE);
        } else {
          this.speakAndShow('不好意思，我没听清楚，请说出您的出生年份，比如"六五年"或"一九六零年"');
        }
        break;
    }
  },

  // 提取姓名
  extractName(text) {
    // 简单匹配
    const patterns = [
      /我姓(\S{1,4})/,
      /叫我(\S{1,4})/,
      /叫(\S{1,4})/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }

    // 如果包含单个名字词
    if (text.length >= 1 && text.length <= 4) {
      return text;
    }

    return null;
  },

  // 提取性别
  extractGender(text) {
    if (text.includes('爷') || text.includes('男')) return '爷爷';
    if (text.includes('奶') || text.includes('女')) return '奶奶';
    return null;
  },

  // 提取年份
  extractYear(text) {
    // 匹配各种年份格式
    const patterns = [
      /19(\d{2})/,
      /20(\d{2})/,
      /一?九[零一二三四五六七八九]{1,4}年?/,
      /(\d{4})/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        let year = parseInt(match[0]);
        if (year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }
        // 判断是否为合理的老年人年龄(50-90)
        if (year >= 1935 && year <= 1975) {
          return year;
        }
      }
    }

    return null;
  },

  // 语音播报
  speakAndShow(text, callback) {
    voice.speak(text, { rate: 0.8, volume: 1 }).then(() => {
      if (callback) callback();
    }).catch(err => {
      console.error('语音播放失败:', err);
      if (callback) callback();
    });
  },

  // 完成引导
  completeGuide() {
    // 保存用户信息
    const app = getApp();
    app.globalData.userInfo = this.data.userInfo;
    app.globalData.isFirstLaunch = false;

    wx.setStorageSync('userInfo', this.data.userInfo);

    // 跳转到首页
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  // 跳过
  onSkip() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  onUnload() {
    // 清理
    if (this.data.timeoutTimer) {
      clearTimeout(this.data.timeoutTimer);
    }
    voice.stopSpeak();
  }
});
