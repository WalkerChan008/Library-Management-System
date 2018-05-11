// pages/search/index.js
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
    var scanType = '',
        codeType = '';

    wx.scanCode({
      success: (res) => {
        scanType = res.scanType;

        if(scanType === 'QR_CODE') {    // 判断码类型
          wx.showModal({
            title: '扫描失败！',
            content: '无法识别二维码，请扫描书本上的条形码。',
            showCancel: false
          });
        }else if(bookReg.test(res.result) || scanType === 'CODE_39') {
          codeType = (scanType === 'CODE_39') ? 'code' : 'isbn';

          wx.navigateTo({
            url: '../books_info/index?code_type=' + codeType + '&result=' + res.result,
            success: res => {
              wx.showLoading({
                title: '加载中',
                mask: true
              })
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
    console.log(value);
    if(value) {

      wx.navigateTo({    // 跳转至图书列表页面
        url: '../books_list/index?value=' + value,
        success: () => {
          wx.showLoading({
            title: '数据加载中',
            mask: true
          })
        }
      })

      /*wx.request({
        url: this.url + '/value_search?value=' + value,
        success: (data) => {
          console.log(data);
          var books_info = data.data;
          console.log(books_info);
        }
      })*/
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      msgList: [
        { url: "url", title: "公告：首届“双语之星”翻译大赛征文启事" },
        {
          url: "url", title: "公告：【读书月】 读写修炼季之研学平台打卡——让阅读和写作成为科研的" },
        { url: "url", title: "公告：【闻书香・忆书名】有奖趣味猜书名活动开始啦！" }]
    });
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