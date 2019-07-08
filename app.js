//app.js
//导入js，常用函数
var common = require('utils/common.js')
//导入js，检查更新
var update = require('utils/update.js')
//导入配置文件
var config = require('config.js')
App({
  onLaunch(options) {
    // Do something initial when launch.
    var that = this

    //配置文件
    that.globalData.config = config

    //初始化
    that.init()

    //获取session_id
    //that.session()
  },

  onShow(options) {
    // Do something when show.
  },

  onHide() {
    // Do something when hide.
  },

  onError(msg) {
    console.log(msg)
  },

  onPageNotFound(res) {
    console.log(res)
  },

  globalData: {
    userInfo: null,
    systemInfo: null,
    config: null,
    session_id: '',
    third_session: ''
  },

  init() {
    console.log('init')
    var that = this

    //系统信息
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        if (res.errMsg == 'getSystemInfo:ok') {
          that.globalData.systemInfo = res
        }
      }
    })
  },

  //获取session_id
  session(func_callback = null) {
    console.log('get session_id')
    var that = this
    var url = '/program/session'
    var params = {}
    that.request(url, params, function(res) {
      console.log('session success')
      //console.log(res.data)
      if (res.data.code == 0) {
        wx.setStorageSync('PHPSESSID', res.data.data.session_id)
        that.globalData.session_id = res.data.data.session_id
        that.login(func_callback)
      } else {
        that.error(res.data.message)
      }
    }, false, true, false)
  },

  //微信登录，设置third_session
  login(func_callback = null) {
    console.log('user login')
    var that = this
    wx.login({
      success: res => {
        if (res.code) {
          var url = '/program/login'
          var params = {
            code: res.code
          }
          that.request(url, params, function(res) {
            console.log('login success')
            //console.log(res.data)
            if (res.data.code == 0) {
              var third_session = res.data.data.third_session
              wx.setStorageSync('third_session', third_session)
              that.globalData.third_session = third_session

              typeof func_callback == 'function' && func_callback()
            } else {
              that.error(res.data.message)
            }
          }, false, false, true)
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function(res) {
        console.log(res)
        console.log('wx.login fail')
      }
    })
  },

  //用户授权
  userAuthorize(func_callback = null) {
    console.log('check authorize')
    var that = this
    // 查看是否授权
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          console.log('scope.userInfo yes')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function(res) {
              //console.log(res)
              //that.userSave(res)
              typeof func_callback == 'function' && func_callback(res)
            }
          })
        } else {
          console.log('scope.userInfo no')
          wx.navigateTo({
            url: '/pages/user/auth/auth',
          })
        }
      }
    })
  },

  //验证用户注册
  checkRegister(func_callback = null) {
    console.log('checkRegister')
    var that = this
    var url = '/program/check_register'
    var params = {}
    that.request(url, params, function(res) {
      console.log('checkRegister success')
      //console.log(res.data)
      if (res.data.code == 0) {
        console.log('register yes')
        //typeof func_callback == 'function' && func_callback()
        that.userUpdate(func_callback)
      } else {
        console.log('register no')
        that.userRegister(func_callback)
      }
    })
  },

  //验证绑定
  checkBind(func_callback = null) {
    console.log('checkBind')
    var that = this
    var url = '/program/check_bind'
    var params = {}
    that.request(url, params, function(res) {
      console.log('checkBind success')
      //console.log(res.data)
      if (res.data.code == 0) {
        console.log('bind yes')
        typeof func_callback == 'function' && func_callback()
      } else if (res.data.code == 1) {
        console.log('register no and bind no')
        that.userRegister(function() {
          that.checkBind(func_callback)
        })
      } else if (res.data.code == 2) {
        console.log('bind no')
        wx.navigateTo({
          url: '/pages/user/bind/bind',
        })
      } else {
        that.error(res.data.message)
      }
    })
  },

  //用户注册
  userRegister(func_callback = null) {
    console.log('userRegister')
    var that = this
    that.userAuthorize(function(res) {
      var url = '/program/user_register'
      var params = {
        encryptedData: res.encryptedData,
        iv: res.iv
      }
      that.request(url, params, function(res) {
        console.log('userRegister success')
        //console.log(res.data)
        if (res.data.code == 0) {
          typeof func_callback == 'function' && func_callback()
        }
      })
    })
  },

  //用户更新
  userUpdate(func_callback = null) {
    console.log('userRegister')
    var that = this
    that.userAuthorize(function(res) {
      var url = '/program/user_update'
      var params = {
        encryptedData: res.encryptedData,
        iv: res.iv
      }
      that.request(url, params, function(res) {
        console.log('userUpdate success')
        //console.log(res.data)
        if (res.data.code == 0) {
          //if (that.userInfoReadyCallback) {
          //  that.userInfoReadyCallback(res)
          //}
          //typeof func_callback == 'function' && func_callback()
        }
        typeof func_callback == 'function' && func_callback()
      })
    })
  },

  //授权
  authorize: function(name, scope, func_callback = null) {
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          if (scope == 'scope.userInfo') {
            that.userAuthorize(func_callback)
          } else {
            wx.authorize({
              scope: scope,
              success: function(res) {
                console.log(res)
                typeof func_callback == 'function' && func_callback()
              },
              fail: function(res) {
                console.log(res)
                that.confirm('提示', '需要授权' + name + '，立即去设置？', function() {
                  console.log('用户点击确定')
                  that.openSetting(name, scope, function() {
                    typeof func_callback == 'function' && func_callback()
                  })
                }, function() {
                  console.log('用户点击取消')
                })
              }
            })
          }
        } else {
          typeof func_callback == 'function' && func_callback()
        }
      }
    })
  },

  //打开设置页
  openSetting(name, scope, func_callback = null) {
    var that = this
    var systemInfo = that.globalData.systemInfo
    if (common.compareVersion(systemInfo.SDKVersion, '2.3.0') > -1) {
      wx.navigateTo({
        url: '/pages/user/setting/setting?name=' + name + '&scope=' + scope
      })
    } else {
      wx.openSetting({
        success: function(res) {
          console.log(res)
          if (res.authSetting[scope]) {
            typeof func_callback == 'function' && func_callback()
          }
        }
      })
    }
  },

  //网络请求
  request(url, params = {}, success_callback = null, need_session = true, need_loading = false, close_loading = false) {
    //console.log(url)
    var that = this
    var session_id = wx.getStorageSync('PHPSESSID')
    var third_session = wx.getStorageSync('third_session')
    if (need_session && (session_id == '' || third_session == '')) {
      that.session(function() {
        that.request(url, params, success_callback, need_session, need_loading, close_loading)
      })
    } else {
      if (need_session) {
        params.third_session = third_session
      }
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
      }
      if (session_id) {
        //header.Cookie = 'PHPSESSID=' + session_id
        header.Cookie = 'ci_session=' + session_id
      }
      need_loading && that.loading()
      wx.request({
        url: config.host + url,
        data: params,
        header: header,
        method: 'POST', //默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function(res) {
          //console.log(res)
          close_loading && that.hide()
          if (res.data.code == -6) {
            that.session(function() {
              that.request(url, params, success_callback, need_session, need_loading, close_loading)
            })
          } else {
            typeof success_callback == 'function' && success_callback(res)
          }
        },
        fail: function(res) {
          console.log(res)
          //console.log('fail')
        },
        complete: function(res) {
          //console.log(res)
          //console.log('complete')
        }
      })
    }
  },

  //成功提示
  success(msg, time = 1500, url = '', urlType = 'redirectTo', navigateBackDelta = 1) {
    var that = this
    wx.showToast({
      title: msg, //提示的内容
      icon: msg.length <= 7 ? 'success' : 'none', //图标，有效值 "success", "loading", "none"
      //image: '/image/success.png',  //自定义图标的本地路径，image 的优先级高于 icon
      duration: time, //提示的延迟时间，单位毫秒，默认：1500
      mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
      success: function(res) { //接口调用成功的回调函数
        //console.log(res)
        if (typeof url == 'function') {
          setTimeout(function() {
            url()
          }, time)
        } else {
          if (url != '' || urlType == 'navigateBack') {
            setTimeout(function() {
              that.jump(url, urlType, navigateBackDelta)
            }, time)
          }
        }
      }
    })
  },

  //错误提示
  error(msg, time = 1500, url = '', urlType = 'redirectTo', navigateBackDelta = 1) {
    var that = this
    wx.showToast({
      title: msg, //提示的内容
      icon: msg.length <= 7 ? '' : 'none', //图标，有效值 "success", "loading", "none"
      image: msg.length <= 7 ? '/images/error.png' : '', //自定义图标的本地路径，image 的优先级高于 icon
      duration: time, //提示的延迟时间，单位毫秒，默认：1500
      mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
      success: function(res) { //接口调用成功的回调函数
        //console.log(res)
        if (typeof url == 'function') {
          setTimeout(function() {
            url()
          }, time)
        } else {
          if (url != '' || urlType == 'navigateBack') {
            setTimeout(function() {
              that.jump(url, urlType, navigateBackDelta)
            }, time)
          }
        }
      }
    })
  },

  //跳转页面
  jump(url, urlType, navigateBackDelta = 1) {
    if (urlType == 'navigateTo') {
      //保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
      wx.navigateTo({
        url: url
      })
    } else if (urlType == 'redirectTo') {
      //关闭当前页面，跳转到应用内的某个页面。
      wx.redirectTo({
        url: url
      })
    } else if (urlType == 'switchTab') {
      //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      wx.switchTab({
        url: url
      })
    } else if (urlType == 'navigateBack') {
      //关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层。
      wx.navigateBack({
        delta: navigateBackDelta
      })
    } else if (urlType == 'reLaunch') {
      //关闭所有页面，打开到应用内的某个页面。
      wx.reLaunch({
        url: url
      })
    }
  },

  //选择提示
  confirm(title = '提示', content = '', func_confirm = null, func_cancel = null) {
    wx.showModal({
      title: title,
      content: content,
      success: function(r) {
        if (r.confirm) {
          typeof func_confirm == 'function' && func_confirm()
        } else if (r.cancel) {
          typeof func_cancel == 'function' && func_cancel()
        }
      }
    })
  },

  // 复制内容
  copy(data, msg = '复制成功') {
    var that = this
    wx.setClipboardData({
      data: data,
      success: function() {
        that.success(msg)
      }
    })
  },

  //关闭提示
  close() {
    wx.hideToast()
  },

  //打开loading
  loading(title = '加载中') {
    wx.showLoading({
      title: title,
      mask: true
    })
  },

  //关闭loading
  hide() {
    wx.hideLoading()
  },

  //定时执行
  setInterval(func, second = 1000) {
    typeof func == 'function' && func()
    var timer = setInterval(function() {
      typeof func == 'function' && func()
    }, second)
    return timer
  },

  //取消定时执行
  clearInterval(timer) {
    clearInterval(timer)
  },

  //页面参数
  params(target, sources) {
    target = target || {}
    sources = sources || {}
    var obj = Object.assign(target, sources);
    var params = Object.keys(obj).map(function(key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    }).join("&");
    return params;
  },

  //页面参数
  decode(options) {
    if (!options) {
      return {}
    }
    var obj = {}
    var params = Object.keys(options).map(function(key) {
      obj[decodeURIComponent(key)] = decodeURIComponent(options[key]);
    });
    return obj;
  }
})