var util = require('../../../utils/util.js')




Page({
  data: {

  },
  onLoad: function () {

  },
  //扫描图书
  scannerBook: function (e) {
    console.log(JSON.stringify(e))
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  }
})
