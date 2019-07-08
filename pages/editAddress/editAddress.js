// pages/editAddress/editAddress.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    info: {},
    region: ['省', '市', '县']
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
    wx.hideShareMenu()
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
    var url = '/program/address_info'
    var params = {
      id: that.data.id
    }
    app.request(url, params, function (res) {
      //console.log(res.data)
      if (res.data.code == 0) {
        var info = res.data.data.info
        that.setData({
          info: info,
          region: [info.province, info.city, info.country]
        })
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  // 选择地区
  bindRegionChange(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  //提交表单
  formSubmit(e) {
    //console.log('form submit')
    console.log(e)
    var that = this
    var form_id = e.detail.formId
    var form_data = e.detail.value

    if (form_data.name == '') {
      app.error('请填写姓名')
      return
    }
    if (form_data.mobile == '') {
      app.error('请填写手机号码')
      return
    }
    if (!/^1[3|4|5|7|8]\d{9}$/.test(form_data.mobile)) {
      app.error('手机号码格式不正确')
      return
    }
    if (that.data.region.length > 0) {
      if (that.data.region[0] == '省' || that.data.region[1] == '市' || that.data.region[2] == '县') {
        app.error('请填选择地区')
        return
      }
      form_data.province = that.data.region[0]
      form_data.city = that.data.region[1]
      form_data.country = that.data.region[2]
    } else {
      app.error('请填选择地区')
      return
    }
    if (form_data.address == '') {
      app.error('请填写详细地址')
      return    
    }

    var url = '/program/address_edit'
    var params = form_data
    params.id = that.data.id
    app.request(url, params, function (res) {
      //console.log(res)
      if (res.data.code == 0) {
        app.success('修改成功', 1500, '', 'navigateBack')
      } else {
        app.error(res.data.message)
      }
    }, true, true, true)
  },

  //表单重置
  formReset() {
    console.log('form reset')
  },
})