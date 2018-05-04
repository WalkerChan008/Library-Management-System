// pages/lib_auth/lib_auth.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    wxUserInfo: {},
    disabled: '',
    account: '',
    password: '',
    openid: ''
  },

  // 获取输入账号 
  accountInput: function (e) {
    this.setData({
      account: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 提交
  submit: function () {
    if (this.data.account.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 这里修改成跳转的页面
      var wxUserInfo = {}

      wx.request({  // 向后台发送读者证号密码
        url: this.url + '/getAuth',
        data: {
          openid: this.data.wxUserInfo.openid,
          account: this.data.account,
          password: this.data.password
        },
        success: res => {
          wxUserInfo = res.data

          console.log(res)
          // 后端是否传来的数据
          if(res.data) {    // 有 验证成功

            // 将取回的用户信息放入缓存
            wx.setStorage({
              key: 'wxUserInfo',
              data: wxUserInfo,
              success: res => {
                console.log('wxUserInfo insert to storage and getAuth success!')
              }
            })

            // 显示“认证成功”提示框并修改disabled为'disabled'
            wx.showToast({
              title: '认证成功',
              icon: 'success',
              duration: 2000,
              success: res => {
                setTimeout(() => {
                  this.setData({
                    disabled: 'disabled',
                    wxUserInfo: wxUserInfo
                  })
                }, 2000)
              }
            })

          } else {    // 后台传的值为空 提示“认证失败”
            // wx.showToast({    
            //   title: '认证失败',
            //   icon: 'none',
            //   duration: 2000
            // })
            wx.showModal({
              title: '认证失败',
              content: '无效的账号密码或其他微信号已绑定该读者证号。',
              showCancel: false
            })
          }
        }
      })

    }
  },

  // 取消认证
  cancel: function () {
    wx.showModal({
      title: '认证取消',
      content: '确认取消认证？取消后无法进行某些操作',
      cancelText: '返回',
      confirmText: '确认',
      success: res => {

        if(res.confirm) { //点击确定
          wx.request({
            url: this.url + '/cancelAuth',
            data: {
              openid: this.data.wxUserInfo.openid
            },
            success: res => {
              var wxUserInfo = res.data
              wx.setStorage({
                key: 'wxUserInfo',
                data: wxUserInfo,
                success: res => {
                  console.log('wxUserInfo insert to storage and cancelAuth success!')
                }
              })
              wx.showToast({
                title: '认证已取消',
                icon: 'success',
                duration: 2000,
                success: res => {
                  setTimeout(() => {
                    this.setData({
                      disabled: '',
                      wxUserInfo: wxUserInfo
                    })
                  }, 2000)
                }
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'wxUserInfo',
      success: (res) => {
        var disabled = res.data.lib_auth ? 'disabled' : ''
        console.log(disabled)
        this.setData({
          wxUserInfo: res.data,
          disabled: disabled
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