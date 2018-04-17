Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    books_info: [],
    checkbox: []
  },

  /** 
   * 绑定扫一扫按钮事件
   */
  bindScanTap: function () {
    var bookReg = /^978(\d){10}$/g;   // 正则匹配isbn
    var scanType = '';

    wx.scanCode({
      success: (res) => {
        scanType = res.scanType;
        if(scanType === 'QR_CODE') {
          wx.showModal({
            title: '扫描失败！',
            content: '无法识别二维码，请扫描书本上的条形码。',
            showCancel: false
          });
        }else if(bookReg.test(res.result) || scanType === 'CODE_39') {
          wx.request({
            url: this.url + '/code_search?isbn=' + res.result,
            success: (data) => {
              var books_info = data.data;
              console.log(books_info);
              this.setData({ books_info: books_info });
            }
          })
        }else {
          wx.showModal({
            title: '扫描失败！',
            content: '无法识别商品码，请扫描书本上的条形码。',
            showCancel: false
          });
        }
      }
    })
  },

  /**
   * 绑定搜索按钮事件
   */
  bindConfirm: function (e) {
    var value = e.detail.value.trim();
    if(value) {
      wx.request({
        url: this.url + '/value_search?value=' + value,
        success: (data) => {
          var books_info = data.data;

          this.setData({ books_info: books_info });
          console.log(books_info);
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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