var util = require('../../utils/util.js')
var vm = null
//获取应用实例
var app = getApp()
Page({
  data: {
    title : "资料修改",
    user_name:"",
    passwd:"",
    avatar:"",
    phonenum:"",
    gender: "",
    type: ""
  },
  onLoad: function (options) {
    vm=this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })
    util.showLoading('加载数据');   //加载数据
    var nick_name = app.globalData.userInfo.nick_name;  //获取昵称
    var passwd = app.globalData.userInfo.passwd;  //获取密码
    var avatar = app.globalData.userInfo.avatar;    //获取头像
    var phonenum = app.globalData.userInfo.phonenum;  //获取电话
    var gender = app.globalData.userInfo.gender;    //获取性别
    var type = app.globalData.userInfo.type;    //
    vm.setData({
      nick_name: nick_name,
      avatar: avatar,
      phonenum: phonenum,
      gender: gender
    })
    //结束加载
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },

  //更改用户头像
  editImg:function(e){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },

  //更改用户信息
  editInfo:function(e){
    console.log(JSON.stringify(e))
    var edit_field = e.currentTarget.dataset.field
    console.log("field：" + edit_field)
    var nick_name = edit_field == "nick_name" ? e.detail.value : vm.data.nick_name    //判断更改的是否是姓名字段，如果是赋新值
    var phonenum = edit_field == "phonenum" ? e.detail.value : vm.data.phonenum  //判断更改的是否是电话字段，如果是赋新值
    phonenum = phonenum == "" ? "" : phonenum
    var gender = (edit_field == "gender" ? e.detail.value : vm.data.gender)=="男"?1:2  //判断更改的是否是性别字段，如果是赋新值
    var passwd = vm.data.passwd
    var avatar = vm.data.avatar
    var type = vm.data.type == "" ? "" : vm.data.type
    var token = app.globalData.userInfo.token
    vm.setData({
      nick_name: nick_name,
      phonenum: phonenum,
      gender: gender
    })
    nick_name == "" ? "匿名" : nick_name
    var param={
      nick_name: nick_name,
      passwd: passwd,
      avatar: avatar,
      phonenum: phonenum,
      gender: gender,
      type: type,
      token: token
    }
    console.log(JSON.stringify(param))
    util.updateUserInfo(param,function(ret){
      console.log("更新用户信息："+JSON.stringify(ret))
    })
  }
})