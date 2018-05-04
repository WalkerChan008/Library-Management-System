App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

    /*
    wx.checkSession({
      success: errMsg => {
        console.log(errMsg)
      },
      fail: errMsg => {
        wx.login({
          success: res => {
            wx.request({
              method: 'get',
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data: {
                appid: 'wx8365f68bbbbe0a2f',
                secret: '957b3819f60716e3af1f17396f753d0c',
                js_code: res.code,
                grant_type: 'authorization_code'
              },
              success: res => {
                console.log(res);
                wx.setStorage({
                  key: 'uid',
                  data: res.data,
                })
              }
            })
          }
        })
      }
    })
    */
    

    /*
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo
              console.log(res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else {
          wx.authorize({
            scope: 'scope.userInfo',
            success: errMsg => {
              console.log(errMsg);
              wx.getUserInfo({
                success: res => {
                  console.log(res);
                }
              })
            },
            fail: () => {
              console.log(111)
            }
          })
        }
      }
    })
    */
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
