// pages/massage/massage.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    loan_msg: []
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
    var loan_msg = [],
        loan_code = []

    wx.getStorage({
      key: 'loanMsg',
      success: res => {
        loan_msg = res.data || []
        loan_msg.forEach( (item, index) => {
          loan_code.push(item.code_39)
        })

        console.log(loan_code)

        if(loan_msg.length > 0) {
          wx.request({
            method: 'POST',
            url: this.url + '/getLoanBookInfo',
            data: {codeArr: loan_code},
            success: res => {
              console.log(res.data)
              this.setData({
                loan_msg: res.data
              })
            }
          })
        }

      wx.setStorage({
        key: 'loanMsg',
        data: []
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