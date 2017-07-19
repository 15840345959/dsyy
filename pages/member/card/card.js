var util = require('../../../utils/util.js')
var vm = null
//获取应用实例
var token = null
var app = getApp()
Page({
  data: {
    title: "会员充值",  //页面标题
    bg:"",   //图片
    cards:[
      { "level_id": 1, "title": "单本借书卡50元" },
      { "level_id": 2, "title": "三本借书卡100元" }
    ],
    text:"开通会员，立即享受免费借阅特权，如果你无法比阿达自己的想法，大幅度复古风蛋糕分手的分手的分手大师的方式地方立即享受免费借阅特权，如果你无法比立即享受免费借阅特权，如果你无法比",
    level_id:2,
  },
  onLoad: function (options) {
    vm = this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })

    var bg = "http://dsyy.isart.me/bg.png"
    bg = util.qiniuUrlTool(bg, "user_bg")
    console.log(bg)
    vm.setData({
      bg:bg
    })

    token = app.globalData.userInfo.token
  },
  //选择会员类型
  chooseCard:function(e){
    var level_id = e.target.dataset.level
    vm.setData({
      level_id: level_id
    })
  },
  //开通会员
  openMember:function(){
    var param={
      token: token,
      level_id: vm.data.level_id,
    }
    util.wxPrepay(param, function (ret) {
      console.log("wxPrepay："+JSON.stringify(ret))
      if(ret.data.code=="200")
      {
        var obj = ret.data.obj
        console.log("pay param：" + JSON.stringify(obj))
        wx.requestPayment({
          'timeStamp': obj.timeStamp+"",
          'nonceStr': obj.nonceStr,
          'package': obj.package,
          'signType': obj.signType,
          'paySign': obj.paySign,
          'success': function (res) {
            console.log("pay success："+JSON.stringify(res))
            var userInfo = app.globalData.userInfo
            userInfo.level = vm.data.level_id
            app.storeUserInfo(userInfo)  //更新缓存
            wx.navigateTo({
              url: '/pages/member/borrow/borrow',
            })
          },
          'fail': function (res) {
            console.log("pay fail" + JSON.stringify(res))
          }
        })
      }
    })
  }
})