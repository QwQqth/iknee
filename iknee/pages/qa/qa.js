// 小鹅(iKnee) - 问答页逻辑

Page({
  data: {
    suggestions: [
      { id: 1, text: '膝关节疼痛怎么办', question: '膝关节疼痛怎么办' },
      { id: 2, text: '做什么运动好', question: '做什么运动对膝盖好' },
      { id: 3, text: '如何补钙', question: '老年人如何补钙' },
      { id: 4, text: '关节响正常吗', question: '膝盖咔咔响正常吗' }
    ]
  },

  onSuggestionTap(e) {
    const question = e.currentTarget.dataset.question;
    wx.showToast({ title: 'AI问答功能开发中', icon: 'none' });
  },

  onSubmitQuestion() {
    wx.showToast({ title: 'AI问答功能开发中', icon: 'none' });
  }
});
