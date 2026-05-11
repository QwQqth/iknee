// custom-tab-bar/index.js
Component({
  data: {
    selected: 0
  },

  methods: {
    onSwitch(e) {
      const index = Number(e.currentTarget.dataset.index)
      const urls = [
        '/pages/index/index',
        '/pages/profile/profile'
      ]
      wx.switchTab({ url: urls[index] })
    }
  }
})
