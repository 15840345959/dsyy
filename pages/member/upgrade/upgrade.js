var util = require('../../../utils/util.js')
var vm = null
//获取应用实例
var token = null
var app = getApp()
Page({
  data: {
    title: "会员升级",  //页面标题
    bg: "",   //图片
    userInfo:[],
    level_id:"",
    current_level:"",  //当前等级(大写)
    future_level:"",   //未来等级（大写）
    current_level_image:"",  //当前等级的图片
    current_count: "",  //当前可借阅数目
    future_count: "",  //未来可借阅数目
    upgrade_money:""  //升级金额
  },
  onLoad: function (options) {
    vm = this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })

    var bg = "http://dsyy.isart.me/banner_pay.png"
    bg = util.qiniuUrlTool(bg, "user_bg")
    console.log(bg)
    vm.setData({
      bg: bg,
      level_id: app.globalData.userInfo.level,
      userInfo: app.globalData.userInfo,
    })

    token = app.globalData.userInfo.token

    var level_id = app.globalData.userInfo.level
    if(level_id==1)
    {
      vm.setData({
        current_level: "一",  //当前等级(大写)
        future_level: "二",  //未来等级（大写）
        current_level_image: "/images/level_one.png",  //当前等级的图片
        current_count: 1,  //当前可借阅数目
        future_count: 3,  //未来可借阅数目
        upgrade_money: 100  //升级金额
      })
    }
    else
    {
      vm.setData({
        current_level: "二",  //当前等级(大写)
        current_level_image: "/images/level_two.png"  //当前等级的图片
      })
    }
  },
  //确认充值
  recharge: function () {
    var level_id = vm.data.level_id+1
    wx.navigateTo({
      url: '/pages/member/recharge/recharge?levelid=' + level_id,
    })
  }
})