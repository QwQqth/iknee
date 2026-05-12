// components/level-card/level-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 关卡ID
    levelId: {
      type: String,
      value: ''
    },
    // 关卡编号（显示在图标上）
    levelNumber: {
      type: Number,
      value: 1
    },
    // 关卡名称
    name: {
      type: String,
      value: '关卡'
    },
    // 关卡描述
    description: {
      type: String,
      value: ''
    },
    // 是否锁定
    locked: {
      type: Boolean,
      value: false
    },
    // 是否已完成
    completed: {
      type: Boolean,
      value: false
    },
    // 获得星星数（0-3）
    stars: {
      type: Number,
      value: 0
    },
    // 最佳成绩
    bestScore: {
      type: Number,
      value: 0
    },
    // 最低解锁分数（用于前置关卡解锁判断）
    requiredScore: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击卡片
     */
    onTap() {
      const { locked, levelId, name } = this.properties;
      
      if (locked) {
        wx.showToast({
          title: '请先完成前置关卡',
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 触发自定义事件，通知父组件
      this.triggerEvent('tap', {
        levelId,
        name
      });
    },

    /**
     * 更新关卡数据（从外部更新）
     */
    updateData(data) {
      this.setData(data);
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      // 组件实例进入页面节点树时执行
    },
    detached() {
      // 组件实例被从页面节点树移除时执行
    }
  }
});