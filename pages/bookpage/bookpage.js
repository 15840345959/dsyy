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
    reaction:[],    //读后感
    img:"http://dsyy.isart.me/reaction.png"
  },
  onLoad: function (options) {
    if (util.judgeIsAnyNullStr(options.bookid)) {
      return;
    }
    vm = this
    book_id = options.bookid

    util.showLoading('加载中...');
    vm.loadbookPage()  //加载图书信息
  },
  //获取图书信息
  loadbookPage:function(){
    var param={
      book_id:book_id
    }
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        param = {
          lat: longitude,
          lon: latitude
        }
      }
    })
    util.getBookPageByBookId(param,function(ret){
      console.log("bookInfo :"+JSON.stringify(ret))
      if(ret.data.code=="200")
      {
        var bookInfo = ret.data.obj.bookInfo
        bookInfo.images_medium = util.qiniuUrlTool(bookInfo.images_medium, "folder_index")
        vm.setData({
          bookInfo: bookInfo,
          barInfos: ret.data.obj.barInfos
        })
        vm.getReaction()   //获取读后感
      }
    })
    
  },
  //根据ISBN号获取读后感
  getReaction:function(){
    var isbn = vm.data.bookInfo.isbn13
    var param={
      isbn:isbn
    }
    util.getTWDetailInfoByISBN(param,function(ret){
      console.log("reaction："+JSON.stringify(ret))
      if(ret.data.code=="200")
      {
        vm.setData({
          reaction: ret.data.obj
        })
      }
    })
  },
  //借书
  getScan:function(){
    wx.navigateTo({
      url: "/pages/member/borrow/borrow"
    })
  },
  //进入书吧
  intoBar:function(e){
    var bar_id = e.currentTarget.dataset.barid
    wx.navigateTo({
      url: '/pages/barpage/barpage?barid=' + bar_id
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: navigationBarTitleText,
      path: 'pages/bookpage/bookpage/bookid='+book_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
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
})