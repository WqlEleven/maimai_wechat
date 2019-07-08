// component/userAuth.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    appName: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(e) {
      this.triggerEvent('myGetUserInfo', e.detail)
    },
  }
})