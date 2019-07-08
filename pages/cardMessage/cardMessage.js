// pages/cardMessage/cardMessage.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    name: '',
    mobile: '',
    card: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      var params = app.decode(options)
      this.setData({
        params: params
      })
    }
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.getInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //获取信息
  getInfo() {
    var that = this
    var url = '/program/order_last'
    var params = {}
    app.request(url, params, function(res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        var info = res.data.data.info
        that.setData({
          info: info,
          name: info.name ? info.name : '',
          mobile: info.mobile ? info.mobile : '',
          card: info.card ? info.card : ''
        })
      } else {
        app.error(res.data.message)
      }
    })
  },

  inputName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  inputCard(e) {
    this.setData({
      card: e.detail.value
    })
  },

  verifyCard: function() {
    var that = this
    // if (that.data.name == '') {
    //   app.error('请输入姓名')
    //   return
    // }
    if (that.data.card == '') {
      app.error('请输入消费卡号')
      return
    }
    var url = '/program/card'
    var params = {
      card: that.data.card
    }
    app.request(url, params, function(res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        if (res.data.data.mobile) {
          that.setData({
            mobile: res.data.data.mobile
          })
          var params = app.params(that.data.params, {
            name: that.data.name ? that.data.name : '',
            card: that.data.card ? that.data.card : '',
            mobile: that.data.mobile ? that.data.mobile : ''
          })
          wx.navigateTo({
            url: "/pages/verifyCard/verifyCard" + (params ? "?" + params : "")
          })
        } else {
          app.error('卡号不存在')
        }
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  }
})