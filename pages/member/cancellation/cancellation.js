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
    show:true,
    count:0  //判断有多少本未还图书
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
    //对会员等级进行判断
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

    vm.judge()  //判断会员是否有未还的书
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
  },
  //判断会员是否有未还的书
  judge:function(){
    var param={}
    util.getDetailBorrowInfoByUserId(param, function (ret) {
      console.log("历史借阅：" + JSON.stringify(ret))
      if (ret.data.code = "200")
      {
        var bookInfos = ret.data.obj
        var count=0
        for (var i = 0; i < bookInfos.length; i++) {
          var status=bookInfos[i].borrowInfo.status
          if (status==0)
          {
            count++
          }
        }
        vm.setData({
          count:count
        })
      }
    })
  }
})
