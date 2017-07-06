var util = require('../../utils/util.js')
var app=getApp()
var vm = null
var bar_id = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal:"",
    bookInfos:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm=this
    bar_id = options.barid
    if (util.judgeIsAnyNullStr(bar_id)){
      bar_id=""
    }
    console.log("书吧传来的值："+bar_id)
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
  hideInput:function(){
    vm.setData({
      inputVal:"",
    })
  },
  
  searcBook:function(e){
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
        })
      }
    })
  },
  inputTyping:function(e){
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
          })
        }
      })
  }
  
})
