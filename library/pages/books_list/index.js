// pages/books_list/index.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    list_count: 0,
    b_list: []
  },

  command: function () {
    wx.getStorage({
      key: 'wxUserInfo',
      success: res => {
        console.log(res.data.openid)
        if(res.data.openid) {
          wx.navigateTo({
            url: '../command/command?value=' + this.data.searchValue
          })
        }

      },
      fail: res => {
        wx.showModal({
          title: '操作失败',
          content: '小程序未通过微信授权登录。是否前往登录？',
          success: res => {
            if (res.confirm) {

              wx.reLaunch({
                url: '../mine/mine',
              })

            }
          }
        })
      }
    })

  },

  imageLoad: function () {
    setTimeout( () => {
      wx.hideLoading()
      wx.showToast({
        title: '加载成功',
        duration: 1000
      })
    }, 500)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var b_list = [];

    if(options.value) {
      wx.setNavigationBarTitle({
        title: '搜索 ' + options.value
      })

      this.setData({
        searchValue: options.value
      })
    }

    console.log(options)
    wx.request({    // 向后台发起请求，获取图书列表信息
      url: this.url + '/value_search?value=' + options.value,
      success: (data) => {
        console.log(data)
        b_list = data.data;

        this.setData({
          list_count: b_list.length,
          b_list: b_list
        })

        if(b_list.length == 0) {
          wx.hideLoading()
        }

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