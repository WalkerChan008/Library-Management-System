// pages/loan_history/loan_history.js

Array.prototype.remove = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    list_count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var b_list = [],
      loan_history = []
    wx.getStorage({  // 从缓存中读取用户信息
      key: 'wxUserInfo',
      success: res => {
        console.log(res.data.loan_history)
        loan_history = res.data.loan_history
        loan_history = loan_history ? loan_history : []

        // 未完成借书归还评价流程 借阅历史不展示
        loan_history.forEach( (item, index) => {
          item.is_rated ? '' : loan_history.remove(index)
        })

        this.setData({
          wxUserInfo: res.data,
          list_count: loan_history.length
        })

        wx.request({
          method: 'POST',
          url: this.url + '/getLoanHistoryInfo',
          data: { loanHistory: loan_history },  // 用户已还未评价书籍的数组
          success: res => {
            // res.data {Array} - 后台返回的已还未评价的书籍信息
            b_list = res.data
            b_list.forEach((item, index) => {  // 遍历图书信息数组
              item.loan_history = loan_history[index]
            })
            console.log(b_list)
            this.setData({
              b_list: b_list
            })
          }
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