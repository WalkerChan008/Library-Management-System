Page({

  /**
   * 页面的初始数据
   */
  data: {
    books_info: [],
    checkbox: []
  },

  insert: function () {
    var cb = this.data.checkbox;
    console.log(cb);
    cb.push(this.data.checkbox.length);
    this.setData({
      checkbox: cb
    });
  },

  /** 
   * 绑定扫一扫按钮事件
   */
  bindScanTap: function () {
    wx.scanCode({
      success: (res) => {
        wx.request({
          url: 'http://localhost/code_search?isbn=' + res.result,
          success: (data) => {
            var books_info = data.data;

            this.setData({books_info: books_info});
            console.log(books_info);
          }
        })
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
        url: 'http://localhost/value_search?value=' + value,
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