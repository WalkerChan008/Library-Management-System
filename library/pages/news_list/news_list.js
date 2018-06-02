// pages/news_list/news_list.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["馆内新闻", "公告消息", "资源动态"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,


    news: [],
    notice: [],
    resource: []
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });

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

    var allNews = {}

    wx.request({
      url: this.url + '/getNews',
      success: res => {
        allNews = res.data

        console.log(allNews)

        this.setData({
          news: allNews.news,
          notice: allNews.notice,
          resource: allNews.resource
        })

        wx.setStorage({
          key: 'news',
          data: allNews
        })


      }
    })

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
    wx.removeStorage({
      key: 'news'
    })
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