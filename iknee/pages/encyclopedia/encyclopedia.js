// 小鹅(iKnee) - 百科页逻辑

Page({
  data: {
    currentCategory: 'all',
    categories: [
      { id: 'all', name: '全部' },
      { id: 'prevention', name: '预防知识' },
      { id: 'exercise', name: '运动康复' },
      { id: 'nutrition', name: '营养饮食' },
      { id: 'daily', name: '日常护理' }
    ],
    videos: [],
    articles: []
  },

  onLoad() {
    this.loadContent();
  },

  // 加载内容
  loadContent() {
    // 模拟数据
    this.setData({
      videos: [
        {
          id: 'v1',
          title: '如何预防膝关节炎',
          coverUrl: '/assets/images/video/cover1.jpg',
          duration: '3:25',
          views: '10.2万'
        },
        {
          id: 'v2',
          title: '靠墙静蹲的正确姿势',
          coverUrl: '/assets/images/video/cover2.jpg',
          duration: '4:15',
          views: '8.6万'
        },
        {
          id: 'v3',
          title: '老年人运动注意事项',
          coverUrl: '/assets/images/video/cover3.jpg',
          duration: '5:30',
          views: '5.3万'
        }
      ],
      articles: [
        {
          id: 'a1',
          title: '膝关节保养的五个好习惯',
          coverUrl: '/assets/images/article/cover1.jpg',
          tag: '预防知识',
          date: '2026-05-10'
        },
        {
          id: 'a2',
          title: '老年人如何科学补钙',
          coverUrl: '/assets/images/article/cover2.jpg',
          tag: '营养饮食',
          date: '2026-05-08'
        }
      ]
    });
  },

  // 搜索
  onSearch(e) {
    const keyword = e.detail.value;
    console.log('搜索:', keyword);
    wx.showToast({ title: '搜索功能开发中', icon: 'none' });
  },

  // 分类切换
  onCategoryChange(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentCategory: id });
    this.loadContent();
  },

  // 视频点击
  onVideoTap(e) {
    const video = e.currentTarget.dataset.video;
    wx.navigateTo({
      url: `/pages/video/video?id=${video.id}`
    });
  },

  // 文章点击
  onArticleTap(e) {
    const article = e.currentTarget.dataset.article;
    wx.showToast({ title: '文章详情开发中', icon: 'none' });
  },

  // 更多视频
  onMoreVideo() {
    wx.showToast({ title: '视频列表开发中', icon: 'none' });
  },

  // 更多文章
  onMoreArticle() {
    wx.showToast({ title: '文章列表开发中', icon: 'none' });
  }
});
