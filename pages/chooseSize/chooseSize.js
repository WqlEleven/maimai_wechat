// pages/chooseSize/chooseSize.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    color_list: [],
    size_list: [],
    num_list: [1, 2, 3, 4, 5, 6, 7, 8],
    color: '',
    size: '',
    num: 0,
    input_num: 0,
    shown: 0,
    colorIndex: 0,
    sizeIndex: 0,
    numIndex: 0,
    money: 0,
    show: ''
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
    var url = '/program/goods_info'
    var params = {
      id: that.data.params.id
    }
    app.request(url, params, function(res) {
      console.log(res.data)
      if (res.data.code == 0) {
        var info = res.data.data.info
        var color_list = []
        if (info.color_list.length > 0) {
          info.specifications_list.forEach(function(value, index, array) {
            if (value.color && value.stock > 0 && color_list.indexOf(value.color) == -1) {
              color_list.push(value.color)
            }
          })
        }
        //console.log(color_list)
        //console.log(info.color_list)
        var color = color_list.length > 0 ? color_list[0] : ''
        //var colorIndex = color_list.length > 0 ? info.color_list.indexOf(color) : 0
        //console.log(color, colorIndex)
        var colorIndex = -1
        for (var i = 0; i < info.color_list.length; i++) {
          var item = info.color_list[i]
          //console.log(item.name, color)
          if (item.name == color) {
            colorIndex = i
            break
          }
        }
        //console.log(color, colorIndex)

        var size_list = []
        info.specifications_list.forEach(function(value, index, array) {
          var colors = value.color ? value.color : ''
          if (colors == color && value.stock > 0 && size_list.indexOf(value.size) == -1) {
            size_list.push(value.size)
          }
        })
        //console.log(size_list)
        //console.log(info.size_list)
        var size = size_list.length > 0 ? size_list[0] : ''
        var sizeIndex = size_list.length > 0 ? info.size_list.indexOf(size) : -1
        //console.log(size, sizeIndex)

        var info_color_list = info.color_list
        for (var i = 0; i < info_color_list.length; i++) {
          if (color_list.indexOf(info_color_list[i].name) != -1) {
            info_color_list[i].can_select = true
          }
        }

        var info_size_list = info.size_list
        var info_size_lists = []
        for (var i = 0; i < info_size_list.length; i++) {
          info_size_lists[i] = {
            name: info_size_list[i]
          }
          if (size_list.indexOf(info_size_list[i]) != -1) {
            info_size_lists[i].can_select = true
          }
        }
        that.setData({
          info: info,
          color_list: info_color_list,
          size_list: info_size_lists,
          color: color,
          size: size,
          num: that.data.num_list.length > 0 ? that.data.num_list[0] : 0,
          colorIndex: colorIndex,
          sizeIndex: sizeIndex
        })
        //console.log(that.data)
        that.totalMoney()
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  colorTap(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var color = that.data.color_list[index].name
    //console.log(index, color)
    var size_list = []
    that.data.info.specifications_list.forEach(function(value, index, array) {
      var colors = value.color ? value.color : ''
      if (colors == color && value.stock > 0 && size_list.indexOf(value.size) == -1) {
        size_list.push(value.size)
      }
    })
    //console.log(size_list)
    //console.log(info.size_list)
    var size = size_list.length > 0 ? size_list[0] : ''
    var sizeIndex = size_list.length > 0 ? that.data.info.size_list.indexOf(size) : 0
    //console.log(size, sizeIndex)

    var info_size_list = that.data.info.size_list
    //console.log(info_size_list)
    var info_size_lists = []
    for (var i = 0; i < info_size_list.length; i++) {
      info_size_lists[i] = {
        name: info_size_list[i]
      }
      if (size_list.indexOf(info_size_list[i]) != -1) {
        info_size_lists[i].can_select = true
      }
    }
    //console.log(info_size_lists)
    this.setData({
      colorIndex: index,
      color: color,
      sizeIndex: sizeIndex,
      size: size,
      size_list: info_size_lists
    })
    that.totalMoney()
  },
  sizeTap(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    this.setData({
      sizeIndex: index,
      size: this.data.size_list[index].name
    })
    that.totalMoney()
  },
  numTap(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    //console.log(that.data.num_list[index])
    this.setData({
      numIndex: index,
      num: this.data.num_list[index],
      input_num: 0
    })
    that.totalMoney()
  },
  inputNum(e) {
    var that = this
    this.setData({
      num: e.detail.value,
      numIndex: -1
    })
    that.totalMoney()
  },
  totalMoney() {
    var that = this
    var price = that.data.info.price
    for (var i = 0; i < that.data.info.specifications_list.length; i++) {
      var item = that.data.info.specifications_list[i]
      //console.log(that.data.color + '==' + item.color + ',' + that.data.size + '==' + item.size)
      var color = item.color
      var size = item.size
      if (color == undefined) {
        color = ''
      }
      if (size == undefined) {
        size = ''
      }
      //console.log(that.data.color + '==' + color + ',' + that.data.size + '==' + size)
      if (that.data.color == color && that.data.size == size) {
        price = item.price
        break
      }
    }
    var money = price * that.data.num
    that.setData({
      money: money
    })
  },
  buyNow() {
    var that = this
    if (that.data.color_list.length > 0 && that.data.color == '') {
      app.error('请选择颜色')
      return
    }
    if (that.data.size_list.length > 0 && that.data.size == '') {
      app.error('请选择尺码')
      return
    }
    if (that.data.num == 0) {
      app.error('请选择数量')
      return
    }
    if (that.data.money > 0) {

    } else {
      app.error('商品金额必须大于0')
      return
    }
    //console.log(that.data.color, that.data.size, that.data.num)
    for (var i = 0; i < that.data.info.specifications_list.length; i++) {
      var item = that.data.info.specifications_list[i]
      var colors = item.color ? item.color : ''
      var sizes = item.size ? item.size : ''
      if (colors == that.data.color && sizes == that.data.size) {
        if (that.data.num > item.stock) {
          app.error('库存不足')
          return
        }
      }
    }
    var params = app.params(this.data.params, {
      color: this.data.color ? this.data.color : '',
      size: this.data.size ? this.data.size : '',
      num: this.data.num ? this.data.num : ''
    })
    wx.navigateTo({
      url: "/pages/getGoods/getGoods" + (params ? "?" + params : "")
    })
  },

})