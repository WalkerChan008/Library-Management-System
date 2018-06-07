// pages/myfavor/myfavor.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    wxUserInfo: {},
    b_list: [],
    list_count: 0
  },

  cancelFavor: function (e) {
    var isbn = e.currentTarget.id,
        wxUserInfo = {},
        b_list = [],
        favorBook = []
    
    wx.showModal({
      title: '取消确认',
      content: '您确认取消收藏此书吗？',
      cancelText: '我在想想',
      confirmText: '确认',
      success: res => {
        if(res.confirm) {
          wx.showToast({
            title: '取消成功',
            mask: true,
            duration: 1000
          })
          wx.request({
            method: 'POST',
            url: this.url + '/changeFavor',
            data: {
              openid: this.data.wxUserInfo.openid,
              isbn: isbn,
              favor_flag: false  // 修改为取消收藏
            },
            success: res => {
              console.log(res.data)
              wxUserInfo = res.data
              favorBook = wxUserInfo.favor_book || []

              wx.setStorage({
                key: 'wxUserInfo',
                data: wxUserInfo
              })

              wx.request({
                method: 'POST',
                url: this.url + '/getFavorBook',
                data: favorBook,
                success: res => {
                  // res.data -> {Array} 书籍信息
                  b_list = res.data
                  console.log(res.data)

                  this.setData({
                    wxUserInfo: wxUserInfo,
                    b_list: b_list,
                    list_count: b_list.length
                  })
                }
              })
            }
          })
        }
      }
    })
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
    var wxUserInfo = {},
      b_list = [],
      favorBook = []

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })

    wx.getStorage({
      key: 'wxUserInfo',
      success: res => {
        wxUserInfo = res.data
        favorBook = wxUserInfo.favor_book || []
        // favorBook = favorBook ? favorBook : []

        console.log(res)

        if (favorBook.length > 0) {

          wx.request({
            method: 'POST',
            url: this.url + '/getFavorBook',
            data: favorBook,
            success: res => {
              // res.data -> {Array}
              b_list = res.data
              console.log(res.data)

              this.setData({
                wxUserInfo: wxUserInfo,
                b_list: b_list,
                list_count: b_list.length
              })

            }
          })

        } else {

          this.setData({
            wxUserInfo: wxUserInfo,
            b_list: [],
            list_count: 0
          })

          setTimeout(() => {
            wx.showToast({
              icon: 'none',
              title: '无结果',
              duration: 1000
            })
          }, 500)

        }
      },
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