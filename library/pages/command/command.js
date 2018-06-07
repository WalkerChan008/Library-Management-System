// pages/command/command.js
Page({

  url: require('../../config.js'),

  /**
   * 页面的初始数据
   */
  data: {
    value: ''
  },

  /**
   * 图书推荐表单提交
   */
  bindSubmit: function (e) {
    var formObj = e.detail.value

    console.log(formObj)

    // 填写字段required
    if(!formObj.title) {  // 书名不为空时
      wx.showModal({
        title: '提示',
        content: '书名不能为空！',
        showCancel: false,
        confirmText: '关闭'
      })
      return
    } else if (!formObj.wechat && !formObj.phone) {  // 两者之一不为空
      wx.showModal({
        title: '提示',
        content: '联系方式至少填写一项！',
        showCancel: false,
        confirmText: '关闭'
      })
      return
    } else if(formObj.phone) {
      var phoneReg = /^1[3-8](\d){9}$/g,
          flag = phoneReg.test(formObj.phone)

      if(!flag) {
        wx.showModal({
          title: '提示',
          content: '手机号码格式不正确，请重新输入!',
          showCancel: false,
          confirmText: '关闭'
        })
        return
      }
    }

    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 1000,
      success: () => {

        setTimeout(() => {
          wx.navigateBack()
        }, 1000)

        wx.request({
          url: this.url + '/addCommand',
          method: 'POST',
          data: formObj,
          success: res => {
            console.log('图书推荐成功')
          }
        })

      }
    })


    
  },

  /**
   * 图书推荐表单重置
   */
  bindReset: function () {
    console.log('form发生了reset事件')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      value: options.value
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