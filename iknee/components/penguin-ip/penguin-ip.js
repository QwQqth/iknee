// 小鹅(iKnee) - 小企鹅IP组件

Component({
  properties: {
    // 状态
    state: {
      type: String,
      value: 'default',
      observer: '_stateChange'
    },
    // 表情
    emotion: {
      type: String,
      value: 'happy'
    },
    // 消息
    message: {
      type: String,
      value: ''
    },
    // 是否显示气泡
    showBubble: {
      type: Boolean,
      value: false
    },
    // 动画
    actionClass: {
      type: String,
      value: ''
    },
    // 尺寸
    size: {
      type: String,
      value: 'medium'  // small | medium | large
    }
  },

  data: {
    currentImage: '/assets/images/penguin/penguin-default.png'
  },

  lifetimes: {
    attached() {
      this.updateImage();
    }
  },

  methods: {
    // 状态变化
    _stateChange(newState) {
      this.updateImage();
    },

    // 更新图片
    updateImage() {
      const stateImages = {
        default: '/assets/images/penguin/penguin-default.png',
        happy: '/assets/images/penguin/penguin-happy.png',
        worried: '/assets/images/penguin/penguin-worried.png',
        excited: '/assets/images/penguin/penguin-excited.png',
        celebrate: '/assets/images/penguin/penguin-celebrate.png',
        thinking: '/assets/images/penguin/penguin-thinking.png',
        searching: '/assets/images/penguin/penguin-searching.png',
        tired: '/assets/images/penguin/penguin-tired.png'
      };

      const image = stateImages[this.properties.state] || stateImages.default;
      this.setData({ currentImage: image });
    },

    // 点击事件
    onTap() {
      this.triggerEvent('tap');
    },

    // 显示消息
    showMessage(message) {
      this.setData({ message, showBubble: true });

      setTimeout(() => {
        this.setData({ showBubble: false });
      }, 3000);
    },

    // 播放动画
    playAction(actionClass) {
      this.setData({ actionClass });

      setTimeout(() => {
        this.setData({ actionClass: '' });
      }, 2000);
    }
  }
});
