
var local = true
var SETTINGS = { 
  VST_URL: 'http://lich2kid.me:8000',
  MY_OPENID: undefined
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

function onLogin(jsCode) {
  wx.request({
    url: SETTINGS.VST_URL + '/vst/onlogin',
    header: {
      'content-type': 'application/json'
    },
    data: {
      js_code: jsCode
    },
    success: function (res) {
      console.log("my openid: " + res.data.openid) //获取openid  
      SETTINGS.MY_OPENID = res.data.openid
    }
  })
}

module.exports = {
  formatTime: formatTime,
  APP_SETTINGS: SETTINGS,
  onLogin: onLogin,
}
