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
      console.log("Logging...")
      wx.login({
        success: function (loginRes) {
          console.log("login done...")
          wx.getUserInfo({
            success: function (res) {
              //console.log(res)
              that.globalData.userInfo = res.userInfo
              that.globalData.userInfo.attendCount = 0
              typeof cb == "function" && cb(that.globalData.userInfo)
              utils.onLogin(loginRes.code, cb)
            }
          })
        },
        fail: function(res) {
          console.log("failed to login: " + res)
          typeof cb == "function" && cb(that.globalData.userInfo)
          wx.showToast({
            title: '登录粗错啦！',
            duration: 2000
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
        url: utils.APP_SETTINGS.VST_URL + '/vst/lecture/?limit=5',
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
  getLatestAnnounce: function(cb) {
    var that = this
    if (this.globalData.announce) {
      typeof cb == "function" && cb(this.globalData.announce)
    } else {
      wx.request({
        url: utils.APP_SETTINGS.VST_URL + '/vst/announce/?limit=1',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.length > 0) {
            that.globalData.announce = res.data[0].content
            typeof cb == "function" && cb(that.globalData.announce)
          }
        }
      })
    }
  },
  getScanCode:function(cbObject) {
    wx.scanCode({
      success: (res) => {
        //console.log(res)
        if (cbObject.success) {
          cbObject.success(res.result)
        }
      },
      fail: (res) => {
        if (cbObject.fail) {
          cbObject.fail(res)
        }
      },
      complete: (res) => {
        if (cbObject.complete) {
          cbObject.complete(res)
        }
      }
    })
  },
  globalData:{
    userInfo:null
  }
})