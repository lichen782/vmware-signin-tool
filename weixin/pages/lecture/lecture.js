// pages/lecture.js
var count = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../images/no-star.png',
    selectedSrc: '../images/full-star.png',
    halfSrc: '../images/half-star.png',
    key: 0, //score
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  selectLeft: function (e) {
    console.log('select left...')
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      key = 0;
    }
    count = key
    this.setData({
      key: key
    })
  },

  selectRight: function (e) {
    console.log('select right...')
    var key = e.currentTarget.dataset.key
    count = key
    this.setData({
      key: key
    })
  },

  startRating: function(e) {
    wx.showModal({
      title: "分数",
      content: "" + count,
      success: function(res) {
        if(res.confirm) {
          console.log('用户点击确定')
        }
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