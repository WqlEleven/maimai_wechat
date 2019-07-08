// pages/store/store.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_id: 0,
    list: [],
    lists: [],
    block:0,
    none:0,
    distribution: 0,
    selectIndex: -1,
    country: '',
    selectIndexs: -1
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
    var url = '/program/store_area'
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
  //获取信息
  getInfo() {
    var that = this
    var url = '/program/store_region'
    var params = {
      id: that.data.country
    }
    app.request(url, params, function (res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        that.setData({
          info: res.data.data.info
        })
      } else {
        app.error(res.data.message)
      }
    }, false)
  },
  //获取门店具体列表
  getStoreList() {
    var that = this
    var url = '/program/store_list'
    var params = {
      country: that.data.country
    }
    app.request(url, params, function (res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        that.setData({
          lists: res.data.data.list
        })
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },
  activeTap(e) {
    //console.log(e)
    this.setData({
      selectIndex: e.currentTarget.dataset.index,
      country: e.currentTarget.dataset.id,
      block:1
    })
    this.getInfo();
    this.getStoreList();
  },
  activeTaps(e) {
    console.log(e)
    this.setData({
      selectIndexs: e.currentTarget.dataset.index,
      store_id: e.currentTarget.dataset.id,
      bgcolor: '#622D00',
    })
  },
  storeDetail(e) {
    if (this.data.country == '') {
      app.error('请选择地区')
      return
    }
    var params = app.params(this.data.params, {
      country: this.data.country ? this.data.country : ''
    })
    wx.navigateTo({
      url: "/pages/storeDetail/storeDetail" + (params ? "?" + params : "")
    })
  },
  none:function () {
    this.setData({
      block:0
    })
  },
  storeDetails(e) {
    console.log(this.data);
    if (this.data.store_id == '') {
      app.error('请选择门店')
      return
    }
    var params = app.params(this.data.params, {
      store_id: this.data.store_id ? this.data.store_id : ''
    })
    wx.navigateTo({
      url: "/pages/phoneMsg/phoneMsg" + (params ? "?" + params : "")
    })
  }
})