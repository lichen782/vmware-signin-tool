//index.js
//获取应用实例
var utils = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    motto: '',
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    recentLectures: [],
    userInfo: {
      lectures: [],
      attendCount: 0,
      onTop: -1
    },
    loadingHidden: true,
    announce: '签到有大奖等你拿哟^_^',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeSize: 14,
    marqueeOrientation: 'left',//滚动方向
    marqueeInterval: 13 // 时间间隔
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
    this.setMarquee()
    this.updateAllData() 
  },
  btn_primary: function () {
    var that = this
    that.setData({
      loadingHidden: false
    })
    app.getScanCode({
      success: function(res) {
        //console.log(res)
        wx.request({
          url: utils.APP_SETTINGS.VST_URL + '/vst/onqrcode?code=' + res + '&aid=' + app.globalData.userInfo.id,
          success: function(resLect) {
            console.log(resLect)
            if (resLect.statusCode != 200) {
              wx.showToast({
                title: '粗错啦！',
                duration: 2000
              })
            } else {
              var lecture = resLect.data
              that.goLecturePage(lecture)
            }
          },
          fail: function() {
            wx.showToast({
              title: '粗错啦！',
              duration: 2000
            })
          },
          complete: function() {
            that.setData({
              loadingHidden: true
            })
          }
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '马不对！',
          duration: 2000
        })
      },
      complete: function(res) {
        that.setData({
          loadingHidden: true
        })
      }
    })
  },
  goranking: function () {
    wx.navigateTo({
      url: '../ranking/ranking'
    })
  },
  goLecturePage: function(lecture) {
    wx.navigateTo({
      url: '../lecture/lecture?lid=' + lecture.id + '&title=' + lecture.title + '&teacher_name=' + lecture.teacher_name + '&scheduled_date=' + lecture.scheduled_date + "&room=" + lecture.room
    })
  },
  onLectureDetail: function (event) {
    var lecture = event.currentTarget.dataset.lecture
    this.goLecturePage(lecture)
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
  },

  updateAllData: function () {
    var that = this
    this.setData({
      loadingHidden: false
    })
    app.globalData.userInfo = null
    app.globalData.recentLectures = null
    app.globalData.announce = null
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        loadingHidden: true
      })
    })

    app.getRecentLectures(function (lectures) {
      that.setData({
        recentLectures: lectures
      })
    })

    app.getLatestAnnounce(function (announce) {
      that.setData({
        announce: announce
      })
    })
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
    this.updateAllData()
  },

  setMarquee: function() {
    var vm = this;
    var length = vm.data.announce.length * vm.data.marqueeSize;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    vm.setData({
      marqueeLength: length,
      windowWidth: windowWidth,
    });
    vm.runAnnounce();// 水平一行字滚动完了再按照原来的方向滚动
  },

  runAnnounce: function () {
    var vm = this;
    var interval = setInterval(function () {
      if (-vm.data.marqueeDistance < vm.data.marqueeLength) {
        vm.setData({
          marqueeDistance: vm.data.marqueeDistance - vm.data.marqueePace,
        });
      } else {
        clearInterval(interval);
        vm.setData({
          marqueeDistance: vm.data.windowWidth
        });
        vm.runAnnounce();
      }
    }, vm.data.marqueeInterval);
  },

})
