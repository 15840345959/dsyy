var util = require('../../../utils/util.js')
var vm = null
//获取应用实例
var app = getApp()
Page({
  data: {
    title: "我要借阅",  //页面标题
    image:"/images/prompt.png",
    code:"请点击刷新",
    count:"1"
  },
  onLoad: function (options) {
    vm=this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })
    util.showLoading("加载中")
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    //判断用户是否为会员，如果不是，引导用户注册会员
    var level = app.globalData.userInfo.level
    if(level>0)
    {
      vm.getCode()
    }
    else
    {
      wx.navigateTo({
        url: '/pages/member/card/card',
      })
    }
    
  },
  //获取借阅码
  getCode: function () {
    util.showLoading("加载中")
    var token = app.globalData.userInfo.token;
    var param = {
      token: token
    }
    util.createBorrowCode(param, function (ret) {
      console.log("borrow：" + JSON.stringify(ret))
      if (ret.data.code == "200") {
        vm.setData({
          code: ret.data.obj.code
        })
      }
    })
  }
})