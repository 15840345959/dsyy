var util = require('../../utils/util.js')
const qiniuUploader = require("../../utils/qiniuUploader");
var vm = null
//获取应用实例
var app = getApp()
Page({
  data: {
    title : "资料修改",
    nick_name : "",
    avatar:"",
    phonenum:"",
    gender: "",
    type: 0,
    toastHidden: true,
    notice_str: ""
  },
  onLoad: function (options) {
    vm=this
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })
    util.showLoading('加载数据');   //加载数据
    var nick_name = app.globalData.userInfo.nick_name;  //获取昵称
    var avatar = app.globalData.userInfo.avatar;    //获取头像
    var phonenum = app.globalData.userInfo.phonenum;  //获取电话
    var gender = app.globalData.userInfo.gender;    //获取性别
    var type = app.globalData.userInfo.type;    //
    vm.setData({
      nick_name: nick_name,
      avatar: avatar,
      phonenum: phonenum,
      gender: gender,
      type: type
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
  formSubmit: function (e) {
    console.log('form submit：', e.detail.value)
    var nick_name = e.detail.value.nick_name == "" ? vm.data.nick_name : e.detail.value.nick_name
    nick_name == "" ? "匿名" : nick_name
    var phonenum = e.detail.value.phonenum == "" ? vm.data.phonenum : e.detail.value.phonenum
    var gender = e.detail.value.gender == "" ? vm.data.gender : e.detail.value.gender
    gender = gender=="男"?"1":"2"
    var avatar = vm.data.avatar
    // console.log(avatar)
    // console.log(util.isLocalImg(avatar))
    // if(util.isLocalImg(avatar))
    // {
      qiniuUploader.upload(vm.data.avatar, (res) => {
        console.log("qiniuUploader upload res:" + JSON.stringify(res));
        avatar = util.getImgRealUrl(res.key)
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      })
    // }
    var type = vm.data.type == "" ? "" : vm.data.type
    var token = app.globalData.userInfo.token
    vm.setData({
      nick_name: nick_name,
      phonenum: phonenum,
      gender: gender
    })
    var param = {
      nick_name: nick_name,
      avatar: avatar,
      phonenum: phonenum,
      gender: gender,
      type: type,
      token: token
    }
    console.log(JSON.stringify(param))
    util.updateUserInfo(param, function (ret) {
      console.log("更新用户信息：" + JSON.stringify(ret))
      if(ret.data.code=="200")
      {
        var userInfo = app.globalData.userInfo
        console.log("获取缓存：" + JSON.stringify(userInfo))
        userInfo.nick_name = vm.data.nick_name
        userInfo.avatar = vm.data.avatar
        userInfo.phonenum = vm.data.phonenum
        userInfo.gender = vm.data.gender
        userInfo.type = vm.data.type
        userInfo.token = vm.data.token
        app.globalData.userInfo = userInfo
        console.log("new userInfo：" + JSON.stringify(app.globalData.userInfo))   
        vm.setData({
          toastHidden: false,
          notice_str: "提交成功"
        })
      }
    })

  },
  //更改头像
  changePhoto: function(e){
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log("tempFilePaths：" + tempFilePaths)
        vm.setData({
          avatar: tempFilePaths
        })
      }
    })
  },
  toastChange: function (e) {
    vm.setData({
      toastHidden: true,
      notice_str: ""
    })
  },
})