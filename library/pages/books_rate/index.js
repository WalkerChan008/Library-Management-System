// pages/books_rate/index.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    b_info: {},

    rate_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'b_info',
      success: res => {
        // res.data - 图书信息
        var b_info = res.data,
            isbn = b_info.isbn13

        this.setData({
          b_info: b_info
        })

        wx.request({
          url: this.url + '/showAllRate',
          data: {
            isbn: isbn,
            count: 10
          },
          success: res => {
            this.setData({
              rate_list: res.data
            })
          }
        })
      }
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
    wx.removeStorage({
      key: 'b_info'
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