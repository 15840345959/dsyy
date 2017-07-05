var util = require('../../utils/util.js')

//获取应用实例
var app = getApp()

var vm = null

var barid = 0

//书吧图书列表相关加载参数
var start_b = 0
var num_b = 5
var loading_flag_b = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    barInfo: [],
    bookInfos: [],
    inputVal: [],
    scrollTop: 0,
    scrollHeight: 0,
    wordhidden: true,
    textword: "没有上传图书"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options:" + JSON.stringify(options))
    vm = this

    // barid = options.barid
    barid = 2 //测试数据
    vm.setData({
      hidden: false,
      scrollHeight: 500
    })
    if (vm.data.barInfo.length == 0 || vm.data.bookInfos.length == 0) {
      util.showLoading('加载中...');
    }
    vm.loadMore()
  },
  //页面滑动到底部
  bindDownLoad: function () {
    vm.loadMore();
  },

  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });

  },
  //滑动到顶部
  topLoad: function (event) {
    start_b = 0;
    this.setData({
      bookInfos: [],
      scrollTop: 0
    });
    vm.loadMore();
  },
  //拨打电话
  callPhonenum: function (e) {
    console.log(JSON.stringify(e))
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenum
    })
  },

  //查看位置
  getmapposition: function (e) {
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
  //搜索
  searchInfo: function (e) {
    var searchtitle = e.detail.value
    vm.setData({
      inputVal: searchtitle
    })
    vm.loadMore();
  },
  //删除搜索文字
  clearInput: function (e) {
    vm.setData({
      inputVal: ""
    })
  },

  // 请求数据
  loadMore: function () {
    if (vm.data.inputVal == null || vm.data.inputVal == undefined || vm.data.inputVal == "") {
      var param = {
        start: start_b,
        num: num_b,
        bar_id: barid
      }
      if (loading_flag_b) {
        return;
      }
      loading_flag_b = true
      console.log(JSON.stringify(param))
      util.getBarPageByBarId(param, function (ret) {
        if (ret.data.code == "200") {
          console.log(JSON.stringify(ret))
          vm.setData({
            barInfo: ret.data.obj.barInfo,
            bookInfos: ret.data.obj.bookInfos,
          })
          start_b++
          loading_flag_b = false
          vm.setData({
            hidden: true
          })
        }
      });
    }
    else {
      var param = {
        start: start_b,
        num: num_b,
        con: "where title like '%" + vm.inputVal + "%'",
        bar_id: barid
      }
      if (loading_flag_b) {
        return;
      }
      loading_flag_b = true
      util.getBookObjByCon(param, function (ret) {
        console.log("getBookObjByCon" + JSON.stringify(ret))
        if (ret.data.code == "200") {
          var msgObj = ret.data.obj
          msgObj.barInfo.img = util.qiniuUrlTool(msgObj.barInfo.img, "folder_index")

          vm.setData({
            bookInfos: ret.data.obj,
          })
          console.log("条件查询获取的内容：" + JSON.stringify(ret.data.obj))
          loading_flag_b = false  //避免下拉时重复加载
          vm.setData({
            hidden: true
          })
        }
      })
    }
  }

})