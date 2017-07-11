var util = require('../../../utils/util.js')
var vm = null
//获取应用实例
var app = getApp()
Page({
  data: {
    title: "我要借阅",  //页面标题
    image:"/images/prompt.png",
    code:"",
    count:"1"
  },
  onLoad: function (options) {
    vm=this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })
    vm.getCode()
  },
  //获取借阅码
  getCode:function(){
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