//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '',
    scanResult: '',
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    recentLectures: [],
    userInfo: {
      lectures: [],
      attendCount: 0,
      onTop: -1
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })

    app.getRecentLectures(function(lectures) {
      that.setData({
        recentLectures: lectures
      })
    })
    
  },
  btn_primary: function () {
    var that = this
    app.getScanCode(function (res) {
      that.setData({
        scanResult: res
      })
    })
  },
  goranking: function () {
    wx.navigateTo({
      url: '../ranking/ranking'
    })
  },
  onLectureDetail: function () {
    wx.navigateTo({
      url: '../lecture/lecture'
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})
