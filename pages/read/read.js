//index.js
//获取应用实例
var app = getApp()
Page({
  data: {

  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e))
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  onLoad: function () {
    console.log('onLoad')

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
  openLocation: function (e) {
    wx.openLocation({
      latitude: '41.835436',
      longitude: '123.429105',
    })
  }
})
