var util = require('../../utils/util.js')
var app=getApp()
var vm = null
var bar_id = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal:[],
    change:false,
    bookInfos:[],
    search_book:[],
    hotword: getApp().globalData.bookTypeArr,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this
    bar_id = options.barid
    if (bar_id == "undefined" || bar_id == null || bar_id == "") {
      bar_id = ""
    }
    console.log("书吧传来的值：" + bar_id)
    if (bar_id == null) {
      vm.inputTyping
    }
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
  hideInput:function(){
    vm.setData({
      inputVal:"",
      change:false
    })
  },
  
  search_bt:function(e){
    vm.setData({
      inputVal: e.target.dataset.search,
    })
    var param = {
      type: e.target.dataset.search,
      bar_id:bar_id
    }
    //如果为零属于重新加载
    if (vm.data.bookInfos == "" || vm.data.bookInfos == null || vm.data.bookInfos == undefined) {
      util.showLoading('加载图书');
    }
    util.getBookInfosByType(param, function (ret) {
      console.log("输出：" + JSON.stringify(ret))
      if (ret.data.code == "200") {
        vm.setData({
          bookInfos: ret.data.obj,
          change: true
        })
      }
    })
  },
  inputTyping:function(e){
      vm.setData({
        inputVal: e.detail.value,
      })
      var param = {
        title: e.detail.value,
        bar_id:bar_id
      }
      //如果为零属于重新加载
      if (vm.data.bookInfos == "" || vm.data.bookInfos == null || vm.data.bookInfos == undefined) {
        util.showLoading('加载图书');
      }
      util.getBookInfosByTitle(param, function (ret) {
        console.log("输出：" + JSON.stringify(ret))
        if (ret.data.code == "200") {
          vm.setData({
            bookInfos: ret.data.obj,
            change: true
          })
        }
      })
  }
  
})
