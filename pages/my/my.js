//index.js
//获取应用实例
var app = getApp()
Page({
  data: {

  },
  //事件处理函数
  clickCreateBook: function () {
    wx.navigateTo({
      url: '/pages/admin/cbook/cbook'
    })
  },
  onLoad: function () {
    console.log('onLoad')

  }
})
