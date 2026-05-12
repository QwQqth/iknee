// 小鹅(iKnee) - 视频详情页逻辑

Page({
  data: {
    video: {
      id: '',
      title: '',
      poster: '',
      url: '',
      views: '10.2万',
      duration: '3:25'
    },
    recommends: []
  },

  onLoad(options) {
    const { id } = options;
    this.loadVideo(id);
  },

  loadVideo(id) {
    // 模拟数据
    this.setData({
      video: {
        id: id || 'v1',
        title: '如何预防膝关节炎',
        poster: '/assets/images/video/cover1.jpg',
        url: 'https://example.com/video.mp4',
        views: '10.2万',
        duration: '3:25'
      },
      recommends: [
        { id: 'v2', title: '靠墙静蹲的正确姿势', poster: '/assets/images/video/cover2.jpg', views: '8.6万' },
        { id: 'v3', title: '老年人运动注意事项', poster: '/assets/images/video/cover3.jpg', views: '5.3万' }
      ]
    });
  },

  onRecommendTap(e) {
    const id = e.currentTarget.dataset.id;
    this.loadVideo(id);
  }
});
