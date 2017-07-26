var util = require('../../../utils/util.js')
var vm = null
//获取应用实例
var token = null
var level_id = 0
var app = getApp()
Page({
  data: {
    title: "确认支付",  //标题
    money: "",  //确认金额
    show: true
  },
  onLoad: function (options) {
    if (util.judgeIsAnyNullStr(options.levelid)) {
      return;
    }
    vm = this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })
    level_id = options.levelid
    token = app.globalData.userInfo.token
    console.log("level_id：" + level_id)
    if (level_id == 1) {
      vm.setData({
        money: "50.00"
      })
    }
    else {
      vm.setData({
        money: "100.00"
      })
    }
  },
  openMember: function () {
    var param = {
      token: token,
      level_id: level_id,
    }
    util.wxPrepay(param, function (ret) {
      console.log("wxPrepay：" + JSON.stringify(ret))
      if (ret.data.code == "200") {
        var obj = ret.data.obj
        console.log("pay param：" + JSON.stringify(obj))
        wx.requestPayment({
          'timeStamp': obj.timeStamp + "",
          'nonceStr': obj.nonceStr,
          'package': obj.package,
          'signType': obj.signType,
          'paySign': obj.paySign,
          'success': function (res) {
            console.log("pay success：" + JSON.stringify(res))
            var userInfo = app.globalData.userInfo
            userInfo.level = level_id
            app.storeUserInfo(userInfo)  //更新缓存
            console.log("更新缓存：" + JSON.stringify(app.globalData.userInfo))
            vm.setData({
              show: false
            })
          },
          'fail': function (res) {
            console.log("pay fail" + JSON.stringify(res))
          }
        })
      }
    })
  },
  borrowBook: function () {
    wx.navigateTo({
      url: '/pages/member/borrow/borrow',
    })
  }
})