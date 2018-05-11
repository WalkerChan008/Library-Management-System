// pages/loan_book/loan_book.js
/* 已借书籍 待归还 */

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
    list_count: 0
  },

  returnBook: function (e) {
    var code_39 = e.currentTarget.id,
        b_list = [],
        wxUserInfo = {},
        list_count = this.data.list_count

    wx.showModal({
      title: '还书确认',
      content: '您确认归还此书吗？',
      confirmText: '确认',
      success: res => {
        if(res.confirm) {

          wx.showToast({
            title: '还书成功',
            mask: true,
            duration: 1000
          })

          wx.request({
            url: this.url + '/returnBook',
            data: {
              code: code_39,
              openid: this.data.wxUserInfo.openid
            },
            success: res => {
              // res.data[0].value -> books_info
              // res.data[1].value -> wxUserInfo
              b_list = this.data.b_list
              wxUserInfo = res.data[1].value
              list_count = list_count - 1

              console.log(wxUserInfo)

              b_list.forEach( (item, index) => {
                if (item.loan_info.code_39 == code_39) {
                  b_list.remove(index);
                }
              })

              console.log(b_list)

              this.setData({
                b_list: b_list,
                wxUserInfo: wxUserInfo,
                list_count: list_count
              })

              wx.setStorage({
                key: 'wxUserInfo',
                data: wxUserInfo,
              })

              console.log(res)
            }
          })

        }
      }
    })
  },

  imageLoad: function () {
    setTimeout(() => {
      wx.hideLoading()
    }, 500)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var b_list = [],
        loan_book = []

    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.getStorage({  // 从缓存中读取用户信息
      key: 'wxUserInfo',
      success: res => {
        console.log(res.data.loan_book)
        loan_book = res.data.loan_book || []
        // loan_book = loan_book ? loan_book : []
        
        this.setData({
          wxUserInfo: res.data,
          list_count: loan_book.length
        })

        if(loan_book.length > 0) {

          wx.request({
            method: 'POST',
            url: this.url + '/getLoanBookInfo',
            data: { codeArr: res.data.loan_book },  // 用户已借未还书籍的数组
            success: res => {
              // res.data {Array} - 后台返回的已借未还的书籍信息
              b_list = res.data
              b_list.forEach( (item, index) => {  // 遍历图书信息数组
                item.collection_info.forEach( (item1, index1) => {  // 遍历每个图书数组中的馆藏信息
                  (item1.code_39 == loan_book[index]) ? item.loan_info = item1 : '';  // 匹配所借书籍的条码号并插入至该条图书信息的loan_info字段中
                })
              })
              console.log(b_list)
              this.setData({
                b_list: b_list
              })
            }
          })
          // this.setData({
          //   wxUserInfo: res.data,
          //   wxAuth: res.data.openid ? true : false
          // })

        } else {

          setTimeout(() => {
            wx.hideLoading()
          }, 500)
          
        }
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