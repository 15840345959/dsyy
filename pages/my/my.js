var util = require('../../utils/util.js')
var vm=null
//获取应用实例
var app = getApp()
Page({
  data: {
    title: "",  //页面标题
    myBg: "",   //头部图片
    myName: "",  //微信昵称
    myPhoto: "",   //微信头像
    myNav: [],    //模块导航
    myNotice: [],    //列表导航
    mytype: 0    //用户类型
  },
  onLoad: function () {
    vm=this
    console.log('onLoad')
    var user_id = app.globalData.userInfo.id;
    // var user_id=17  //测试
    var user_name = app.globalData.userInfo.nick_name;  //获取昵称
    var user_photo = app.globalData.userInfo.avatar;    //获取头像
    vm.setData({
      myName: user_name,
      myPhoto: user_photo
    })
    console.log("user id:" + user_id);
    var param={
      user_id: user_id
    }
    //判断用户是否为书吧管理员，如果是执行getAdmin，如果不是执行getMember
    util.getBarListByUserId(param,function(ret){
      console.log(JSON.stringify(ret))
      if (ret.data.code == "200")
      {
        if (ret.data.obj!="")
        {
          vm.getAdmin();
          vm.setData({
            mytype: 1
          })
        }
        else
        {
          vm.getMember();
          vm.setData({
            mytype: 0
          })
        }
      }
    })
  },
  //管理员
  getAdmin:function(){
    vm.setData({
      title: "管理员中心",
      myBg: "/images/admin_bg.png",
      myNav: [
        { img: "/images/admin_lend.png", title: "图书借出", url: "" },
        { img: "/images/admin_ret.png", title: "图书归还", url: "" },
        { img: "/images/admin_input.png", title: "图书录入", url: "/pages/admin/cbook/cbook" },
        { img: "/images/admin_bar.png", title: "书吧管理", url: "" }
      ],
      myNotice: [
        { img: "/images/admin_notice_about.png", title: "关于我们", url: "/pages/admin/about/about" },
        { img: "/images/admin_notice_feedback.png", title: "意见反馈", url: "" }
      ]
    })
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })
  },
  //非管理员
  getMember:function(){
    vm.setData({
      title: "个人中心",
      myBg: "/images/admin_bg.png",
      myNav: [
        { img: "/images/member_scan.png", title: "我要借阅", url: "/pages/member/borrow/borrow" }
      ],
      myNotice: [
        { img: "/images/admin_notice_about.png", title: "历史借阅", url: "" },
        { img: "/images/admin_notice_feedback.png", title: "会员卡", url: "" },
        { img: "/images/admin_notice_about.png", title: "关于我们", url: "/pages/admin/about/about" },
        { img: "/images/admin_notice_feedback.png", title: "意见反馈", url: "/pages/member/feedback/feedback" }
      ]
    })
    var title = vm.data.title
    wx.setNavigationBarTitle({ title: title })
  },
  //跳转修改信息页面
  editInfo:function(e){
    wx.navigateTo({
      url: "/pages/user/user"
    })
  },
  //跳转页面
  jumpUrl: function (e) {
    var url = e.currentTarget.dataset.url
    console.log("url：" + JSON.stringify(url))

    wx.navigateTo({
      url: url
    })
  }
})
