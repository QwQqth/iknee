// pages/intro/intro.js
const YEAR_MIN = 1930
const YEAR_MAX = new Date().getFullYear() - 30  // 最小年龄约30岁
const DEFAULT_YEAR = 1960
const voice = require('../../utils/voice')

// 对话阶段
const STAGE = {
  IDLE: 'idle',           // 空闲，等待开场白结束
  WAIT_NAME: 'waitName',  // 等待用户说姓名
  WAIT_GENDER: 'waitGender', // 等待用户说性别
  WAIT_YEAR: 'waitYear',  // 等待用户选年份（引导滑动）
}

Page({
  data: {
    floating: true,
    showModal: false,
    yearMin: YEAR_MIN,
    yearMax: YEAR_MAX,
    currentAge: new Date().getFullYear() - DEFAULT_YEAR,
    thumbPercent: Math.round((DEFAULT_YEAR - YEAR_MIN) / (YEAR_MAX - YEAR_MIN) * 100),
    formData: {
      name: '',
      gender: '',
      birthYear: DEFAULT_YEAR
    },
    isRecording: false,
    isRecognizing: false,
    voiceText: '',
    voiceStage: STAGE.IDLE,     // 当前对话阶段
    voiceHint: '',               // 阶段提示文字
  },

  onLoad() {
    // 检查是否已填写过，若有则直接跳转主页
    const saved = wx.getStorageSync('userProfile')
    if (saved && saved.name) {
      wx.redirectTo({ url: '/pages/index/index' })
      return
    }

    // 开场白：先播欢迎语，3秒后问姓名
    setTimeout(() => {
      voice.speak('您好，我是小鹅。在开始之前，请先告诉我一些基本信息。', () => {
        // 欢迎语播完，3秒后进入问姓名阶段
        setTimeout(() => {
          this.setData({ voiceStage: STAGE.WAIT_NAME, voiceHint: '请告诉我您的姓名' })
          voice.speak('请问您的姓名？')
        }, 3000)
      })
    }, 800)
  },

  onUnload() {
    voice.destroyAudio()
    clearTimeout(this._recognizeTimer)
  },

  // ===== 语音交互 =====

  // 按住麦克风——开始录音
  onVoiceStart() {
    // 空闲阶段不响应
    if (this.data.voiceStage === STAGE.IDLE) return

    // 先停止可能正在播放的语音
    voice.stopAudio()

    this.setData({ isRecording: true, voiceText: '' })

    voice.startRecord({
      duration: 60000,
      onStart: () => {
        this.setData({ isRecording: true })
      },
      onStop: (res) => {
        clearTimeout(this._recognizeTimer)
        voice.recognize(res.tempFilePath).then((text) => {
          this.setData({ isRecognizing: false, voiceText: text })
          this._handleStageInput(text)
        }).catch(() => {
          this.setData({ isRecognizing: false, voiceText: '' })
          wx.showToast({ title: '识别失败，请再试一次', icon: 'none' })
        })
      },
      onError: () => {
        clearTimeout(this._recognizeTimer)
        this.setData({ isRecording: false, isRecognizing: false, voiceText: '' })
        wx.showToast({ title: '录音失败，请再试一次', icon: 'none' })
      }
    })
  },

  // 松开麦克风——停止录音
  onVoiceEnd() {
    if (this.data.isRecording) {
      this.setData({ isRecording: false, isRecognizing: true, voiceText: '' })
      voice.stopRecord()
      // 15秒超时兜底
      this._recognizeTimer = setTimeout(() => {
        if (this.data.isRecognizing) {
          this.setData({ isRecognizing: false, voiceText: '' })
          wx.showToast({ title: '识别超时，请再试一次', icon: 'none' })
        }
      }, 15000)
    }
  },

  // 语音结果输入框手动修改
  onVoiceTextInput(e) {
    this.setData({ voiceText: e.detail.value })
  },

  // 根据当前对话阶段处理识别结果
  _handleStageInput(text) {
    const t = text.trim()
    const stage = this.data.voiceStage

    if (stage === STAGE.WAIT_NAME) {
      this._handleName(t)
    } else if (stage === STAGE.WAIT_GENDER) {
      this._handleGender(t)
    } else if (stage === STAGE.WAIT_YEAR) {
      this._handleYear(t)
    }
  },

  // 处理姓名输入
  _handleName(t) {
    // 匹配"我叫张三"、"我是李四"、"张三"等
    const nameMatch = t.match(/我(?:叫|是)\s*(.{1,6})/)
    let name = ''
    if (nameMatch) {
      name = nameMatch[1].trim()
    } else if (t.length >= 1 && t.length <= 6) {
      // 短文本直接当姓名用
      name = t
    }

    if (name) {
      this.setData({ 'formData.name': name })
      // 进入性别阶段
      this.setData({ voiceStage: STAGE.WAIT_GENDER, voiceHint: '女士还是先生？' })
      voice.speak('我该称呼您为女士，还是先生？')
    } else {
      voice.speak('不好意思，请再说一次您的姓名？')
    }
  },

  // 处理性别输入
  _handleGender(t) {
    let gender = ''
    // 匹配"先生"、"男" → male
    if (t.indexOf('先生') !== -1 || (t.indexOf('男') !== -1 && t.indexOf('女') === -1)) {
      gender = 'male'
    }
    // 匹配"女士"、"女" → female
    if (t.indexOf('女士') !== -1 || t.indexOf('女') !== -1) {
      gender = 'female'
    }

    if (gender) {
      this.setData({ 'formData.gender': gender })
      const name = this.data.formData.name
      const title = gender === 'male' ? '先生' : '女士'
      // 进入年份阶段
      this.setData({ voiceStage: STAGE.WAIT_YEAR, voiceHint: '请滑动选择出生年份' })
      voice.speak('亲爱的' + name + title + '，请滑动按钮，选择您的出生年份。')
    } else {
      voice.speak('请告诉我，女士还是先生？')
    }
  },

  // 处理年份输入（可选，用户也可能直接滑动）
  _handleYear(t) {
    const yearMatch = t.match(/(\d{4})/)
    if (yearMatch) {
      const year = parseInt(yearMatch[1])
      if (year >= YEAR_MIN && year <= YEAR_MAX) {
        const age = new Date().getFullYear() - year
        const percent = Math.round((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN) * 100)
        this.setData({
          'formData.birthYear': year,
          currentAge: age,
          thumbPercent: percent
        })
        voice.speak('好的，' + year + '年出生。信息已填写完毕，请点击开始使用。')
        this.setData({ voiceHint: '信息填写完毕，请点击开始使用' })
        return
      }
    }
    // 没识别到年份，提示滑动
    voice.speak('请滑动下方的按钮来选择您的出生年份。')
  },

  // ===== 表单操作 =====
  onNameInput(e) {
    this.setData({ 'formData.name': e.detail.value })
  },

  onGenderTap(e) {
    this.setData({ 'formData.gender': e.currentTarget.dataset.val })
  },

  // 拖动中实时更新（视觉反馈）
  onBirthYearChanging(e) {
    this._updateBirthYear(e.detail.value)
  },

  // 拖动结束确认值
  onBirthYearChange(e) {
    this._updateBirthYear(e.detail.value)
  },

  _updateBirthYear(year) {
    const yr = Math.round(year)
    const age = new Date().getFullYear() - yr
    const percent = Math.round((yr - YEAR_MIN) / (YEAR_MAX - YEAR_MIN) * 100)
    this.setData({
      'formData.birthYear': yr,
      currentAge: age,
      thumbPercent: percent
    })
  },

  onSubmit() {
    const { name, gender, birthYear } = this.data.formData
    const age = new Date().getFullYear() - birthYear

    if (!name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' }); return
    }
    if (!gender) {
      wx.showToast({ title: '请选择性别', icon: 'none' }); return
    }
    if (!birthYear) {
      wx.showToast({ title: '请选择出生年份', icon: 'none' }); return
    }

    // 保存用户信息
    wx.setStorageSync('userProfile', {
      name: name.trim(),
      gender,
      birthYear,
      age
    })

    // 弹出使用须知
    this.setData({ showModal: true })
  },

  // 点击遮罩层不关闭（防误触）
  onModalMaskTap() {
    // 不做任何操作
  },

  // 同意使用须知，进入主页
  onAgree() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
