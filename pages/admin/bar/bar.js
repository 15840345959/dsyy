var util = require('../../../utils/util.js')
const qiniuUploader = require("../../../utils/qiniuUploader");
var vm = null
//获取应用实例
var app = getApp()
var bar_id=""

var qnToken = ""
// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 华东区
    uptoken: qnToken
  };
  console.log("initQiniu options:" + JSON.stringify(options))
  qiniuUploader.init(options);
}

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
    var picture = vm.data.barInfo.picture
    console.log("更改的书吧图片：" + JSON.stringify(vm.data.barInfo.picture));
    var phonenum = e.detail.value.phonenum == "" ? vm.data.barInfo.phonenum : e.detail.value.phonenum
    var param={
      token: token,
      bar_id: bar_id,
      name: name,
      address: address,
      picture: picture,
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
  },

  editImg: function (e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        console.log("tempFilePaths:" + JSON.stringify(tempFilePaths))
        // var barInfo = vm.data.barInfo
        // barInfo.picture = tempFilePaths
        // vm.setData({
        //   barInfo: barInfo
        // })
        util.showLoading("正在上传")
        var param = {}
        //获取七牛上传token
        util.getQnToken(param, function (res) {
          console.log(JSON.stringify(res));
          if (res.data.result) {
            qnToken = res.data.obj;
            console.log("qiniu upload token:" + qnToken)
            initQiniu();
            //获取token成功后上传图片
            qiniuUploader.upload(tempFilePaths, (res) => {
              console.log("qiniuUploader upload res:" + JSON.stringify(res));
              var picture = util.getImgRealUrl(res.key)
              var barInfo = vm.data.barInfo
              barInfo.picture = picture
              console.log("更改后的书吧信息：" + JSON.stringify(barInfo))
              vm.setData({
                barInfo: barInfo
              })
              util.hideLoading()
              console.log("更改后的书吧信息1：" + JSON.stringify(vm.data.barInfo))
            }, (error) => {
              util.hideLoading()
              console.error('error: ' + JSON.stringify(error));
            })
          }
        }, null);

      }
    })
  },
})