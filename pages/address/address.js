// pages/address/address.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    addressIndex: -1,
    address_id: 0
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
    that.getList()
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
    var url = '/program/address_list'
    var params = {}
    app.request(url, params, function(res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        that.setData({
          list: res.data.data.list
        })
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  // 添加地址
  addressAdd(e) {
    wx.navigateTo({
      url: "/pages/AddAddress/AddAddress"
    })
  },

  // 修改地址
  addressEdit(e) {
    wx.navigateTo({
      url: "/pages/editAddress/editAddress?id=" + e.currentTarget.dataset.id
    })
  },

  // 删除地址
  addressDelete(e) {
    var id = e.currentTarget.dataset.id
    var that = this
    app.confirm('提示', '确定要删除吗？', function() {
      var url = '/program/address_delete'
      var params = {
        id: id
      }
      app.request(url, params, function(res) {
        //console.log(res.data)
        if (res.data.code == 0) {
          app.success('删除成功', 1500, function() {
            that.getList()
          })
        } else {
          app.error(res.data.message)
        }
      }, true, true, true)
    })
  },

  selectTap(e) {
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    this.setData({
      addressIndex: index,
      address_id: id
    })
  },

  //去支付
  pay(e) {
    var that = this
    if (that.data.address_id == 0) {
      app.error('请选择地址')
      return
    }
    //var address_id = e.currentTarget.dataset.id
    var address_id = that.data.address_id
    var params = app.params(this.data.params, {
      address_id: address_id ? address_id : ''
    })
    wx.navigateTo({
      url: "/pages/pay/pay" + (params ? "?" + params : "")
    })
  }
})