// pages/wxPaySucess/wxPaySucess.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
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
    this.getInfo()
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
    var url = '/program/order_info'
    var params = {
      id: that.data.id
    }
    app.request(url, params, function(res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        that.setData({
          info: res.data.data.info
        })
      } else {
        app.error(res.data.message)
      }
    })
  },

  goIndex: function() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})