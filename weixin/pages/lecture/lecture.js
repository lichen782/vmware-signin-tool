// pages/lecture.js
var utils = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../images/no-star.png',
    selectedSrc: '../images/full-star.png',
    halfSrc: '../images/half-star.png',
    key: 0, //score,
    comment: "",
    submitLoadingHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      lectureInfo: {
        id: options.lid,
        room: options.room,
        scheduled_date: options.scheduled_date,
        teacher_name: options.teacher_name,
        title: options.title
      }
    })
    //Load comments, if any
    var aid = app.globalData.userInfo.id
    var lid = options.lid
    var that = this
    wx.request({
      url: utils.APP_SETTINGS.VST_URL + '/vst/attendee/' + aid + "/lecture/" + lid + '/review/',
      success: function(res) {
        console.log(res.data)
        that.setData({
          rid: res.data[0].id,
          key: res.data[0].score,
          comment: res.data[0].comment,
        })
      }
    })
  },

  selectLeft: function (e) {
    //console.log('select left...')
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      key = 0;
    }
    this.setData({
      key: key
    })
  },

  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  },

  commentInput: function(e) {
    this.setData({
      comment: e.detail.value
    }) 
  }, 

  startRating: function(e) {
    var that = this
    this.setData({
        submitLoadingHidden: false
      }
    )
    wx.request({
      url: utils.APP_SETTINGS.VST_URL + '/vst/review/' + this.data.rid + '/',
      method: 'PUT',
      data: {
        score: this.data.key,
        comment: this.data.comment,
      },
      complete: function (res) {
        that.setData({
          submitLoadingHidden: true
        })
        wx.navigateBack()
      }
    })
  },

  toHome: function(e) {
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