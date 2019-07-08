// pages/user/auth/auth.js
//获取应用实例
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: app.globalData.config.name
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

  },

  bindGetUserInfo: function (e) {
    //console.log(e)
    var that = this
    if (e.detail.errMsg == 'getUserInfo:ok') {
      //console.log(e.detail)
      that.setData({
        authUserinfo: true,
        userInfo: e.detail.userInfo
      })
      //wx.showTabBar()

      //用户注册
      var url = '/program/user_register'
      var params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
      app.request(url, params, function (res) {
        console.log('bindGetUserInfo user_register success')
        //console.log(res.data)
        if (res.data.code == 0) {
          app.success('登录成功', 1500, function () {
            wx.navigateBack({
              detal: 1
            })
          })
        } else {
          app.error(res.data.message)
        }
      })
    } else {
      console.log(e.detail.errMsg)
    }
  }
})