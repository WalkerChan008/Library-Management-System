// pages/books_hot/hot.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    top1: {},
    rank_list: [],
    pickerArr: ['总榜', '计算机科学', '社会科学', '外语榜单', '文学榜单', '历史榜单', '小说榜单', '其他' ],
    pickerIndex: 0
  },

  bindPickerChange: function (e) {
    var value = e.detail.value

    var new_list = []
    console.log('picker发送选择改变，携带值为', value)

    this.changeList(value)

    this.setData({
      pickerIndex: value
    })
  },

  /**
   * 更换榜单列表
   */
  changeList: function (value) {

    var top1 = {},
        rank_list = []

    wx.request({
      url: this.url + '/book_hot',
      data: {
        book_type: value
      },
      success: res => {
        rank_list = res.data
        top1 = rank_list.shift() || {}

        this.setData({
          top1: top1,
          rank_list: rank_list
        })

        wx.showToast({
          title: '切换中',
          icon: 'loading',
          mask: true,
          duration: 500
        })
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

    wx.showLoading({
      title: '加载中',
      mask: true
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
    var pickerIndex = this.data.pickerIndex

    var rank_list,
        top1 = {}

    wx.request({
      url: this.url + '/book_hot',
      data: {
        book_type: pickerIndex
      },
      success: (data) => {

        rank_list = data.data
        top1 = rank_list.shift()

        this.setData({
          top1: top1,
          rank_list: rank_list
        })
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