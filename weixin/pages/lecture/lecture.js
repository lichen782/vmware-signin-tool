// pages/lecture.js
var utils = require('../../utils/util.js')
var app = getApp()
var doommList = [];
var doommCnt = 0;//用做唯一的wx: key
var page = undefined;
class Doomm {
  constructor(text, top, time, color) {
    this.text = text + doommCnt;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    let that = this;
    this.id = doommCnt++;
    setTimeout(function () {
      doommList.splice(doommList.indexOf(that), 1);//动画完成，从列表中移除这项
      page.setData({
        doommData: doommList
      })
    }, this.time * 1000)//定时器动画完成后执行。
  }
}
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
    doommData: [],
  },

  loadReviews: function (lid) {
    doommCnt = 0;
    doommList = []
    this.setData({
      doommData: []
    })
    var that = this
    wx.request({
      url: utils.APP_SETTINGS.VST_URL + '/vst/lecture/' + lid + '/review/',
      success: function(res) {
         if (res.statusCode == 200) {
           var reviews = res.data
           reviews.forEach(function (review) {
             doommList.push(new Doomm(review.comment,
               Math.ceil(Math.random() * 100),
               Math.ceil(Math.random() * 10),
               utils.getRandomColor()));
           })
           that.setData({
             doommData: doommList
           })
         }
         
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = this;
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
    //Load all comments, if could
    this.loadReviews(options.lid)
    //Load comments, if any
    var aid = app.globalData.userInfo.id
    var lid = options.lid
    var that = this
    wx.request({
      url: utils.APP_SETTINGS.VST_URL + '/vst/attendee/' + aid + "/lecture/" + lid + '/review/',
      success: function(res) {
        if (res.statusCode != 200) {
          wx.showToast({
            title: '粗错啦！',
            duration: 2000
          })
          that.toHome()
        } else {
          that.setData({
            rid: res.data[0].id,
            key: res.data[0].score,
            comment: res.data[0].comment,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '粗错啦！',
          duration: 2000
        })
        that.toHome()
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
        wx.navigateTo({
          url: '/pages/index/index',
        })
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