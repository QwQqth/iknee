// 小鹅(iKnee) - 关卡配置
// 六大训练关卡定义

module.exports = {
  // 关卡列表
  levels: [
    {
      id: 'level_01',
      name: '冰山凿洞',
      subtitle: '帮小企鹅打开回家的路',
      actionType: 'squat',           // 动作类型
      actionName: '靠墙静蹲',
      duration: 15,                  // 目标时间(秒)
      standardAngle: 90,            // 标准屈膝角度
      threshold: 15,                // 容差角度
      description: '靠墙站立，慢慢下蹲，保持膝盖不超脚尖',
      tips: ['背部紧贴墙壁', '膝盖弯曲90度', '膝盖不超过脚尖'],
      // 游戏映射逻辑
      gameMapping: {
        progressType: 'time',        // 进度类型: time/timeCount/count
        progressRate: 1,            // 每秒进度增量
        visual: 'ice_crack',         // 视觉效果: ice_crack/bridge/plank等
      },
      // 奖励配置
      rewards: {
        stars: 3,                    // 通关奖励星星
        energy: 50,                 // 奖励能量
        exp: 100                    // 经验值
      },
      // 解锁条件
      unlockLevel: 0,               // 前置关卡，0为首关
      unlockScore: 0,               // 需要的最低评分
    },
    {
      id: 'level_02',
      name: '跨越浮木',
      subtitle: '帮助小企鹅过河',
      actionType: 'leg_raise',
      actionName: '坐姿抬腿',
      count: 10,                     // 目标次数
      standardAngle: 45,            // 标准抬起角度
      description: '坐在椅子上，慢慢抬起一条腿，保持伸直',
      tips: ['腿要伸直', '慢慢抬起', '慢慢放下'],
      gameMapping: {
        progressType: 'count',
        progressRate: 1,
        visual: 'plank_bridge',
      },
      rewards: {
        stars: 3,
        energy: 50,
        exp: 100
      },
      unlockLevel: 1,
      unlockScore: 60,
    },
    {
      id: 'level_03',
      name: '捕捉极光鱼',
      subtitle: '收集极光能量',
      actionType: 'forward_bend',
      actionName: '坐姿体前屈',
      count: 5,
      standardAngle: 60,            // 前屈角度
      description: '坐在椅子上，上身前倾，尽量用手触碰脚尖',
      tips: ['背部挺直', '手尽量往前伸', '不要憋气'],
      gameMapping: {
        progressType: 'count',
        progressRate: 1,
        visual: 'aurora_net',
      },
      rewards: {
        stars: 3,
        energy: 50,
        exp: 100
      },
      unlockLevel: 2,
      unlockScore: 60,
    },
    {
      id: 'level_04',
      name: '建造彩虹桥',
      subtitle: '搭建回家的桥梁',
      actionType: 'hip_bridge',
      actionName: '臀桥',
      duration: 3,                   // 保持秒数
      standardHeight: 30,           // 标准抬起高度(cm)
      description: '仰卧，屈膝，臀部抬起，使身体成一直线',
      tips: ['臀部用力', '保持3秒', '不要拱腰'],
      gameMapping: {
        progressType: 'timeCount',
        progressRate: 1,
        visual: 'rainbow_bridge',
      },
      rewards: {
        stars: 3,
        energy: 50,
        exp: 100
      },
      unlockLevel: 3,
      unlockScore: 65,
    },
    {
      id: 'level_05',
      name: '抵御寒风',
      subtitle: '在暴风雪中站稳脚跟',
      actionType: 'single_leg_stand',
      actionName: '单腿站立',
      duration: 10,                  // 保持秒数
      wobbleThreshold: 15,           // 晃动阈值(度)
      description: '单腿站立，保持平衡，尽量不要晃动',
      tips: ['站稳扶好', '核心收紧', '闭眼更稳'],
      gameMapping: {
        progressType: 'time',
        progressRate: 1,
        visual: 'wind_storm',
      },
      rewards: {
        stars: 3,
        energy: 50,
        exp: 100
      },
      unlockLevel: 4,
      unlockScore: 70,
    },
    {
      id: 'level_06',
      name: '划动破冰船',
      subtitle: '带领小企鹅冲出冰层',
      actionType: 'ankle_movement',
      actionName: '勾绷脚',
      count: 20,                     // 目标次数
      description: '坐姿，脚尖向上勾起，然后向下绷直',
      tips: ['动作要慢', '最大幅度', '交替进行'],
      gameMapping: {
        progressType: 'count',
        progressRate: 1,
        visual: 'icebreaker',
      },
      rewards: {
        stars: 3,
        energy: 50,
        exp: 100
      },
      unlockLevel: 5,
      unlockScore: 75,
    }
  ],

  // 获取关卡通过条件
  getLevelPassCondition(levelId) {
    const level = this.levels.find(l => l.id === levelId);
    if (!level) return null;

    return {
      duration: level.duration || 0,
      count: level.count || 0,
      standardAngle: level.standardAngle || 0,
      threshold: level.threshold || 10
    };
  },

  // 获取前置关卡
  getPrevLevel(levelId) {
    const index = this.levels.findIndex(l => l.id === levelId);
    if (index > 0) {
      return this.levels[index - 1];
    }
    return null;
  },

  // 获取下一关卡
  getNextLevel(levelId) {
    const index = this.levels.findIndex(l => l.id === levelId);
    if (index < this.levels.length - 1) {
      return this.levels[index + 1];
    }
    return null;
  },

  // 计算星星数量
  calculateStars(levelId, score, duration) {
    const level = this.levels.find(l => l.id === levelId);
    if (!level) return 0;

    // 简单计算：100分=3星，80-99=2星，60-79=1星
    if (score >= 100) return 3;
    if (score >= 80) return 2;
    if (score >= 60) return 1;
    return 0;
  },

  // 判断是否解锁
  isUnlocked(levelId, userScore, prevBestScore) {
    const level = this.levels.find(l => l.id === levelId);
    if (!level) return false;

    // 首关直接解锁
    if (level.unlockLevel === 0) return true;

    // 需要前置关卡达标
    return prevBestScore >= level.unlockScore;
  }
};
