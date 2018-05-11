// pages/mine/mine.js

Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    wxUserInfo: {},
    wxAuth: false,
    menuitems: [
      { text: '读者认证', url: '../lib_auth/lib_auth', icon: '../../images/usermenu/stu_auth.png', tips: '' },
      { text: '个人收藏', url: '../myfavor/myfavor', icon: '../../images/usermenu/myfavor.png', tips: '' },
      { text: '借阅历史', url: '../loan_history/loan_history', icon: '../../images/usermenu/loan_book.png', tips: '' },
      { text: '待评价', url: '../return_book/return_book', icon: '../../images/usermenu/evaluate.png', tips: '' },
      { text: '待归还', url: '../loan_book/loan_book', icon: '../../images/usermenu/return.png', tips: '' }
    ]
  },

  /**
   * 微信登录
   */
  getUserInfo: function (e) {
    var userInfo = {}    // 用户信息
    if(e.detail.iv) {     // 授权后才将数据放入缓存
      wx.login({
        success: res => {
          wx.request({
            method: 'GET',
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              appid: 'wx8365f68bbbbe0a2f',
              secret: '957b3819f60716e3af1f17396f753d0c',
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success: res => {
              // 数据库中无此条数据时插入
              userInfo = Object.assign(res.data, e.detail.userInfo, { lib_auth: false })
              wx.request({
                url: this.url + '/saveUserInfo',
                method: 'POST',
                data: userInfo,
                success: res => {
                  userInfo = res.data
                  console.log(userInfo)
                  wx.setStorage({
                    key: 'wxUserInfo',
                    data: userInfo,
                  })

                  this.setData({
                    wxAuth: true,
                    wxUserInfo: userInfo
                  })

                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                    duration: 1500,
                    mask: true
                  })
                }
              })
            }
          })
        }
      })

    }else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
      })
    }
  },

  setting: function () {
    wx.openSetting()
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
    wx.getSetting({
      success: res => {
        
        if (res.authSetting['scope.userInfo']) {

          wx.getStorage({
            key: 'wxUserInfo',
            success: res => {
              console.log(res)
              if (res) {
                wx.request({
                  url: this.url + '/getUserInfo',
                  data: { openid: res.data.openid },
                  success: res => {
                    console.log(res);
                    this.setData({
                      wxUserInfo: res.data,
                      wxAuth: res.data.openid ? true : false
                    })

                    console.log(res.data)

                    wx.setStorage({
                      key: 'wxUserInfo',
                      data: res.data,
                    })

                    setTimeout( () => {
                      wx.hideLoading()
                    }, 500)

                  }
                })
              }

            },
          })

        } else {
          this.setData({
            wxUserInfo: {},
            wxAuth: false
          })
        }
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