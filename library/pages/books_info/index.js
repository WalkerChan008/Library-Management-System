// pages/books_info/index.js
var codeQuery = {};

Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    wxUserInfo: {},

    isFold: true,    // 图书简介是否折叠

    b_info : {},    // 图书信息
    list: [],      // 馆藏信息列表
    favor_flag: false,  // 是否收藏此书

    rate_list: [],   // 评价列表
  },

  /**
   * 绑定展开折叠点击事件
   * 文本过长折叠
   */
  iconTap: function () {
    this.setData({isFold: !this.data.isFold})
  },

  /**
   * 折叠列表事件
   * @param e - 事件源对象
   */
  kindToggle: function (e) {
    var id = e.currentTarget.id,
        list = this.data.b_info.collection_info;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].code_39 == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },

  /**
   * 我要借书
   * @param e - 事件源对象
   */
  toLoan: function (e) {
    var code_39 = e.currentTarget.id,  // 获取图书馆图书条码号
        wxUserInfo = this.data.wxUserInfo,
        libAuth = wxUserInfo.lib_auth

    if(libAuth) {

      wx.showModal({
        title: '扫码借书',
        content: '借阅《' + this.data.b_info.title + '》需扫描图书的7位唯一识别条形码',
        confirmText: '扫描',
        success: (res) => {
          if(res.confirm) {
            
            wx.scanCode({
              onlyFromCamera: true,
              success: res => {
                console.log(res)
                if(res.result == code_39) {

                  wx.showToast({
                    title: '借阅成功',
                    mask: true,
                    duration: 1000
                  })

                  wx.request({
                    url: this.url + '/loan_book',
                    data: {
                      code: code_39,
                      openid: this.data.wxUserInfo.openid
                    },
                    success: (res) => {
                      console.log(res)
                      // res.data[0].value -> books_info
                      // res.data[1].value -> wxUserInfo
                      this.setData({  // 将更新后的图书信息存入data中
                        wxUserInfo: res.data[1].value,
                        b_info: res.data[0].value,
                        list: res.data[0].value.collection_info
                      });
                      wx.setStorage({  // 将更新后的用户信息存入缓存中
                        key: 'wxUserInfo',
                        data: res.data[1].value
                      })
                    }
                  })

                }else {
                  wx.showModal({
                    title: '借书失败',
                    content: '图书唯一识别条形码不匹配，请重试！',
                    showCancel: false
                  })
                }
              }
            })

          }

        }
      })

    } else {

      wx.showModal({
        title: '借书失败',
        content: '未进行图书馆读者认证。是否前往认证？',
        success: res => {
          if(res.confirm) {
            if (wxUserInfo.openid) {  // 判断是否已登录
              wx.navigateTo({
                url: '../lib_auth/lib_auth',
              })
            } else {
              wx.reLaunch({
                url: '../mine/mine',
              })
            }
          }
        }
      })
      
    }
  },

  /**
   * 添加书籍到我的收藏
   * @param e - 事件源对象
   */
  addToFavor: function (e) {
    var wxUserInfo = this.data.wxUserInfo

    var isbn = e.currentTarget.id,
        favor_flag = this.data.favor_flag  // 初始收藏状态

    console.log(wxUserInfo)

    favor_flag = favor_flag ? false : true  // 点击后变成的状态

    console.log(favor_flag)
    if(wxUserInfo.openid) {

      if (favor_flag) {    // 点击收藏时
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          mask: true
        })
      }else {
        wx.showToast({
          title: '已取消收藏',
          icon: 'success',
          mask: true
        })
      }

      // 更改用户对此书的收藏与否
      wx.request({
        method: 'POST',
        url: this.url + '/changeFavor',
        data: {
          openid: this.data.wxUserInfo.openid,
          isbn: isbn,
          favor_flag: favor_flag  // 需要修改成为的状态
        },
        success: res => {
          wxUserInfo = res.data

          this.setData({
            wxUserInfo: wxUserInfo,
            favor_flag: favor_flag
          })

          console.log(wxUserInfo)

          wx.setStorage({
            key: 'wxUserInfo',
            data: wxUserInfo,
          })
        }
      })

    } else {
      wx.showToast({
        title: '未登录',
        icon: 'none'
      })
    }



  },

  /**
   * 未馆藏书籍推荐购买
   * @param e - 事件源对象
   */
  command: function (e) {
    var isbn = e.currentTarget.id,
        wxUserInfo = this.data.wxUserInfo,
        commandArr = wxUserInfo.command || [],
        openid = wxUserInfo.openid,
        libAuth = wxUserInfo.lib_auth

    var commandFlag = false  // 是否已推荐标识
    
    if (libAuth) {
      commandArr.forEach( (item, index) => {
        if (commandFlag) return
        commandFlag = item == isbn ? true : false
      })

      if (commandFlag) {
        wx.showToast({
          title: '您已推荐过',
          icon: 'none'
        })
      } else {
        wx.showModal({
          title: '图书推荐',
          content: '确认向图书馆推荐此书吗？',
          confirmText: '确认',
          success: res => {

            if (res.confirm) {

              wx.showToast({
                title: '推荐成功',
                icon: 'success',
                duration: 1000,
                mask: true
              })

              wx.request({
                url: this.url + '/command',
                data: {
                  isbn: isbn,
                  openid: openid
                },
                success: res => {
                  // res.data[0].value -> books_info
                  // res.data[1].value -> wxUserInfo
                  wxUserInfo = res.data[1].value
                  console.log(res)

                  this.setData({
                    wxUserInfo: wxUserInfo
                  })
                  wx.setStorage({
                    key: 'wxUserInfo',
                    data: wxUserInfo,
                  })
                }
              })

            }

          }
        })
      }
    } else {
      wx.showModal({
        title: '操作失败',
        content: '未进行图书馆读者认证。是否前往认证？',
        success: res => {
          if (res.confirm) {
            if (wxUserInfo.openid) {  // 判断是否已登录
              wx.navigateTo({
                url: '../lib_auth/lib_auth',
              })
            } else {
              wx.reLaunch({
                url: '../mine/mine',
              })
            }
          }
        }
      })
    }
  },

  imageLoad: function () {
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '加载成功',
        mask: true,
        duration: 1000
      })
    }, 500)
  },

  bindShare: function () {
    wx.showToast({
      title: '未登录',
      icon: 'none'
    })
  },

  /**
   * 跳转至图书评价查看界面
   */
  showRating: function () {
    var b_info = this.data.b_info

    wx.setStorage({
      key: 'b_info',
      data: b_info
    })

    wx.navigateTo({
      url: '../books_rate/index'
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var b_info = {},
        list = [],
        isbn = ''

    console.log(options)

    var wxUserInfo = {},
      favorBook = [],
      favor_flag = false

    codeQuery = options  // {OBJECT} 码的类型 & 条码号

    wx.showLoading({
      title: '加载中',
    })

    wx.request({    // 向后台发起请求，获取图书信息数据
      url: this.url + '/' + codeQuery.code_type + '_search?' + codeQuery.code_type + '=' + codeQuery.result,
      success: (res) => {
        b_info = res.data[0],
        list = b_info.collection_info || [];
        isbn = b_info.isbn13

        console.log(b_info);

        if(list.length > 0) {
          console.log('图书馆藏中')
          wx.request({  // 获取评价内容
            url: this.url + '/showBookRate',
            data: {
              isbn: isbn
            },
            success: res => {
              // res.data  评价栏内容
              console.log(res.data)

              this.setData({
                rate_list: res.data
              })
            }
          })
        }


        this.setData({
          b_info: b_info,
          list: list
        })

        wx.getStorage({
          key: 'wxUserInfo',
          success: (res) => {
            wxUserInfo = res.data
            favorBook = wxUserInfo.favor_book
            favorBook = favorBook ? favorBook : []

            favorBook.forEach((item, index) => {  // 循环遍历 为true时显示已收藏
              console.log(item)

              if(favor_flag) {  // 为true时跳出循环
                return false
              }

              favor_flag = (item == isbn) ? true : false
            })

            console.log(res.data)
            this.setData({
              wxUserInfo: wxUserInfo,
              favor_flag: favor_flag
            })

          },
        })
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
    console.log('onUnload')
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