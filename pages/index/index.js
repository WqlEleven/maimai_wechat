//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    list: {},
    chooseSize: false,
    animationData: {},
    current: 0, //这里不写第一次启动展示的时候会有问题
    show: true,
    disShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    //app.checkRegister()
    app.checkRegister(function() {
      that.getList()
    })
    // app.checkBind()
    // app.authorize('用户信息', 'scope.userInfo', function() {
    //   console.log('position ok')
    // })
    // app.authorize('地理位置', 'scope.userLocation', function() {
    //   console.log('position ok')
    // })
    // app.authorize('通讯地址', 'scope.address', function () {
    //   console.log('position ok')
    // })
    //that.getList()
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
    var that = this
    that.getList(function(res) {
      wx.stopPullDownRefresh()
    })
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
    var that = this
    var title = that.data.list[that.data.current].name
    var path = '/pages/index/index?id=' + that.data.id
    var imageUrl = that.data.list[that.data.current].picture
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    }
  },

  //获取列表
  getList(func_callback = null) {
    var that = this
    var url = '/program/goods_list'
    var params = {}
    app.request(url, params, function(res) {
      console.log(res.data)
      if (res.data.code == 0) {
        var list = res.data.data.list
        if (list.length > 0) {
          var current = 0
          if (that.data.id) {
            for (var i = 0; i < list.length; i++) {
              if (list[i].id == that.data.id) {
                current = i
                break
              }
            }
            var show = false;
            if (list[current].stock > 0) {
              show = true;
            }
            that.setData({
              show: show
            })
          } else {
            var show = false;
            if (list[0].stock > 0) {
              show = true;
            }
            var id = list[0].id
            that.setData({
              id: id,
              show: show
            })
          }
          that.setData({
            list: list,
            current: current
          })
        }
        typeof func_callback == 'function' && func_callback(res)
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  bindchange(e) {
    var that = this
    // console.log(e)
    //var source = e.detail.source
    var current = e.detail.current
    var id = e.detail.currentItemId
    var show = false;
    if (that.data.list[current].stock > 0) {
      show = true;
    }
    this.setData({
      current: current,
      id: id,
      show: show
    })
  },

  btnclick: function(e) {
    //console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/goodsDetail/goodsDetail?id=" + id
    })
  },

  buyNow: function(e) {
    var id = this.data.id
    wx.navigateTo({
      url: "/pages/chooseSize/chooseSize?id=" + id
    })
  },
})