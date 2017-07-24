var util = require('../../../utils/util.js')
var vm = null
var money=""
//获取应用实例
var app = getApp()
Page({
  data: {
    title: "我要退卡",  //页面标题
    bg: "",   //背景
    money: "",
    showModal:false,
    show:true
  },
  onLoad: function () {
    vm = this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })
    var bg = "http://dsyy.isart.me/bg_member.png"
    bg = util.qiniuUrlTool(bg, "user_bg")
    vm.setData({
      bg: bg,
    })
    //对升级会员进行判断
    var level_id = app.globalData.userInfo.level;
    if (level_id == 0) {
      money="0"
    }
    else if (level_id == 1) {
      money="50"
    }
    else {
      money = "100"
    }
    vm.setData({
      money:money
    })
  },
  //跳转页面
  apply: function () {
    vm.setData({
      showModal: true
    })
  },
  //点击继续用
  clickRetain:function(){
    vm.setData({
      showModal: false
    })
  },
  clickCancellation:function(){
    vm.setData({
      show: false
    })
  },
  //退卡完成
  complete: function () {
    wx.navigateBack({
      delta: 2
    })
  }
})
