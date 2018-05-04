// pages/books_info/index.js
var codeQuery = {};

Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    isFold: true,    // 简介展开按钮
    b_info : {},    // 图书信息
    list: [    // 馆藏信息列表
      {
        "code_39": "1659877",
        "situs": "花江图书馆一楼B库",
        "position": "22排A面3列4行",
        "open": false,
        "state": "collected",
        "loan_date": "",
        "return_date": ""
      }
    ]
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

  toLoan: function (e) {
    var code_39 = e.currentTarget.id
    wx.showModal({
      title: '确认借书',
      content: '您确定借阅《' + this.data.b_info.title + '》？',
      success: (res) => {
        if(res.confirm) {
          wx.request({
            url: this.url + '/loan_book?b_code=' + code_39,
            success: (res) => {
              console.log(res)
            }
          })
        }
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'libAuth',
      success: (res) => {
        console.log(res)
      },
    })
    // wx.showLoading({
    //   title: '加载中',
    //   icon: 'loading',
    //   mask: true
    // })
    codeQuery = options
    wx.request({    // 向后台发起请求，获取图书信息数据
      url: this.url + '/' + codeQuery.code_type + '_search?' + codeQuery.code_type + '=' + codeQuery.result,
      success: (data) => {
        var b_info = data.data[0],
            list = b_info.collection_info;
            
        console.log(b_info);

        this.setData({ 
          b_info: b_info,
          list: list
        });
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
    wx.getStorage({
      key: 'libAuth',
      success: (res) => {
        console.log(res)
      },
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