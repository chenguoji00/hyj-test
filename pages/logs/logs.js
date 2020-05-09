//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function (event) {
    if (event.isPay == "1") {
      wx.reLaunch({
        url: '/pages/index/index?type=' + event.type,
      })
    } else {
      //调起微信支付
      wx.requestPayment({
        'timeStamp': event.timestamp,
        'nonceStr': event.nonceStr,
        'package': 'prepay_id=' + event.package,
        'signType': event.signType,
        'paySign': event.paySign,
        //小程序微信支付成功的回调通知  
        'success': function (res) {
          //定义小程序页面集合  
          var pages = getCurrentPages();
          //当前页面 (wxpay page)  
          var currPage = pages[pages.length - 1];
          //上一个页面 （index page）   
          var prevPage = pages[pages.length - 2];
          //通过page.setData方法使index的webview 重新加载url  有点类似于后台刷新页面  
          //此处有点类似小程序通过加载URL的方式回调通知后端 该订单支付成功。后端逻辑不做赘述。  
          //小程序主动返回到上一个页面。即从wxpay page到index page。此时index page的webview已经重新加载了url 了  
          //微信小程序的page 也有栈的概念navigateBack 相当于页面出栈的操作  
          // wx.navigateBack();
          // wx.requestSubscribeMessage({
          //   tmplIds: ['Fx_YAWh4wH4wMyZXVRcruvgE2ykxskci2UL_4Y4j4s4'],
          //   success(res) {
          //     console.log("订阅消息成功回调:", res)
          wx.reLaunch({
            url: '/pages/index/index?type=' + event.type,
          })
          //   }
          // })
        },
        //小程序支付失败的回调通知  
        'fail': function (res) {
          console.log("支付失败", res)
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];
          var prevPage = pages[pages.length - 2];
          wx.navigateBack();
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },
  getMessage: function (e) {
    if (!e.detail) {
      return
    }
    var datas = e.detail.data
    var shareUrl = datas.params;
  },
})