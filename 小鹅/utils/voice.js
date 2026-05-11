/**
 * utils/voice.js — 语音交互工具模块
 *
 * 架构：录音用微信原生 API，识别/合成走后端 API（腾讯云语音服务）
 * 后端未就绪时使用模拟模式，确保页面可正常运行
 *
 * 接入真实后端步骤：
 *   1. cd server && npm install && node index.js
 *   2. 将终端显示的局域网地址（如 http://192.168.x.x:3000）填入下方 API_BASE
 *   3. 在微信开发者工具中勾选「不校验合法域名」（开发阶段）
 */

// ===== 配置 =====
// 后端 API 地址，部署后填入，如 'http://192.168.1.100:3000'
const API_BASE = ''

// 是否使用模拟模式（后端未就绪时为 true）
const MOCK_MODE = !API_BASE

// ===== 录音管理 =====
let recorderManager = null

/**
 * 获取录音管理器（全局单例）
 */
function getRecorder() {
  if (!recorderManager) {
    recorderManager = wx.getRecorderManager()
  }
  return recorderManager
}

/**
 * 开始录音
 * @param {Object} options
 * @param {number} options.duration - 最长录音时长(ms)，默认60000
 * @param {Function} options.onStart - 开始回调
 * @param {Function} options.onStop - 结束回调，参数 { tempFilePath, duration }
 * @param {Function} options.onError - 错误回调
 */
function startRecord(options) {
  const manager = getRecorder()
  const opts = options || {}

  manager.onStart = function() {
    if (opts.onStart) opts.onStart()
  }

  manager.onStop = function(res) {
    if (opts.onStop) opts.onStop(res)
  }

  manager.onError = function(err) {
    if (opts.onError) opts.onError(err)
  }

  manager.start({
    format: 'mp3',
    duration: opts.duration || 60000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 96000
  })
}

/**
 * 停止录音
 */
function stopRecord() {
  const manager = getRecorder()
  manager.stop()
}

// ===== 语音识别（ASR）=====

/**
 * 语音识别：将录音文件转为文字
 * @param {string} tempFilePath - 录音临时文件路径
 * @returns {Promise<string>} - 识别结果文字
 */
function recognize(tempFilePath) {
  if (MOCK_MODE) {
    return _mockRecognize()
  }

  return new Promise(function(resolve, reject) {
    wx.uploadFile({
      url: API_BASE + '/asr',
      filePath: tempFilePath,
      name: 'file',
      success: function(res) {
        try {
          var data = JSON.parse(res.data)
          if (data.code === 0 && data.result) {
            resolve(data.result)
          } else {
            reject(new Error(data.message || '识别失败'))
          }
        } catch (e) {
          reject(new Error('解析识别结果失败'))
        }
      },
      fail: function(err) {
        reject(new Error('网络请求失败'))
      }
    })
  })
}

// ===== 语音合成（TTS）=====

/**
 * 语音合成：将文字转为音频并播放
 * @param {string} text - 要合成的文字
 * @param {Function} onEnded - 播放结束回调
 * @returns {Promise} - 完成的 Promise
 */
function synthesize(text, onEnded) {
  if (MOCK_MODE) {
    return _mockSynthesize(onEnded)
  }

  return new Promise(function(resolve, reject) {
    wx.request({
      url: API_BASE + '/tts',
      method: 'POST',
      data: {
        text: text,
        voiceType: 1001   // 1001=智瑜（女声），1050=智侠（男声）
      },
      success: function(res) {
        if (res.data && res.data.code === 0 && res.data.audio) {
          // 后端返回 base64 音频，写入本地文件后播放
          _saveAndPlay(res.data.audio, onEnded).then(resolve).catch(reject)
        } else {
          reject(new Error(res.data?.message || '合成失败'))
        }
      },
      fail: function() {
        reject(new Error('网络请求失败'))
      }
    })
  })
}

/**
 * 将 base64 音频写入本地文件并播放
 */
function _saveAndPlay(base64Audio, onEnded) {
  return new Promise(function(resolve, reject) {
    var fs = wx.getFileSystemManager()
    var fileName = 'tts_' + Date.now() + '.mp3'
    var filePath = wx.env.USER_DATA_PATH + '/' + fileName

    fs.writeFile({
      filePath: filePath,
      data: base64Audio,
      encoding: 'base64',
      success: function() {
        _playLocalFile(filePath, onEnded)
        resolve()
      },
      fail: function(err) {
        // 写入失败，尝试直接使用 base64（部分机型支持）
        reject(new Error('音频文件写入失败'))
      }
    })
  })
}

/**
 * 播放本地音频文件
 */
var _audioContext = null

function _playLocalFile(filePath, onEnded) {
  if (_audioContext) {
    _audioContext.destroy()
  }
  var audio = wx.createInnerAudioContext()
  audio.src = filePath
  audio.onEnded = function() {
    if (onEnded) onEnded()
  }
  audio.onError = function() {
    if (onEnded) onEnded()
  }
  audio.play()
  _audioContext = audio
}

// ===== 音频播放（外部调用）=====

/**
 * 播放音频（通用，传入 URL 或本地路径）
 * @param {string} url - 音频地址
 * @param {Function} onEnded - 播放结束回调
 */
function playAudio(url, onEnded) {
  if (_audioContext) {
    _audioContext.destroy()
  }
  var audio = wx.createInnerAudioContext()
  audio.src = url
  audio.onEnded = function() {
    if (onEnded) onEnded()
  }
  audio.onError = function() {
    if (onEnded) onEnded()
  }
  audio.play()
  _audioContext = audio
}

/**
 * 停止播放
 */
function stopAudio() {
  if (_audioContext) {
    _audioContext.stop()
  }
}

/**
 * 销毁音频上下文
 */
function destroyAudio() {
  if (_audioContext) {
    _audioContext.destroy()
    _audioContext = null
  }
}

// ===== 播报文字（合成+播放，自动分段）=====

/**
 * 播报文字（合成+播放，自动分段）
 * @param {string} text - 要播报的文字
 * @param {Function} onComplete - 全部播完回调
 */
function speak(text, onComplete) {
  if (MOCK_MODE) {
    // 模拟模式：直接显示文字，不播报，延时回调
    if (onComplete) setTimeout(onComplete, 1500)
    return Promise ? Promise.resolve() : null
  }

  // 分段处理长文本
  var chunks = _splitText(text, 150)
  return _speakChunks(chunks, 0, onComplete)
}

function _splitText(text, maxLen) {
  var result = []
  var remaining = text
  while (remaining.length > maxLen) {
    var cutAt = maxLen
    for (var i = maxLen; i > maxLen - 10 && i > 0; i--) {
      if ('，。、；！？,.!?'.indexOf(remaining[i]) !== -1) {
        cutAt = i + 1
        break
      }
    }
    result.push(remaining.substring(0, cutAt))
    remaining = remaining.substring(cutAt)
  }
  if (remaining.length > 0) result.push(remaining)
  return result
}

function _speakChunks(chunks, index, onComplete) {
  if (index >= chunks.length) {
    if (onComplete) onComplete()
    return Promise ? Promise.resolve() : null
  }

  return synthesize(chunks[index]).then(function() {
    // synthesize 内部已处理播放，等待播放结束后继续下一段
    // 注意：synthesize 不直接返回"播放结束"信号
    // 这里简化处理：假设短音频 3 秒内播放完
    setTimeout(function() {
      _speakChunks(chunks, index + 1, onComplete)
    }, chunks[index].length * 200 + 1500) // 粗略估算播放时长
  }).catch(function() {
    // 合成失败，跳过该段继续
    _speakChunks(chunks, index + 1, onComplete)
  })
}

// ===== 模拟模式（开发阶段用）=====
var _mockStageIndex = 0
var _mockByName = ['张三', '李四', '王五']
var _mockByStage = [
  '我叫' + _mockByName[0],   // STAGE 0 → 姓名
  '先生',                          // STAGE 1 → 性别
  '1960年',                       // STAGE 2 → 年份
]

function _mockRecognize() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      var result = _mockByStage[_mockStageIndex % _mockByStage.length]
      _mockStageIndex++
      resolve(result)
    }, 1000)
  })
}

function _mockSynthesize(onEnded) {
  // 模拟合成：不播放音频，延时回调
  setTimeout(function() {
    if (onEnded) onEnded()
  }, 500)
  return Promise ? Promise.resolve() : null
}

// ===== 导出 =====
module.exports = {
  getRecorder: getRecorder,
  startRecord: startRecord,
  stopRecord: stopRecord,
  recognize: recognize,
  synthesize: synthesize,
  playAudio: playAudio,
  stopAudio: stopAudio,
  destroyAudio: destroyAudio,
  speak: speak,
  isMockMode: MOCK_MODE
}
