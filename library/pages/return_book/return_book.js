// pages/return_book/return_book.js
/* 已还书籍 待评价 */

Array.prototype.remove = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    wxUserInfo: {},
    b_list: [],
    list_count: 0,
  },

  chooseThis(e) {
    var code = e.currentTarget.id.split('-')[0],
        id = e.currentTarget.id.split('-')[1],
        rate = ''

    var b_list = [],
        wxUserInfo = {},
        list_count = this.data.list_count

    rate = (id == 'like') ? '赞' : '踩'

    wx.showModal({
      title: '评价确认',
      content: '您对该书籍的评价为：' + rate + '，一旦确认无法修改!',
      confirmText: '确认',
      cancelText: '我再想想',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: this.url + '/rateBook',
            data: {
              openid: this.data.wxUserInfo.openid,
              code: code,
              rate: id
            },
            success: res => {
              // res.data[0].value -> books_info
              // res.data[1].value -> wxUserInfo
              b_list = this.data.b_list
              wxUserInfo = res.data[1].value
              list_count = list_count - 1

              console.log(wxUserInfo)

              b_list.forEach((item, index) => {
                if (item.return_info.code_39 == code) {
                  b_list.remove(index);
                }
              })

              this.setData({
                b_list: b_list,
                wxUserInfo: wxUserInfo,
                list_count: list_count
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var b_list = [],
      return_book = []
    wx.getStorage({  // 从缓存中读取用户信息
      key: 'wxUserInfo',
      success: res => {
        console.log(res.data.return_book)
        return_book = res.data.return_book
        return_book = return_book ? return_book : []
        this.setData({
          wxUserInfo: res.data,
          list_count: return_book.length
        })

        wx.request({
          method: 'POST',
          url: this.url + '/getReturnBookInfo',
          data: { codeArr: return_book },  // 用户已还未评价书籍的数组
          success: res => {
            // res.data {Array} - 后台返回的已还未评价的书籍信息
            b_list = res.data
            b_list.forEach((item, index) => {  // 遍历图书信息数组
              item.collection_info.forEach((item1, index1) => {  // 遍历每个图书数组中的馆藏信息
                (item1.code_39 == return_book[index]) ? item.return_info = item1 : '';  // 匹配所借书籍的条码号并插入至该条图书信息的return_info字段中
              })
            })
            console.log(b_list)
            this.setData({
              b_list: b_list
            })
          }
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