var util = require('../../utils/util.js')

//获取应用实例
var app = getApp()

var vm = null

var book_id = 0

var book_name = null
Page({
  data: {
    bookInfo: [],   //图书信息
    barInfos: [],   //书吧信息
    system_height:"",
  },
  onLoad: function (options) {
    if (util.judgeIsAnyNullStr(options.bookid)) {
      return;
    }
    vm = this
    book_id = options.bookid
    util.showLoading('加载中...');
    vm.loadbookPage()
    wx.getSystemInfo({
      success: function (res) {
        vm.setData({
          system_height: res.screenHeight
        })
      }
    })
  },
  loadbookPage:function(){
    var param={
      book_id:book_id
    }
    util.getBookPageByBookId(param,function(ret){
      console.log("bookInfo :"+JSON.stringify(ret))
      if(ret.data.code=="200")
      {
        vm.setData({
          bookInfo: ret.data.obj.bookInfo,
          barInfos: ret.data.obj.barInfos
        })
      }
    })
  },
  getScan:function(){
    wx.navigateTo({
      url: "/pages/member/borrow/borrow"
    })
  },
  intoBar:function(e){
    var bar_id = e.currentTarget.dataset.barid
    wx.navigateTo({
      url: '/pages/barpage/barpage?barid=' + bar_id
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("转发："+res.target)
      
    }
    console.log("转发：" + JSON.stringify(res))
    return {
      title: 'navigationBarTitleText',
      path: 'pages/bookpage/bookpage/bookid='+book_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})