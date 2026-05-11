/**
 * server/index.js — 小鹅语音后端
 * 
 * 功能：
 *   POST /tts  — 文字转语音（腾讯云 TTS）
 *   POST /asr — 语音转文字（腾讯云 ASR）
 *
 * 启动方式：
 *   cd server
 *   npm install
 *   node index.js
 */

const express = require('express')
const cors = require('cors')
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

// ===== 腾讯云 SDK =====
// 安装后使用：npm install tencentcloud-sdk-nodejs
const tencentcloud = require('tencentcloud-sdk-nodejs')
const TtsClient = tencentcloud.tts.v20190823.Client
const AsrClient = tencentcloud.asr.v20190614.Client

// ===== 读取配置（从环境变量或 .env 文件）=====
// 支持从环境变量读取，也支持从 .env 文件读取（需安装 dotenv）
let secretId, secretKey
try {
  // 尝试读取 .env 文件
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) {
      const val = vals.join('=').trim()
      if (key.trim() === 'TENCENT_SECRET_ID') secretId = val
      if (key.trim() === 'TENCENT_SECRET_KEY') secretKey = val
    }
  })
} catch (e) {
  // .env 不存在，从环境变量读取
  secretId = process.env.TENCENT_SECRET_ID
  secretKey = process.env.TENCENT_SECRET_KEY
}

if (!secretId || !secretKey || secretId.includes('你的') || secretKey.includes('你的')) {
  console.warn('\n⚠️  腾讯云密钥未配置！')
  console.warn('请编辑 server/.env 文件，填入你的 SecretId 和 SecretKey')
  console.warn('获取地址：https://console.cloud.tencent.com/cam/capi\n')
}

// ===== 初始化腾讯云客户端 =====
let ttsClient = null
let asrClient = null

if (secretId && secretKey && !secretId.includes('你的')) {
  ttsClient = new TtsClient({
    credential: { secretId, secretKey },
    region: 'ap-guangzhou',
    profile: {},
  })

  asrClient = new AsrClient({
    credential: { secretId, secretKey },
    region: 'ap-guangzhou',
    profile: {},
  })
}

// ===== Express 应用 =====
const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

const PORT = process.env.SERVER_PORT || 3000

// ===== 健康检查 =====
app.get('/ping', (req, res) => {
  res.json({ ok: true, ttsReady: !!ttsClient, asrReady: !!asrClient })
})

// ===== TTS：文字转语音 =====
// 请求体：{ "text": "要合成的文本", "voiceType": 1001 }
// 响应体：{ "code": 0, "audio": "base64音频字符串" }
app.post('/tts', async (req, res) => {
  const { text, voiceType } = req.body

  if (!text || !text.trim()) {
    return res.json({ code: -1, message: 'text 不能为空' })
  }

  // 模拟模式：没有配置密钥时返回模拟数据
  if (!ttsClient) {
    console.log('[TTS] 模拟模式，文本：', text.substring(0, 30))
    return res.json({ code: 0, audio: '', mock: true })
  }

  try {
    const params = {
      Text: text.trim(),
      SessionId: 'xiaoe-' + Date.now(),
      VoiceType: voiceType || 1001,   // 1001=智瑜（情感女声），1050=智侠（情感男声）
      Speed: 0,                       // 语速，-2 到 2，0=正常
      Volume: 0,                      // 音量，0=正常
      ModelType: 1,                   // 1=普通音色，2=情感音色
    }

    const result = await ttsClient.TextToSpeech(params)

    if (result && result.Audio) {
      // result.Audio 是 base64 编码的 mp3 音频
      console.log('[TTS] 合成成功，文本：', text.substring(0, 20))
      res.json({ code: 0, audio: result.Audio })
    } else {
      res.json({ code: -1, message: 'TTS 返回为空', detail: result })
    }
  } catch (err) {
    console.error('[TTS] 错误：', err.message)
    res.json({ code: -1, message: err.message || 'TTS 合成失败' })
  }
})

// ===== ASR：语音转文字 =====
// 请求：multipart/form-data，字段名 file
// 响应体：{ "code": 0, "result": "识别文字" }
app.post('/asr', (req, res) => {
  const form = formidable({ multiples: false })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.json({ code: -1, message: '文件解析失败' })
    }

    const file = files.file || files.audio
    if (!file) {
      return res.json({ code: -1, message: '未收到音频文件' })
    }

    // 模拟模式
    if (!asrClient) {
      console.log('[ASR] 模拟模式')
      const mockResults = ['你好', '我叫测试', '先生', '1965年']
      const result = mockResults[Math.floor(Math.random() * mockResults.length)]
      return res.json({ code: 0, result })
    }

    try {
      const filePath = Array.isArray(file) ? file[0].filepath : file.filepath
      const audioData = fs.readFileSync(filePath)
      const audioBase64 = audioData.toString('base64')

      const params = {
        EngineModelType: '16k_zh',
        ChannelNum: 1,
        ResTextFormat: 0,
        SourceType: 1,
        Data: audioBase64,
      }

      const result = await asrClient.SentenceRecognition(params)
      const recognizedText = result?.Result || ''

      console.log('[ASR] 识别结果：', recognizedText)
      res.json({ code: 0, result: recognizedText })
    } catch (err) {
      console.error('[ASR] 错误：', err.message)
      res.json({ code: -1, message: err.message || 'ASR 识别失败' })
    }
  })
})

// ===== 启动 =====
app.listen(PORT, '0.0.0.0', () => {
  const os = require('os')
  const interfaces = os.networkInterfaces()
  const addresses = []

  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        addresses.push(`http://${config.address}:${PORT}`)
      }
    }
  }

  console.log('\n✅ 小鹅语音后端已启动！')
  console.log('─────────────────────────────────')
  console.log('本机访问：    http://localhost:' + PORT)
  if (addresses.length) {
    console.log('局域网访问：', addresses[0])
    console.log('（将此地址填入 utils/voice.js 的 API_BASE）')
  }
  console.log('─────────────────────────────────')
  console.log('接口列表：')
  console.log('  POST /tts  — 文字转语音')
  console.log('  POST /asr  — 语音转文字')
  console.log('  GET  /ping — 健康检查')
  console.log('')
  if (!ttsClient) {
    console.log('⚠️  TTS 未配置（模拟模式），请编辑 server/.env 配置密钥')
  }
  if (!asrClient) {
    console.log('⚠️  ASR 未配置（模拟模式），请编辑 server/.env 配置密钥')
  }
  console.log('')
})
