// pages/phoneMsg/phoneMsg.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    name: '',
    mobile: ''
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
          mobile: info.mobile ? info.mobile : ''
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

  inputMobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  goPay(e) {
    var that = this
    if (that.data.name == '') {
      app.error('请输入姓名')
      return
    }
    if (that.data.mobile == '') {
      app.error('请输入手机号')
      return
    }
    if (!/^1[3|4|5|7|8]\d{9}$/.test(that.data.mobile)) {
      app.error('手机号码格式不正确')
      return
    }
    var params = app.params(this.data.params, {
      name: this.data.name ? this.data.name : '',
      mobile: this.data.mobile ? this.data.mobile : ''
    })
    wx.navigateTo({
      url: "/pages/pay/pay" + (params ? "?" + params : "")
    })
  }
})