//app.js
var utils = require('utils/util.js')
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (loginRes) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo
              that.globalData.userInfo.attendCount = 0
              typeof cb == "function" && cb(that.globalData.userInfo)
              utils.onLogin(loginRes.code, cb)
            }
          })
        }
      })
    }
  },
  getRecentLectures: function(cb) {
    var that = this
    if (this.globalData.recentLectures) {
      typeof cb == "function" && cb(this.globalData.recentLectures)
    } else {
      wx.request({
        url: utils.APP_SETTINGS.VST_URL + '/vst/lecture/',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.globalData.recentLectures = res.data
          typeof cb == "function" && cb(that.globalData.recentLectures)
        }
      })
    }
  },
  getScanCode:function(cb) {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        cb(res.result)
      }
    })
  },
  globalData:{
    userInfo:null
  }
})