// pages/books_hot/hot.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    top1: {},
    rank_list: [
      {
        img: '../../images/bg.png',
        title: 'javascript权威指南指南',
        like: 54
      },
      {
        img: '../../images/bg.png',
        title: 'javascript权威指南',
        like: 54
      }
    ]
  },

  imageLoad: function () {
    setTimeout( () => {
      wx.hideLoading()
    }, 500)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中',
      mask: true
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
    var rank_list,
      top1 = {}

    wx.request({
      url: this.url + '/book_hot',
      success: (data) => {
        rank_list = data.data;
        top1 = rank_list.shift();

        console.log(top1);
        this.setData({
          top1: top1,
          rank_list: rank_list
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