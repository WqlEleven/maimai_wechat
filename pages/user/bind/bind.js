// pages/user/bind/bind.js
//获取应用实例
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    name: '',
    mobile: '',
    code: '',
    btnsub: '获取验证码',
    isclick: true
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
    //this.getUserInfo()
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

  },

  realnameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  //获取验证码
  getcode: function (e) {
    var that = this
    if (that.data.mobile == '') {
      app.error('请输入手机号码')
      return;
    }
    if (!/^1[3|4|5|7|8]\d{9}$/.test(that.data.mobile)) {
      app.error('手机号码格式不正确')
      return;
    }
    if (!that.data.isclick) {
      return;
    }
    var url = '/program/sms_code'
    var params = {
      name: that.data.name,
      mobile: that.data.mobile
    }
    var time = 60
    app.request(url, params, function (res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        if (that.data.isclick) {
          that.setData({
            isclick: false
          })
          var timer = setInterval(function () {
            if (time <= 0) {
              time = 60
              that.setData({
                btnsub: '重发',
                isclick: true
              })
              clearInterval(timer)
            } else {
              time--
              that.setData({
                btnsub: '发送(' + time + ')'
              })
            }
          }, 1000)
        }
      } else {
        app.error(res.data.message)
      }
    })
  },

  getUserInfo: function () {
    var that = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              //this.globalData.userInfo = res.userInfo
              //console.log(res)
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  formSubmit: function (e) {
    console.log(e)
    var that = this
    var form_id = e.detail.formId
    var form_data = e.detail.value
    var name = form_data.name
    var mobile = form_data.mobile
    var code = form_data.code
    if (form_data.name == '') {
      app.error('请输入真实姓名')
      return
    }
    if (form_data.mobile == '' || !/^1[3|4|5|7|8]\d{9}$/.test(form_data.mobile)) {
      app.error('手机号格式错误')
      return
    }
    if (form_data.code == '') {
      app.error('请输入验证码')
      return
    }
    var url = '/program/user_bind'
    var params = form_data
    params.form_id = form_id
    app.request(url, params, function (res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        var currentPages = getCurrentPages()
        //console.log(currentPages)
        var has_auth = false
        currentPages.forEach(function (value, index, data) {
          if (value.route.indexOf('auth/auth') !== -1) {
            has_auth = true
          }
        })
        var delta = 1
        if (has_auth) {
          delta = 2
        }
        app.success('绑定成功', 1500, '', 'navigateBack', delta)
      } else {
        app.error(res.data.message)
      }
    })
  },

  formReset: function () {
    console.log('form reset')
  },
})