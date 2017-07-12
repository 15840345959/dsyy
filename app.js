//app.js
const util = require('./utils/util.js')

var vm = null

App({
  onLaunch: function () {
    //获取vm
    vm = this
    //获取用户缓存数据
    var userInfo = wx.getStorageSync("userInfo");
    console.log("local storage userInfo:" + JSON.stringify(userInfo));
    //如果没有缓存
    if (userInfo == null || userInfo == undefined || userInfo == "") {
      //调用登录接口
      vm.login(null);
    } else {
      vm.globalData.userInfo = wx.getStorageSync("userInfo");
      console.log("vm.globalData.userInfo:" + JSON.stringify(vm.globalData.userInfo));
    }
  },
  login: function (callBack) {

    wx.login({
      success: function (res) {
        console.log("wx.login:" + JSON.stringify(res));
        if (res.code) {
          util.getOpenId({ code: res.code }, function (ret) {
            console.log("getOpenId:" + JSON.stringify(ret));
            var openId = ret.data.openid;
            //获取用户基本信息
            wx.getUserInfo({
              success: function (res) {
                console.log("wx.getUserInfo success:" + JSON.stringify(res));
                var param = {
                  nick_name: res.userInfo.nickName,
                  avatar: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender,
                  wx_id: openId
                }
                util.login(param, function (ret) {
                  console.log("login:" + JSON.stringify(ret));
                  vm.storeUserInfo(ret.data.obj);
                }, null);
              },
              fail: function (res) {
                console.log("wx.getUserInfo fail:" + JSON.stringify(res));
                var param = {
                  nick_name: "匿名",
                  wx_id: openId
                }
                util.login(param, function (ret) {
                  console.log("login:" + JSON.stringify(ret));
                  vm.storeUserInfo(ret.data.obj);
                }, null);
              },
              complete: function (res) {
                console.log("wx.getUserInfo complete:" + JSON.stringify(res));
              }
            })
          }, null);
        }
      }
    })
  },
  storeUserInfo: function (obj) {
    console.log("storeUserInfo :" + JSON.stringify(obj));
    wx.setStorage({
      key: "userInfo",
      data: obj
    });
    vm.globalData.userInfo = obj;
  },
  getUserInfo: function (cb) {
    typeof cb == "function" && cb(vm.globalData.userInfo)
  },
  getSystemInfo: function (cb) {

    if (vm.globalData.systemInfo) {
      typeof cb == "function" && cb(vm.globalData.systemInfo)
    } else {
      wx.getSystemInfo({
        success: function (res) {
          vm.globalData.systemInfo = res
          typeof cb == "function" && cb(vm.globalData.systemInfo)
        }
      })
    }
  },
  //如果是书吧管理员判断并选择书吧
  getBarId: function () {
    var param = {}
    util.getBarListByUserId(param, function (ret) {
      console.log("书吧：" + JSON.stringify(ret))
      var barInfo_id = []
      var barInfo_name = []
      if (ret.data.code == "200") {
        console.log(ret.data.obj.length)
        if (ret.data.obj.length > 0) {
          if (ret.data.obj.length > 1) {
            for (var i = 0; i < ret.data.obj.length; i++) {
              barInfo_id[i] = ret.data.obj[i].barInfo.id
              barInfo_name[i] = ret.data.obj[i].barInfo.name
            }
            console.log("barInfo_id：" + JSON.stringify(barInfo_id))
            console.log("barInfo_name：" + JSON.stringify(barInfo_name))
            //选择书吧
            wx.showActionSheet({
              itemList: barInfo_name,
              success: function (res) {
                console.log("res: " + JSON.stringify(res))
                console.log(res.tapIndex)
                if (res.cancel) {
                  vm.globalData.barDetail.barid = ret.data.obj[0].barInfo.id
                  vm.globalData.barDetail.barname = ret.data.obj[0].barInfo.name
                  console.log("barDetail" + JSON.stringify(vm.globalData.barDetail))
                }
                else {
                  var bar_id = barInfo_id[res.tapIndex]
                  var bar_name = barInfo_name[res.tapIndex]
                  vm.globalData.barDetail.barid = bar_id
                  vm.globalData.barDetail.barname = bar_name
                  console.log("barDetail" + JSON.stringify(vm.globalData.barDetail))
                }
              },
              fail: function (res) {
                vm.globalData.barDetail.barid = ret.data.obj[0].barInfo.id
                vm.globalData.barDetail.barname = ret.data.obj[0].barInfo.name
                console.log("barDetail" + JSON.stringify(vm.globalData.barDetail))
              }
            })
          }
          else {
            vm.globalData.barDetail.barid = ret.data.obj[0].barInfo.id
            vm.globalData.barDetail.barname = ret.data.obj[0].barInfo.name
            console.log("barDetail" + JSON.stringify(vm.globalData.barDetail))
          }
        }
      }
    })
  },
  //全局变量
  globalData: {
    userInfo: null,
    systemInfo: null,
    bookTypeArr: ['儿童读物', '历史文化', '文学小说', '考试教育', '医疗养生', '心灵鸡汤'],
    barDetail: {
      barid:"",
      barname:""
    }
  }
})