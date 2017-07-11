//logs.js
var util = require('../../utils/util.js')
var md5 = require('../../utils/md5.js')

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

      var nonceStr = util.randomString()
      var prepay_id = ret.data.obj.prepay_id
      var timeStamp = util.createTimeStamp()


      var stringSignTemp = "appId=&nonceStr=" + nonceStr + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + timeStamp + "&key="
      console.log("stringSignTemp:" + stringSignTemp)
      var sign = md5.hexMD5(stringSignTemp).toUpperCase()

      console.log("sign:" + sign)

      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: "prepay_id=" + prepay_id,
        signType: "MD5",
        paySign: sign,
        success: function (ret) {
          // success  
          console.log("sucess:" + JSON.stringify(ret))
        },
        fail: function (ret) {
          // fail  
          console.log("fail:" + JSON.stringify(ret))
        },
        complete: function () {
          // complete  
          console.log("complete:" + JSON.stringify(ret))
        }
      })

    })
  }
})
