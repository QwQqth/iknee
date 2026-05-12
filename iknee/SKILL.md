# 小鹅抗腿队 - 微信小程序开发规范

> 基于腾讯公益项目「企鹅抗腿队」项目书 v1.0

## 1. 项目概述

### 1.1 产品定位
- **产品名称**：小鹅（iKnee）
- **Slogan**：小鹅陪你练一练，关节轻松又灵活
- **产品类型**：微信小程序
- **目标用户**：60岁以上有预防膝关节需求的老年人 + 关心父母健康的子女
- **核心理念**：将枯燥的运动练习转化为"帮助小企鹅建造家园"的趣味探险

### 1.2 核心价值
| 价值维度 | 描述 |
|---------|------|
| 健康价值 | AI动作评估→个性计划→实时纠错的完整闭环 |
| 经济价值 | AI替代人工，单次使用成本趋近于零 |
| 社会价值 | 游戏化+情感化IP陪伴，提升训练依从性 |

### 1.3 成功指标 (KPIs)
- 日均活跃时长：目标 > 8分钟
- 七日留存率：目标 > 45%
- 动作完成率：目标 > 80%
- 适老化评分：目标 > 4.8分（5分制）

---

## 2. 功能架构

### 2.1 核心模块划分

```
┌─────────────────────────────────────────────────────────────┐
│                         TabBar                              │
├─────────────┬─────────────┬─────────────┬─────────────────┤
│   🏠 首页    │   🏃 训练    │   📖 百科    │   👤 我的      │
│  (HomeBase) │  (每日练)   │  (小百科)   │   (档案/设置)   │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│ 家园入口     │ 动作学习     │ 语音问答     │ 用户档案        │
│ 今日任务     │ AI练习      │ 科普视频    │ 训练记录        │
│ 能量星      │ 关卡列表     │ 每日推送    │ 家人绑定        │
│ 健康日历     │ 进度追踪     │            │ 设置          │
└─────────────┴─────────────┴─────────────┴─────────────────┘
```

### 2.2 页面清单

| 页面路径 | 名称 | 功能描述 |
|---------|------|---------|
| `/pages/index/index` | 首页(家园) | 极地家园场景、任务入口、能量星、日历 |
| `/pages/assessment/assessment` | 企鹅小测评 | AI动作评估入口、膝关节评分 |
| `/pages/training/training` | 企鹅每日练 | 关卡选择、视频学习、AI练习 |
| `/pages/training/practice/practice` | AI练习页 | 摄像头捕捉、实时反馈、游戏化引导 |
| `/pages/encyclopedia/encyclopedia` | 企鹅小百科 | 科普文章、视频推荐 |
| `/pages/qa/qa` | 问答页 | 小鹅语音问答、健康咨询 |
| `/pages/video/video` | 视频详情 | 科普视频播放 |
| `/pages/profile/profile` | 健康档案 | 用户信息、体检记录、评分历史 |
| `/pages/records/records` | 训练记录 | 历史打卡、成就展示 |
| `/pages/settings/settings` | 设置 | 音量、字号、隐私设置 |
| `/pages/bind/bind` | 家人绑定 | 子女绑定、远程查看 |
| `/pages/guide/guide` | 引导页 | 首次注册语音引导 |

### 2.3 六大训练关卡

| 关卡 | 游戏任务 | 康复动作 | 游戏映射逻辑 |
|-----|---------|---------|------------|
| 01 | 冰山凿洞 | 靠墙静蹲 | 保持时间=冰山裂纹进度 |
| 02 | 跨越浮木 | 坐姿抬腿 | 抬腿次数=铺设浮木数量 |
| 03 | 捕捉极光鱼 | 坐姿体前屈 | 伸手幅度=捕网大小 |
| 04 | 建造彩虹桥 | 臀桥 | 臀部高度=桥梁高度 |
| 05 | 抵御寒风 | 单腿站立 | 身体稳定性=风力大小 |
| 06 | 划动破冰船 | 勾绷脚 | 脚踝活动=船只动力 |

---

## 3. UI/UX 设计规范

### 3.1 色彩系统

```css
:root {
  /* 主色调 - 温暖活力 */
  --primary: #FF9F43;        /* 暖橙色 */
  --primary-light: #FECA57;  /* 阳光黄 */
  
  /* 辅助色 - 背景 */
  --bg-primary: #E8F4FD;     /* 天空蓝(淡) */
  --bg-secondary: #F5F9FC;   /* 浅背景 */
  
  /* 功能色 */
  --success: #26DE81;         /* 成功绿 */
  --warning: #FECA57;        /* 警告黄 */
  --error: #FF6B6B;          /* 柔和珊瑚红 */
  
  /* 文字色 */
  --text-primary: #333333;   /* 深灰(正文) */
  --text-secondary: #666666; /* 次要文字 */
  --text-disabled: #999999;  /* 禁用文字 */
  
  /* 禁忌色 */
  --taboo-black: #000000;    /* 禁止纯黑文字 */
  --taboo-purple: #8B5CF6;   /* 老人不易分辨的蓝紫 */
}
```

### 3.2 字体规范

```css
/* 适老化大字体 */
--font-title: 24px;   /* 标题 ≥ 24pt */
--font-body: 20px;    /* 正文 ≥ 20pt */
--font-small: 18px;   /* 辅助文字 ≥ 18pt */
--font-weight: bold;  /* 全局加粗 */
--font-style: normal; /* 禁止斜体、细体 */
```

### 3.3 按钮设计

```css
/* 主按钮 - 橙色大按钮 */
.btn-primary {
  height: 88rpx;
  min-height: 88rpx;
  padding: 0 48rpx;
  background: linear-gradient(135deg, #FF9F43, #FFB366);
  border-radius: 44rpx;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(255, 159, 67, 0.4);
}

/* 热区扩展 */
.btn-hotspot {
  padding: 15px;  /* 四周扩展15px热区 */
}

/* 点击反馈 */
.btn-active {
  transform: scale(0.95);
  opacity: 0.9;
}
```

### 3.4 小企鹅IP形象

| 状态 | 表情 | 触发场景 |
|-----|------|---------|
| 鼓励 | 👍竖大拇指 | 动作标准、完成训练 |
| 疑惑 | 🤔挠头 | 没看懂、犹豫 |
| 开心 | 🤩跳舞 | 通关、获得成就 |
| 担心 | 😟皱眉 | 动作不标准 |
| 庆祝 | 🎉撒花 | 完成全套训练 |
| 寻找 | 👀张望 | 人物出镜、丢失检测 |

### 3.5 交互设计原则

1. **零文字操作**：核心流程通过动态箭头、高亮轮廓、语音指令引导
2. **自动流转**：动作达标自动计数/跳转，减少手动点击
3. **防误触设计**：关键操作需二次确认
4. **音频优先**：默认大音量，语速比正常慢20%

---

## 4. 技术架构

### 4.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                                │
│                   微信小程序前端                              │
│   WXML + WXSS + JS + Camera + Canvas + InnerAudioContext    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      微信云开发                               │
│   ┌──────────┬──────────┬──────────┬──────────┬──────────┐    │
│   │云函数    │云数据库   │云存储    │ 云托管   │ 登录服务  │    │
│   │CloudFunc │CloudDB   │CloudStor │CloudBase │ 用户认证  │    │
│   └──────────┴──────────┴──────────┴──────────┴──────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      AI引擎层                                │
│   ┌──────────┬──────────┬──────────┬──────────┐             │
│   │姿态检测   │语音交互   │个性化推荐 │ 评分算法  │             │
│   │(腾讯云)  │(ASR/TTS) │(规则引擎) │(自研)    │             │
│   └──────────┴──────────┴──────────┴──────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 目录结构

```
iknee/                    # 项目根目录
├── app.js                # 应用入口
├── app.json              # 全局配置
├── app.wxss              # 全局样式
├── project.config.json   # 项目配置
├── sitemap.json          # 微信搜索配置
│
├── pages/                # 页面目录
│   ├── index/            # 首页(家园)
│   ├── assessment/       # 测评页
│   ├── training/         # 训练页
│   │   ├── training      # 训练主页
│   │   └── practice      # AI练习页
│   ├── encyclopedia/     # 百科首页
│   ├── qa/               # 问答页
│   ├── video/            # 视频详情
│   ├── profile/          # 健康档案
│   ├── records/          # 训练记录
│   ├── settings/         # 设置
│   ├── bind/             # 家人绑定
│   └── guide/            # 引导页
│
├── components/           # 公共组件
│   ├── penguin-ip/       # 小企鹅IP组件
│   ├── level-card/       # 关卡卡片
│   ├── action-video/     # 动作视频
│   ├── score-circle/     # 评分圆环
│   ├── calendar-stamp/   # 日历印章
│   ├── voice-btn/        # 语音按钮
│   └── countdown/        # 倒计时
│
├── services/             # 业务服务层
│   ├── api.js            # API统一封装
│   ├── auth.js           # 登录认证
│   ├── pose.js           # 姿态检测服务
│   ├── voice.js          # 语音服务
│   └── training.js       # 训练服务
│
├── utils/                # 工具函数
│   ├── request.js        # 网络请求
│   ├── storage.js        # 本地存储
│   ├── angle.js          # 角度计算
│   └── validate.js       # 表单验证
│
├── constants/            # 常量配置
│   ├── levels.js         # 关卡配置
│   ├── actions.js        # 动作标准库
│   └── config.js         # 全局配置
│
└── assets/               # 静态资源
    ├── images/           # 图片
    ├── audio/            # 音频
    └── sprites/          # 精灵图/序列帧
```

### 4.3 数据库设计 (CloudDB)

```javascript
// 用户档案集合: user_profile
{
  "_id": "openid_xxx",
  "nickname": "用户昵称",
  "avatar": "头像URL",
  "gender": "male/female",
  "birthYear": 1960,
  "height": 165,
  "weight": 65,
  "medicalHistory": [],      // 病史数组
  "kneeScore": 85,           // 膝关节评分
  "createdAt": "2026-01-01",
  "updatedAt": "2026-05-12"
}

// 训练记录集合: training_records
{
  "_id": "record_xxx",
  "userId": "openid_xxx",
  "levelId": "level_01",
  "actionType": "squat",
  "score": 88,
  "duration": 45,            // 动作持续秒数
  "corrections": [],         // 纠正次数
  "completedAt": "2026-05-12T10:30:00"
}

// 关卡进度集合: level_progress
{
  "_id": "progress_xxx",
  "userId": "openid_xxx",
  "levelId": "level_01",
  "unlocked": true,
  "starCount": 3,             // 1-3星
  "bestScore": 92,
  "attemptCount": 5,
  "lastAttemptAt": "2026-05-12"
}

// 科普视频集合: videos
{
  "_id": "video_xxx",
  "title": "标题",
  "coverUrl": "封面图",
  "videoUrl": "视频URL",
  "duration": 120,
  "tags": ["预防", "膝关节"],
  "viewCount": 1000,
  "createdAt": "2026-01-01"
}
```

### 4.4 云函数设计

| 云函数名 | 功能描述 | 输入 | 输出 |
|---------|---------|------|------|
| `getKneeScore` | 膝关节综合评分 | 身高/体重/病史/动作数据 | 评分0-100 |
| `detectPose` | 姿态检测 | 视频文件/关键点数据 | 关节角度/标准度 |
| `generatePlan` | 生成训练计划 | 用户档案/当前进度 | 个性化计划JSON |
| `login` | 微信登录 | code | openid/session |
| `sendVoiceReply` | 语音回复生成 | 用户语音文本 | 回复文本+语音URL |

### 4.5 核心API接口

```javascript
// 统一请求封装
const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: options.name || 'http',
      data: {
        url: options.url,
        method: options.method || 'GET',
        data: options.data || {}
      },
      success: resolve,
      fail: reject
    });
  });
};

// 姿态检测
const detectPose = async (videoPath) => {
  return request({
    name: 'detectPose',
    data: { videoPath }
  });
};

// 获取膝关节评分
const getKneeScore = async (userId) => {
  return request({
    name: 'getKneeScore',
    data: { userId }
  });
};

// 生成训练计划
const generatePlan = async (userProfile) => {
  return request({
    name: 'generatePlan',
    data: { userProfile }
  });
};
```

---

## 5. 核心功能实现

### 5.1 AI动作练习页 (practice)

**页面流程**：
1. 情境动画 → 2. 视频学习 → 3. 企鹅确认 → 4. AI练习 → 5. 通关反馈

**技术要点**：
```javascript
// 摄像头初始化
const initCamera = () => {
  const ctx = wx.createCameraContext();
  const listener = ctx.onCameraFrame(frame => {
    // 实时帧处理
    analyzeFrame(frame);
  });
  listener.start();
};

// AI判定逻辑
const analyzeFrame = (frame) => {
  // 1. 姿态检测(调用云函数或端侧模型)
  // 2. 计算关节角度
  // 3. 与标准比对
  // 4. 反馈结果
  if (angle >= standardAngle - threshold) {
    // 标准：计数+1，播放音效
    playSound('correct');
  } else {
    // 不标准：语音纠正
    speakVoice('膝盖再弯一点');
  }
};

// 语音合成
const speakVoice = (text) => {
  const audio = wx.createInnerAudioContext();
  audio.src = `https://xxx/tts?text=${encodeURIComponent(text)}`;
  audio.play();
};
```

### 5.2 语音交互

**引导页多轮对话**：
```
阶段1: IDLE → 等待称呼
阶段2: WAIT_NAME → 等待姓名
阶段3: WAIT_GENDER → 等待性别
阶段4: WAIT_YEAR → 等待出生年份
阶段5: COMPLETE → 完成注册
```

**语音按钮交互**：
```javascript
// 按住说话，松开停止
<view class="voice-btn" 
      bindtouchstart="onVoiceStart"
      bindtouchend="onVoiceEnd">
  <image src="mic.png" />
</view>

// 三态视觉
// - 默认：麦克风图标
// - 录音中：脉冲动画
// - 识别中：加载圈
```

### 5.3 家园游戏化

**家园场景元素**：
- 雪地空地(初始) → 冰屋(解锁) → 暖炉 → 鱼塘
- 能量星货币系统
- 健康日历印章(完美=太阳，良好=云朵)

---

## 6. 适老化专项

### 6.1 无障碍设计

| 特性 | 实现方式 |
|-----|---------|
| 大字体 | 正文字号 ≥ 20pt，标题 ≥ 24pt |
| 高对比度 | 避免蓝紫色，纯黑文字 |
| 大热区 | 按钮四周扩展15px |
| 语音交互 | 默认大音量，语速慢20% |
| 简化流程 | 核心操作 ≤ 3步 |
| 二次确认 | 关键操作防误触 |

### 6.2 方言支持（规划）

- [ ] 普通话（已完成）
- [ ] 粤语
- [ ] 四川话
- [ ] 吴语

### 6.3 极端情况处理

| 情况 | 处理方式 |
|-----|---------|
| 光线不足 | 小企鹅开手电筒动画 + 语音提示开灯 |
| 人物丢失 | 小企鹅做"寻找"表情 + 语音提示 |
| 连续疲劳(>20分钟) | 强制休息页 + 舒缓音乐 |
| 网络不稳定 | 本地缓存 + 离线模式基础游戏逻辑 |

---

## 7. 安全与隐私

### 7.1 隐私声明

启动页显著展示：
> "您的动作仅在手机本地分析，视频画面不会上传云端"

### 7.2 数据处理原则

- **本地化**：摄像头视频流仅在本地处理
- **脱敏上传**：仅上传关节坐标数据，不上传图像/视频
- **权限管理**：首次明确告知摄像头用途
- **拒绝方案**：拒绝摄像头时提供"仅观看视频"模式

---

## 8. 开发里程碑

| 阶段 | 时间 | 目标 |
|-----|------|------|
| MVP | 第1-4月 | 核心流程跑通，注册+测评+6关训练 |
| 体验版 | 第5-8月 | 游戏化完善，语音交互，基础科普 |
| 正式版 | 第9-12月 | 家人绑定，训练报告，PK模式 |
| 扩展版 | 第13-18月 | 踝关节/肩关节扩展，线下服务网络 |

---

## 9. 附录

### 9.1 竞品对比

| 产品 | 优点 | 缺点 |
|-----|------|------|
| KneeProgress | 即时语音反馈、动作识别精准 | 动作少、需购买护膝 |
| Curovate | 专业PT设计、全周期计划 | 付费为主 |
| 蛋壳健康 | 内容丰富、社区氛围 | 膝关节专项深度不足 |
| **小鹅(我们)** | **AI实时纠错+游戏化+适老化** | **需验证AI准确性** |

### 9.2 参考文献

详见项目书附录，包含25+篇膝关节康复相关医学文献和科普视频链接。

---

*最后更新：2026-05-12*
*版本：v1.0*
*维护者：小鹅开发团队*
