// pages/books_list/index.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',   // 查询的关键字
    list_count: 0,     // 查询到的长度
    b_list: [],     // 图书信息数组

    imageLoadFlag: true,   // 图片加载标志 - 只执行一次imageLoad

    pageIndex: 1,   // 第一页
    loading: true,    // 显示加载图标
    loadingComplete: false,   // 加载完成
  },

  /**
   * 图书推荐的两种方式之一
   */
  command: function () {
    wx.getStorage({
      key: 'wxUserInfo',
      success: res => {
        console.log(res.data.openid)
        if(res.data.openid) {   // 登录后使用
          wx.navigateTo({
            url: '../command/command?value=' + this.data.searchValue
          })
        }

      },
      fail: res => {   // 未提供按钮跳转登录
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

  /**
   * 图书加载完成事件
   */
  imageLoad: function () {
    var imageLoadFlag = this.data.imageLoadFlag

    if (imageLoadFlag) {

      setTimeout(() => {
        wx.hideLoading()
        wx.showToast({
          title: '加载成功',
          duration: 1000
        })
      }, 500)

      this.setData({
        imageLoadFlag: false
      })
    }

  },

  /**
   * 下拉刷新
   */
  bookScrollToLower: function () {
    var searchValue = this.data.searchValue,
        b_list = this.data.b_list,
        pageIndex = this.data.pageIndex + 1,
        loading = this.data.loading,
        loadingComplete = this.data.loadingComplete

    var timer = undefined

    if (loadingComplete) {
      return false
    }


    wx.request({
      url: this.url + '/value_search',
      data: {
        value: searchValue,
        pageIndex: pageIndex
      },
      success: res => {
        loadingComplete = (res.data[0].length == 0) ? true : false  // 返回数据为空与否
        loading = loadingComplete ? false : true

        b_list = b_list.concat(res.data[0])

        timer = setTimeout(() => {

          this.setData({
            b_list: b_list,
            pageIndex: pageIndex,
            loading: loading,
            loadingComplete: loadingComplete,
          })
          clearTimeout(timer)

        }, 300)

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var b_list = [],
        list_count = 0,
        pageIndex = this.data.pageIndex,
        loading = this.data.loading,
        loadingComplete = this.data.loadingComplete

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
      url: this.url + '/value_search',
      data: {
        value: options.value,
        pageIndex: pageIndex
      },
      success: res => {
        // res.data[0] - 图书信息
        // res.data[1] - 所有图书数量
        b_list = res.data[0]
        list_count = res.data[1]

        if(list_count < 7) {
          loading = !loading
          loadingComplete = !loadingComplete
        }

        this.setData({
          list_count: list_count,
          b_list: b_list,

          loading: loading,
          loadingComplete: loadingComplete
        })

        if (list_count == 0) {
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