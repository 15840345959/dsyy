//logs.js
var util = require('../../utils/util.js')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {

  },

  onLoad: function () {
    console.log('onLoad')

  },
  clickPay: function (e) {
    console.log("clickPay e:" + JSON.stringify(e))
    var param = {
      level_id: "1"
    }
    util.wxPrepay(param, function (ret) {
      console.log(JSON.stringify(ret))

    })
  }
})
