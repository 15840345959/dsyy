//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  getLocation: function (e) {
    wx.getLocation({
      success: function (res) {
        console.log(JSON.stringify(res))
      },
    })
  },
  chooseLocation: function (e) {
    wx.chooseLocation({
      success: function (res) {
        console.log(JSON.stringify(res))
      },
    })
  },
  chooseShouhuo: function (e) {
    wx.chooseAddress({

    })
  },
  openLocation:function(e){
    wx.openLocation({
      latitude: '41.835436',
      longitude: '123.429105',
    })
  }
})
