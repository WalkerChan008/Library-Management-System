// pages/rate/rate.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/no-star.png',
    selectedSrc: '../../images/full-star.png',
    halfSrc: '../../images/half-star.png',
    key: 0,//评分

    rateValue: '',
    valueLen: 0,

    b_info: {}, //图书信息
    openid: '',
  },

  //点击右边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    console.log("得" + key * 2 + "分")
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    console.log("得" + key * 2 + "分")
    this.setData({
      key: key
    })
  },

  bindinput: function (e) {
    var value = e.detail.value,
        valueLen = value.length

    this.setData({
      rateValue: value,
      valueLen: valueLen
    })
  },

  submitRate: function () {
    var rateScore = this.data.key * 2,
        rateValue = this.data.rateValue,
        openid = this.data.openid,
        code_39 = this.data.b_info.return_info.code_39,
        isbn13 = this.data.b_info.isbn13
      
    wx.showModal({
      title: '评价确认',
      content: '您确认提交该评价吗？',
      success: res => {
        if(res.confirm) {

          wx.request({
            url: this.url + '/rateBook',
            data: {
              openid: openid,
              code_39: code_39,
              isbn13: isbn13,
              rateScore: rateScore,
              rateValue: rateValue
            },
            success: res => {
              wx.setStorage({
                key: 'wxUserInfo',
                data: res.data[1].value,
              })

              wx.removeStorage({
                key: 'rateBookInfo'
              })
            }

          })

          wx.redirectTo({
            url: '../operate_result/ope_res?type=rate',
          })

        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options: openid
    console.log(options)

    wx.getStorage({
      key: 'rateBookInfo',
      success: res => {

        console.log(res)

        this.setData({
          b_info: res.data,
          openid: options.openid
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