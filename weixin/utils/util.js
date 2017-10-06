
var local = true
var SETTINGS = { 
  VST_URL: 'https://lich2kid.me:8000',
}
if(local == true) {
  SETTINGS.VST_URL = 'http://127.0.0.1:8000'
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function onLogin(jsCode, cb/*used to update page data*/) {
  wx.request({
    url: SETTINGS.VST_URL + '/vst/onlogin',
    header: {
      'content-type': 'application/json'
    },
    data: {
      js_code: jsCode
    },
    success: function (res) {
      var app = getApp()
      //console.log("my openid: " + res.data.openid) //获取openid
      //console.log("my id: " + res.data.id) //获取 user id
      app.globalData.userInfo.id = res.data.id
      app.globalData.userInfo.openid = res.data.openid
      updateUserInfo(app.globalData.userInfo, cb)
    }
  })
}

function updateUserInfo(userInfo, cb) {
  //Update userInfo for server
  wx.request({
    url: SETTINGS.VST_URL + '/vst/attendee/' + userInfo.id + '/',
    header: {
      'content-type': 'application/json'
    },
    method: 'PUT',
    data: {
      nickname: userInfo.nickName,
      avatar_url: userInfo.avatarUrl
    },
    success: function (res) { 
      userInfo.attendCount = res.data.attend_count
      userInfo.onTop = res.data.on_top
      //console.log(res.data)
      typeof cb == "function" && cb(userInfo)
    }
  })
  //Fetch lecture info
  wx.request({
    url: SETTINGS.VST_URL + '/vst/attendee/' + userInfo.id + '/lecture/?limit=5',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      userInfo.lectures = res.data
      typeof cb == "function" && cb(userInfo)
    }
  })

}

module.exports = {
  formatTime: formatTime,
  APP_SETTINGS: SETTINGS,
  onLogin: onLogin,
}
