var util = require('../../utils/util.js')

//获取应用实例
var app = getApp()

var vm = null

var bar_id = 0

var bar_name=null

//书吧图书列表相关加载参数
var start_b = 0
var num_b = 12
var loading_flag_b = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    barInfo: [],
    bookInfos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = { //测试数据
      barid: 2
    }
    if (util.judgeIsAnyNullStr(options.barid)) {
      return;
    }
    vm = this
    bar_id = options.barid
    util.showLoading('加载中...');
    vm.loadBarPage()
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

  // 请求数据
  loadBarPage: function () {
    var param = {
      start: start_b,
      num: num_b,
      bar_id: bar_id
    }
    console.log(JSON.stringify(param))
    util.getBarPageByBarId(param, function (ret) {
      console.log(JSON.stringify(ret))
      if (ret.data.code == "200") {
        var img = ret.data.obj.barInfo.picture
        ret.data.obj.barInfo.picture = util.qiniuUrlTool(ret.data.obj.barInfo.picture, "folder_index")
        vm.setData({
          barInfo: ret.data.obj.barInfo,
          bookInfos: ret.data.obj.bookInfos,
        })
        bar_name = ret.data.obj.barInfo.name
      }
    });
  },
  SearchBook:function(){
    wx.navigateTo({
      url: '/pages/search/search?barid='+bar_id+"&barname="+bar_name,
    })
  }

})