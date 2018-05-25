// pages/news_info/news_info.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    newsInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.type  options.id
    var allNews = {},
        newsArr = [],
        newsInfo = {}

    wx.getStorage({
      key: 'news',
      success: (res) => {
        allNews = res.data
        switch(options.type) {
          case 'news':
            newsArr = allNews.news
            break
          case 'notice':
            newArr = allNews.notice
            break
          case 'resource':
            newArr = allNews.resource
            break
        }

        newsArr.forEach( (item, index) => {
          item.id == options.id ? newsInfo = item : ''
        })

        this.setData({
          newsInfo: newsInfo
        })
      },
    })
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