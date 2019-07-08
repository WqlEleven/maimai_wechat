// pages/goodsDetail/goodsDetail.js
//获取应用实例
const app = getApp()

//引入WxParse模块
var WxParse = require('../../wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.id) {
      that.setData({
        id: options.id
      })
    }
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
    var that = this
    that.getInfo()
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

  //获取信息
  getInfo() {
    var that = this
    var url = '/program/goods_info'
    var params = {
      id: that.data.id
    }
    app.request(url, params, function (res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        that.setData({
          info: res.data.data.info
        })
        //数据绑定
        WxParse.wxParse('intro', 'html', that.data.info.intro, that, 5)
        WxParse.wxParse('content', 'html', that.data.info.content, that, 5)
      } else {
        app.error(res.data.message)
      }
    })
  },

  buyNow: function () {
    wx.navigateTo({
      url: "/pages/chooseSize/chooseSize?id=" + this.data.id
    })
  }
})