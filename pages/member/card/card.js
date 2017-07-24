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
    text:"开通会员，立即享受免费借阅特权，充值50元会员卡，每次可免费借书一本，充值100元可同时借书3本，规定时间内归还图书可退会员卡费用",
    level_id:1,
    recommend_id:2,
    showModal:true
  },
  onLoad: function (options) {
    vm = this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })

    var bg = "http://dsyy.isart.me/banner_pay.png"
    bg = util.qiniuUrlTool(bg, "user_bg")
    console.log(bg)
    vm.setData({
      bg:bg
    })

    token = app.globalData.userInfo.token
    //判断是否已经是会员
    var level = app.globalData.userInfo.level
    if(level!=0)
    {
      vm.setData({
        showModal: false
      })
    }
  },
  //选择会员类型
  chooseCard:function(e){
    var level_id = e.target.dataset.level
    vm.setData({
      level_id: level_id
    })
  },
  //确认充值
  recharge:function(){
    var level_id = vm.data.level_id
    wx.navigateTo({
      url: '/pages/member/recharge/recharge?levelid=' + level_id,
    })
  },
  //开通会员
  clickOpen:function(){
    vm.setData({
      showModal: false
    })
  },
  //不开通会员
  clickClose:function(){
    wx.navigateBack({
      delta:2
    })
  }
})