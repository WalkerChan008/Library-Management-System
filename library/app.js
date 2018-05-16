App({

  url: require('./config.js'),

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var wxUserInfo = {},
        loanBook = [],
        b_list = [],
        loanArr = []

    var nowDate = new Date(),
        returnDate = '',
        showDotFlag = false

    wx.getStorage({
      key: 'wxUserInfo',
      success: (res) => {
        wxUserInfo = res.data
        loanBook = wxUserInfo.loan_book || []
        if (loanBook.length > 0) {
          wx.request({
            method: 'POST',
            url: this.url + '/getLoanBookInfo',
            data: { codeArr: loanBook },  // 用户已借未还书籍的数组
            success: res => {
              // res.data {Array} - 后台返回的已借未还的书籍信息
              b_list = res.data
              b_list.forEach((item, index) => {  // 遍历图书信息数组
                item.collection_info.forEach((item1, index1) => {  // 遍历每个图书数组中的馆藏信息
                  if (item1.code_39 == loanBook[index]) {// 匹配所借书籍的条码号



                    // if(showDotFlag) return  // 数组中只要有一个满足<=3天，其他的都不进行比较
                    console.log(item1.return_date)
                    returnDate = new Date(Date.parse(item1.return_date.replace(/-/g, '/')));  // 字符串转换为Date对象
                    console.log(Math.ceil((returnDate - nowDate) / (1000 * 60 * 60 * 24)))
                    // Math.ceil((returnDate - nowDate) / (1000 * 60 * 60 * 24))  今天日期和还书日期之差，单位：天

                    // <=3天，“我的”的tabbar展示小红点
                    if (Math.ceil((returnDate - nowDate) / (1000 * 60 * 60 * 24)) <= 3) {
                      wx.showTabBarRedDot({
                        index: 2
                      })
                      // showDotFlag = true  // 已展示小红点
                      loanArr.push(item1)
                    }
                    

                    
                  }
                })
              })

              console.log(loanArr)

              wx.setStorage({
                key: 'loanMsg',
                data: loanArr,
              })

            }
          })

        }
      },
    })

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
