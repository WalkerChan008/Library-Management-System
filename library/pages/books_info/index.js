// pages/books_info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFold: true,       // 简介展开按钮
    list: [
      {
        id: 'form',
        name: '花江图书馆一楼B库',
        open: false,
        pages: ['button', 'list', 'input', 'slider', 'uploader']
      },
      {
        id: 'widget',
        name: '基础组件',
        open: false,
        pages: ['article', 'badge', 'flex', 'footer', 'gallery', 'grid', 'icons', 'loadmore', 'panel', 'preview', 'progress']
      },
      {
        id: 'feedback',
        name: '操作反馈',
        open: false,
        pages: ['actionsheet', 'dialog', 'msg', 'picker', 'toast']
      },
      {
        id: 'nav',
        name: '导航相关',
        open: false,
        pages: ['navbar', 'tabbar']
      },
      {
        id: 'search',
        name: '搜索相关',
        open: false,
        pages: ['searchbar']
      }
    ]
  },

  /**
   * 绑定展开折叠点击事件
   * 文本过长折叠
   */
  iconTap: function () {
    this.setData({isFold: !this.data.isFold});
  },

  /**
   * 折叠列表事件
   */
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})