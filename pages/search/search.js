var util = require('../../utils/util.js')
var app = getApp()
var vm = null

//获取传入书吧参数
var barInfo = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    bookInfos: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    //页面传入的options
    console.log("options:" + JSON.stringify(options))
    //如果options的barInfo不为空，则代表有barInfo值
    if (!util.judgeIsAnyNullStr(options.barInfo)) {
      //设置barInfo
      console.log("barInfo String:"+options.barInfo)
      barInfo = JSON.parse(options.barInfo)
      console.log(barInfo)
    }
    //初始化type
    vm.setData({
      hotword: getApp().globalData.bookTypeArr,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {


  },
  //根据type查找书籍分类
  searchBookByType: function (e) {
    var param = {
      type: e.target.dataset.search,
      bar_id: barInfo.id
    }
    //如果为零属于重新加载
    if (util.judgeIsAnyNullStr(vm.data.bookInfos)) {
      util.showLoading('加载图书');
    }
    util.getBookInfosByType(param, function (ret) {
      console.log("输出：" + JSON.stringify(ret))
      if (ret.data.code == "200") {
        vm.setData({
          bookInfos: ret.data.obj,
        })
      }
    })
  },
  //根据输入框中的值查找指定书籍
  searchBookByTitle: function (e) {
    var param = {
      title: e.detail.value,
      bar_id: barInfo.id
    }
    //如果为零属于重新加载
    if (util.judgeIsAnyNullStr(vm.data.bookInfos)) {
      util.showLoading('加载图书');
    }
    util.getBookInfosByTitle(param, function (ret) {
      console.log("输出：" + JSON.stringify(ret))
      if (ret.data.code == "200") {
        vm.setData({
          bookInfos: ret.data.obj,
        })
      }
    })
  }

})
