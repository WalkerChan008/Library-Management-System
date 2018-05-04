// pages/mine/mine.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    wxUserInfo: {},
    wxAuth: false,
    libAuth: false,
    menuitems: [
      { text: '读者认证', url: '../lib_auth/lib_auth', icon: '../../images/usermenu/stu_auth.png', tips: '' },
      { text: '个人收藏', url: '../myfavor/myfavor', icon: '../../images/usermenu/myfavor.png', tips: '' },
      { text: '借阅历史', url: '../loan_book/loan_book?status=F', icon: '../../images/usermenu/loan_book.png', tips: '' },
      { text: '待评价', url: '../borrowbook/loan_book?status=N', icon: '../../images/usermenu/evaluate.png', tips: '' },
      { text: '待归还', url: '../borrowbook/loan_book?status=Y', icon: '../../images/usermenu/return.png', tips: '' },
      { text: '设置', url: '../setting/setting', icon: '../../images/usermenu/setting.png', tips: '' },
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
              userInfo = Object.assign(res.data, e.detail.userInfo, { lib_auth: false });
              console.log(userInfo);
              wx.request({
                url: this.url + '/saveUserInfo',
                method: 'POST',
                data: userInfo,
                success: res => {
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                    duration: 2000,
                    mask: true
                  })
                }
              })
              wx.setStorage({
                key: 'wxUserInfo',
                data: userInfo,
              })
              this.setData({ wxAuth: true })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'wxUserInfo',
      success: res => {
        console.log(res)
        this.setData({
          wxUserInfo: res.data,
          wxAuth: res.data.openid ? true : false,
          libAuth: res.data.lib_auth ? true : false
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
    wx.getStorage({
      key: 'wxUserInfo',
      success: res => {
        console.log(res)
        this.setData({
          wxUserInfo: res.data,
          wxAuth: res.data.openid ? true : false,
          libAuth: res.data.lib_auth ? true : false
        })
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