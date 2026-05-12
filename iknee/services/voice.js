// 小鹅(iKnee) - 语音服务封装
// 语音合成(TTS)和语音识别(ASR)

const config = require('../constants/config');

let audioContext = null;

const initAudio = () => {
  if (!audioContext) {
    audioContext = wx.createInnerAudioContext();
    audioContext.volume = config.audio.defaultVolume;
    audioContext.rate = config.audio.defaultRate;
  }
  return audioContext;
};

/**
 * 播放语音
 */
const speak = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    const { volume = 1, rate = 0.8 } = options;
    initAudio();
    // 实际项目中调用云函数获取TTS
    console.log('播放语音:', text);
    resolve();
  });
};

/**
 * 停止语音
 */
const stopSpeak = () => {
  if (audioContext) audioContext.stop();
};

/**
 * 开始录音
 */
const startRecord = (onResult, onError) => {
  const recorderManager = wx.getRecorderManager();
  recorderManager.start({ duration: 60000, sampleRate: 16000, format: 'mp3' });
  recorderManager.onStop(res => {
    const mockResult = { text: '', confidence: 0 };
    onResult(mockResult);
  });
  return recorderManager;
};

/**
 * 停止录音
 */
const stopRecord = () => {
  wx.getRecorderManager().stop();
};

/**
 * 请求录音权限
 */
const requestPermission = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: () => resolve(true),
            fail: () => reject('未授权')
          });
        } else resolve(true);
      }
    });
  });
};

/**
 * 播放音效
 */
const playEffect = (effect) => {
  const effects = {
    correct: '/assets/audio/correct.mp3',
    error: '/assets/audio/error.mp3',
    complete: '/assets/audio/complete.mp3'
  };
  const audio = wx.createInnerAudioContext();
  audio.src = effects[effect];
  audio.volume = config.audio.sfxVolume;
  audio.play();
};

module.exports = { speak, stopSpeak, startRecord, stopRecord, requestPermission, playEffect };
