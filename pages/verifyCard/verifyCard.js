// pages/verifyCard/verifyCard.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    length: 6, //输入框个数
    isFocus: true, //聚焦
    code: "", //输入的内容
    ispassword: false, //是否密文显示 true为密文， false为明文。
    distribution: 0,
    continues: 0,
    nones: 0,
    seconds: 60
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
  inputCode(e) {
    var that = this
    that.setData({
      code: e.detail.value
    })
  },
  codeTap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) {
    console.log(e.detail.value.password);
  },
  question: function() {
    wx.navigateTo({
      url: "/pages/question/question"
    })
  },
  chooseCard: function() {
    var that = this
    if (that.data.code == '') {
      app.error('请输入验证码')
      return
    }
    if (that.data.code.length != that.data.length) {
      app.error('请输入完整验证码')
      return
    }
    var url = '/program/card_check'
    var params = {
      mobile: that.data.params.mobile,
      code: that.data.code
    }
    app.request(url, params, function(res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        var params = app.params(that.data.params, {
          code: that.data.code ? that.data.code : ''
        })
        wx.navigateTo({
          url: "/pages/chooseCard/chooseCard" + (params ? "?" + params : "")
        })
      } else {
        app.error(res.data.message)
      }
    })
  },
  Click: function() {
    var that = this
    var url = '/program/sms_code'
    var params = {
      mobile: that.data.params.mobile
    }
    app.request(url, params, function(res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        that.setData({
          distribution: 1,
          continues: 1
        })
        var time = 60;
        var timer = setInterval(function() {
          if (time <= 0) {
            time = 60
            clearInterval(timer)
            that.setData({
              distribution: 0,
              seconds: 60
            })
          } else {
            time--;
            that.setData({
              seconds: time
            })
          }
        }, 1000)
      } else {
        app.error(res.data.message)
      }
    })
  },
  nones: function() {
    console.log(1)
    this.setData({
      nones: 1
    })
  }
})