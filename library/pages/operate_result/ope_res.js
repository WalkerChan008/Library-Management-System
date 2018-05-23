// pages/operate_result/ope_res.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg_title: '',
    msg_cont: ''
  },

  returnToRate: function () {
    wx.navigateBack()
  },

  returnToIndex: function () {
    wx.reLaunch({
      url: '../search/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var msg_type = options.type,
        msg_translate = '',
        msg_cont = ''

    switch (msg_type) {
      case 'rate':
        msg_translate = '评价'
        msg_cont = '您对该图书的评价已成功提交！'
        break
    }

    this.setData({
      msg_title: msg_translate,
      msg_cont: msg_cont
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