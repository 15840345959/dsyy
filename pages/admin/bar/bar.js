var util = require('../../../utils/util.js')
var vm = null
//获取应用实例
var app = getApp()
var bar_id=""
Page({
  data: {
    title: "书吧管理",
    barInfo: [],
    toastHidden: true,
    notice_str: ""
  },
  onLoad: function (options) {
    vm = this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })
    bar_id = app.globalData.barDetail.barid
    // bar_id=2 //测试
    var param={
      start:0,
      num:0,
      bar_id: bar_id
    }
    util.getBarPageByBarId(param,function(ret){
      console.log("bar :"+JSON.stringify(ret))
      if(ret.data.code=="200")
      {
        vm.setData({
          barInfo: ret.data.obj.barInfo
        })
      }
    })
  },
  formSubmit:function(e){
    console.log("from ：" + JSON.stringify(e.detail.value))
    var token = app.globalData.userInfo.token
    var name = e.detail.value.name == "" ? vm.data.barInfo.name : e.detail.value.name
    var address = e.detail.value.address == "" ? vm.data.barInfo.address : e.detail.value.address
    var phonenum = e.detail.value.phonenum == "" ? vm.data.barInfo.phonenum : e.detail.value.phonenum
    var param={
      token: token,
      bar_id: bar_id,
      name: name,
      address: address,
      phonenum: phonenum
    }
    util.updateBarInfo(param,function(ret){
      console.log(JSON.stringify(ret))
      if(ret.data.code=="200")
      {
        vm.setData({
          toastHidden: false,
          notice_str: "提交成功"
        })
      }
    })
  },
  toastChange: function (e) {
    vm.setData({
      toastHidden: true,
      notice_str: ""
    })
  }
})