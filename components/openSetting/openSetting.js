// component/openSetting/openSetting.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    authName: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    openSetting(e) {
      this.triggerEvent('openSetting', e.detail)
    }
  }
})