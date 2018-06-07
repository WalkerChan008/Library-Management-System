// pages/books_rate/index.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    b_info: {},

    rate_list: [],

    pageIndex: 1,
    loading: true,
    loadingComplete: false,
  },

  /**
   * 加载更多评论内容
   */
  rateScrollToLower: function () {
    var b_info = this.data.b_info,
        rate_list = this.data.rate_list,
        pageIndex = this.data.pageIndex + 1,
        loading = this.data.loading,
        loadingComplete = this.data.loadingComplete

    var isbn = b_info.isbn13

    var timer = undefined

    if (loadingComplete) {
      return false
    }


    wx.request({
      url: this.url + '/showAllRate',
      data: {
        isbn: isbn,
        pageIndex: pageIndex
      },
      success: res => {
        loadingComplete = (res.data.length == 0) ? true : false
        loading = loadingComplete ? false : true

        rate_list = rate_list.concat(res.data)

        timer = setTimeout( () => {

          this.setData({
            rate_list: rate_list,
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
    var pageIndex = this.data.pageIndex,
        loading = this.data.loading,
        loadingComplete = this.data.loadingComplete

    var b_info = {},
        isbn = ''

    wx.getStorage({
      key: 'b_info',
      success: res => {
        // res.data - 图书信息
        b_info = res.data
        isbn = b_info.isbn13

        this.setData({
          b_info: b_info
        })

        wx.request({
          url: this.url + '/showAllRate',
          data: {
            isbn: isbn,
            pageIndex: pageIndex
          },
          success: res => {
            if (res.data.length < 5) {
              loading = !loading
              loadingComplete = !loadingComplete
            }

            this.setData({
              rate_list: res.data,

              loading: loading,
              loadingComplete: loadingComplete
            })
          }
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
    wx.removeStorage({
      key: 'b_info'
    })
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