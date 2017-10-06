// pages/ranking.js
var utils = require('../../utils/util.js')
var RCOUNT = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true,
    firstAttendee: {
      nickname: '',
      avatar_url: '../images/default_head.png',
    },
    attendeeList: [],
    emptyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankings()
  },

  getRankings: function() {
    var that = this
    this.setData({
      loadingHidden: false
    })
    wx.request({
      url: utils.APP_SETTINGS.VST_URL + '/vst/ranking/?limit=' + RCOUNT,
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showToast({
            title: '粗错啦！',
            duration: 2000
          })
          that.goHome()
        } else {
          var firstAttendee = res.data[0]
          if (firstAttendee.attend_count == 0) {
            firstAttendee.attend_count = 1
          }
          var emptyList = []
          for (var n = res.data.length; n < RCOUNT; n++) {
            emptyList[n - res.data.length] = {
              on_top: n + 1,
              nickname: "虚位以待",
              attend_count: 0,
              avatar_url: "../images/default_head.png"
            }
          }
          that.setData({
            firstAttendee: firstAttendee,
            attendeeList: res.data,
            emptyList: emptyList
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '粗错啦！',
          duration: 2000
        })
        that.goHome()
      },
      complete: function() {
        that.setData({
          loadingHidden: true
        })
      }
    })
  },

  goHome: function() {
    wx.navigateBack()
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
  
  }
})