var util = require('../../utils/util.js')
var app=getApp()
var vm = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputVal:[],
    hotword: app.globalData.bookTypeArr,
    change:false,
    bookInfos:[],
    search_book:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm=this
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

  
  //取消
  hideInput:function(e){
    this.setData({
      inputVal:"",
      change:false
    })
  },
  search_bt: function (e){
    console.log("search_book："+JSON.stringify(e))
    var a = e.target.dataset.search
    vm.output(a)
    },
  inputTyping: function (e) {
    var a = e.detail.value
    vm.output(a)
  },

  output:function(a){
      vm.setData({
        inputVal: a,
      })
      var param = {
        title: a,
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
