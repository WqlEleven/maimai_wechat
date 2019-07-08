// pages/pay/pay.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    payType: 0,
    price: 0,
    money: 0,
    freight: 0,
    total: 0,
    order_id: 0,
    deliver:0
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
    if(that.data.params.deliver == 1){
      that.setData({
        deliver:1
      })
    }
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
      // console.log(res.data)
      if (res.data.code == 0) {
        that.setData({
          info: res.data.data.info
        })
        that.totalMoney()
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  totalMoney() {
    var that = this
    var price = that.data.info.price
    for (var i = 0; i < that.data.info.specifications_list.length; i++) {
      var item = that.data.info.specifications_list[i]
      //console.log(that.data.params.color + '==' + item.color + ',' + that.data.params.size + '==' + item.size)
      var color = item.color
      var size = item.size
      if (color == undefined) {
        color = ''
      }
      if (size == undefined) {
        size = ''
      }
      //console.log(that.data.params.color + '==' + color + ',' + that.data.params.size + '==' + size)
      if (that.data.params.color == color && that.data.params.size == size) {
        price = item.price
        break
      }
    }
    var money = price * that.data.params.num
    var freight = that.data.info.freight
    var total = (money + parseFloat(freight)).toFixed(2)
    that.setData({
      price: price,
      money: money,
      freight: freight,
      total: total
    })
  },

  payTap(e) {
    var that = this
    var type = e.currentTarget.dataset.type
    that.setData({
      payType: type
    })
  },

  formSubmit: function(e) {
    //console.log(e)
    var that = this
    var form_id = e.detail.formId
    var form_data = e.detail.value
    var params = that.data.params
    if (that.data.order_id > 0) {
      that.pay(that.data.order_id)
    } else {
      if (!params.id) {
        app.error('请选择商品')
        return
      }
      if (!params.num) {
        app.error('请选择数量')
        return
      }
      if (that.data.payType == 0) {
        app.error('请选择支付方式')
        return
      }
      var url = '/program/order'
      //var params = form_data
      params.form_id = form_id
      params.pay_type = that.data.payType
      app.request(url, params, function(res) {
        //console.log(res.data)
        if (res.data.code == 0) {
          var order_id = res.data.data.info.id
          that.setData({
            order_id: order_id
          })
          that.pay(order_id)
        } else {
          app.error(res.data.message)
        }
      }, true, true, true)
    }
  },

  formReset: function() {
    console.log('form reset')
  },

  pay(order_id) {
    var that = this
    if (that.data.payType == 1) {
      that.weixin(order_id)
      // wx.navigateTo({
      //   url: "/pages/wxPaySucess/wxPaySucess?id=" + order_id
      // })
    } else if (that.data.payType == 2) {
      that.card(order_id)
      // wx.navigateTo({
      //   url: "/pages/cardMessage/cardMessage?id=" + order_id
      // })
    } else if (that.data.payType == 3) {
      that.daodian(order_id)
      // wx.navigateTo({
      //   url: "/pages/paySueccess/paySueccess?id=" + order_id
      // })
    } else if (that.data.payType == 4) {
      that.huodao(order_id)
      // wx.navigateTo({
      //   url: "/pages/paySueccess/paySueccess?id=" + order_id
      // })
    }
  },

  weixin(order_id) {
    var that = this
    var url = '/program/order_pay_weixin'
    var params = {
      id: order_id
    }
    app.request(url, params, function(res) {
      //console.log(res)
      if (res.data.code == 0) {
        that.weixinPay(order_id, res.data.data.pay, res.data.data.prepay_id)
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  weixinPay(order_id, data, prepay_id) {
    //console.log(data)
    var that = this
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function(res) {
        //console.log(res)
        if (res.errMsg == "requestPayment:ok") {
          app.success('支付成功', 1500, function() {
            that.weixinPaySucess(order_id, prepay_id)
          })
        }
      },
      fail: function(res) {
        if (res.errMsg == "requestPayment:fail") {
          app.error('支付取消')
        } else {
          app.error('支付失败')
        }
      }
    })
  },

  weixinPaySucess(order_id, prepay_id) {
    var that = this
    var url = '/program/order_pay_weixin_prepay_id'
    var params = {
      id: order_id,
      prepay_id: prepay_id
    }
    app.request(url, params, function(res) {
      //console.log(res)
      if (res.data.code == 0) {
        wx.navigateTo({
          url: "/pages/wxPaySucess/wxPaySucess?id=" + order_id
        })
      } else {
        app.error(res.data.message)
      }
    })
  },

  card(order_id) {
    var that = this
    var url = '/program/order_pay_card'
    var params = {
      id: order_id
    }
    app.request(url, params, function(res) {
      //console.log(res)
      if (res.data.code == 0) {
        wx.navigateTo({
          url: "/pages/cardMessage/cardMessage?id=" + order_id
        })
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  daodian(order_id) {
    var that = this
    var url = '/program/order_pay_daodian'
    var params = {
      id: order_id
    }
    app.request(url, params, function(res) {
      //console.log(res)
      if (res.data.code == 0) {
        wx.navigateTo({
          url: "/pages/paySueccess/paySueccess?id=" + order_id
        })
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  huodao(order_id) {
    var that = this
    var url = '/program/order_pay_huodao'
    var params = {
      id: order_id
    }
    app.request(url, params, function(res) {
      //console.log(res)
      if (res.data.code == 0) {
        wx.navigateTo({
          url: "/pages/paySueccess/paySueccess?id=" + order_id
        })
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },
})