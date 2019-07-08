// pages/chooseCard/chooseCard.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    cardId: ''
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
    this.getList()
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

  //获取列表
  getList() {
    var that = this
    var url = '/program/card'
    var params = {
      card: that.data.params.card
    }
    app.request(url, params, function(res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        var list = res.data.data.cards
        var card_id = ''
        for (var i = 0; i < list.length; i++) {
          list[i]['card'] = list[i]['code'].replace(/(.{4})/g, "$1  ")
          if (list[i]['code'] == that.data.params.card) {
            card_id = list[i]['id']
          }
        }
        that.setData({
          list: list,
          cardId: card_id
        })
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  formSubmit: function(e) {
    //console.log(e)
    var that = this
    var form_id = e.detail.formId
    var form_data = e.detail.value
    var params = that.data.params
    if (!params.id) {
      app.error('缺少订单ID')
      return
    }
    if (!params.card) {
      app.error('缺少卡号')
      return
    }
    var url = '/program/card_money'
    //var params = form_data
    params.form_id = form_id
    params.card_id = that.data.cardId
    app.request(url, params, function(res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        app.success('支付成功', 1500, '/pages/payCard/payCard', 'navigateTo')
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  formReset: function() {
    console.log('form reset')
  },

  paySueccess: function() {
    wx.navigateTo({
      url: "/pages/payCard/payCard"
    })
  }
})