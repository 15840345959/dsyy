var util = require('../../utils/util.js')

//获取应用实例
var app = getApp()

var vm = null

//图书列表相关加载参数
var start_o = 0
var num_o = 12
var loading_flag_o = false

//书吧列表相关加载参数
var start_a = 0
var num_a = 12
var loading_flag_a = false

Page({
  data: {
    navbar: ['推荐', '图书', '书吧'],
    currentNavbar: '0',
    systemInfo: {},
    swipers: [],  //广告图信息
    indexPage: {},  //首页数据
    bookInfos: [], //图书列表
    barInfos: [], //书吧列表
    lat:0,
    lon:0
  },
  //加载
  onLoad: function () {
    console.log('onLoad')
    vm = this
    //初始化sysInfo
    app.getSystemInfo(function (res) {
      console.log("getSystemInfo:" + JSON.stringify(res));
      vm.setData({
        systemInfo: res
      })
    })
    //获取广告轮播图
    vm.setADSwiper()
    //获取首页作品数据
    vm.getIndexPage()
  },
  //切换tab
  swichNav(e) {
    console.log("swichNav e:" + JSON.stringify(e))
    console.log("currentNavbar:" + JSON.stringify(vm.data.currentNavbar))
    //判断是否点击了当前的nav
    if (vm.data.currentNavbar == e.currentTarget.dataset.idx) {
      return;
    }
    vm.setData({
      currentNavbar: e.currentTarget.dataset.idx,
    })
    //如果没有数据，则需要加载
    if (vm.needLoadNewDataAfterSwiper()) {
      vm.loadMoreDatas()
    }
  },
  //获取广告图片
  setADSwiper: function () {
    util.getADs({}, function (ret) {
      console.log("getADs:" + JSON.stringify(ret));
      if (ret.data.code == "200") {
        var msgObj = ret.data.obj;
        for (var i = 0; i < msgObj.length; i++) {
          msgObj[i].img = util.qiniuUrlTool(msgObj[i].img, "top_ad")
        }
        vm.setData({
          swipers: msgObj
        });
      }
    }, null);
  },
  //获取首页数据
  getIndexPage: function (e) {
    console.log(JSON.stringify(e))
    var param = {}
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        vm.setData({
          lat: longitude,
          lon: latitude
        })
        param={
          lat: longitude,
          lon: latitude
        }
        console.log(JSON.stringify(param))
        util.showLoading("加载首页");
        util.getIndexPage(param, function (ret) {
          console.log(JSON.stringify(ret))
          if (ret.data.code == "200") {
            //整理书吧图片
            vm.setDataWithRes(0, ret.data.obj)

          } else {

          }
        })
      }
    })
  },
  //获取图书列表
  getBookInfos: function (e) {
    var param = {
      start: start_o,
      num: num_o,
      con: "normal"
    }
    if (loading_flag_o) {
      return;
    }
    loading_flag_o = true //避免下拉时重复加载
    console.log(JSON.stringify(param))
    //如果为零属于重新加载
    if (vm.data.bookInfos.length == 0) {
      util.showLoading('加载图书');
    }
    //进行图书加载
    util.getBookObjByCon(param, function (ret) {
      if (ret.data.code == "200") {
        vm.setDataWithRes(1, ret.data.obj)
        start_o = start_o + num_o
        loading_flag_o = false  //避免下拉时重复加载
      }
    })
  },
  //获取书吧列表
  getBarInfoByPos: function (e) {
    var param = {
      start: start_a,
      num: num_a,
      lat: vm.data.lat,
      lon: vm.data.lon
    }
    if (loading_flag_a) {
      return;
    }
    loading_flag_a = true //避免下拉时重复加载
    console.log(JSON.stringify(param))
    //如果为零属于重新加载
    if (vm.data.barInfos.length == 0) {
      util.showLoading('加载书吧');
    }
    //进行书吧加载
    util.getBarInfoByPos(param, function (ret) {
      if (ret.data.code == "200") {
        vm.setDataWithRes(2, ret.data.obj)
        start_a = start_a + num_a
        loading_flag_a = false  //避免下拉时重复加载
      }
    })
  },
  //判断切换swiper后是否还需要重新加载数据
  needLoadNewDataAfterSwiper: function (e) {
    switch (vm.data.currentNavbar) {
      case 1:
        return vm.data.bookInfos.length > 0 ? false : true;
      case 2:
        return vm.data.barInfos.length > 0 ? false : true;
    }
    return false;
  },
  //进行信息的加载
  loadMoreDatas: function (e) {
    switch (vm.data.currentNavbar) {
      case 1:   //加载图书
        vm.getBookInfos();
        console.log("bookInfos:" + JSON.stringify(vm.data.bookInfos))
        break;
      case 2:   //加载书吧
        vm.getBarInfoByPos()
        break;

    }
    return false;
  },
  //设置新数据
  setDataWithRes: function (nav_id, res) {
    console.log(JSON.stringify(res))
    switch (nav_id) {
      case 0:
        //图片处理
        for (var i = 0; i < res.bookInfos.length; i++) {
          res.bookInfos[i].bookInfo.images_medium = util.qiniuUrlTool(res.bookInfos[i].bookInfo.images_medium, "folder_index")
        }
        vm.setData({
          indexPage: res
        })
        break
      case 1: //图书信息
        if (start_o == 0) { //0则重新加载
        //图片处理
          for (var i = 0; i < res.length;i++)
          {
            res[i].bookInfo.images_medium = util.qiniuUrlTool(res[i].bookInfo.images_medium, "folder_index")
          }
          vm.setData({
            bookInfos: res
          })
        } else {
          vm.setData({
            bookInfos: vm.data.bookInfos.concat(res)
          })
        }
        break
      case 2:
        if (start_a == 0) { //0则重新加载
          vm.setData({
            barInfos: res
          })
        } else {
          // vm.setData({
          //   barInfos: vm.data.barInfos.concat(res)
          // })
        }
        break
    }
  },
  //拨打电话
  callPhonenum: function (e) {
    console.log(JSON.stringify(e))
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenum
    })
  },
  
  //查看位置
  getMapPosition: function (e) {
    console.log("lon lat：" + JSON.stringify(e.currentTarget.dataset))
    var lon = e.currentTarget.dataset.lon
    var lat = e.currentTarget.dataset.lat
    var name = e.currentTarget.dataset.name
    var address = e.currentTarget.dataset.address
    wx.openLocation({
      latitude: lon,
      longitude: lat,
      scale: 28,
      name: name,
      address: address
    })
  },
  //根据图书id获取图书
  jumpBookInfo: function (e) {
    console.log(JSON.stringify("bookid:" + e.currentTarget.dataset.bookid))
    var bookid = e.currentTarget.dataset.bookid
    wx.navigateTo({
      url: '/pages/bookpage/bookpage?bookid=' + bookid
    })
  },
  //根据书吧id获取书吧页面
  bardetail: function (e) {
    console.log(JSON.stringify("barid:" + e.currentTarget.dataset.barid))
    var barid = e.currentTarget.dataset.barid
    wx.navigateTo({
      url: '/pages/barpage/barpage?barid=' + barid
    })
  },
  //点击跳转搜索页面
  clickSearch:function(e){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  seeMoreBook:function(e){
    vm.setData({
      currentNavbar:1
    })
    if (vm.needLoadNewDataAfterSwiper()) {
      vm.loadMoreDatas()
    }
  },
  seeMoreBar:function(e){
    vm.setData({
      currentNavbar: 2
    })
    if (vm.needLoadNewDataAfterSwiper()) {
      vm.loadMoreDatas()
    }
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: navigationBarTitleText,
      path: '/pages/index/index',
      success: function (res) {
        
      },
      fail: function (res) {
        
      }
    }
  },

  //滑动翻页
  changeSwiper:function(e){
    vm.setData({
      currentNavbar: e.detail.current
    })
    if (vm.needLoadNewDataAfterSwiper()) {
      vm.loadMoreDatas()
    }
  },
})
