//index.js
//获取应用实例
const app = getApp()
var cng = require("../../utils/config")

Page({
  data: {
    url : '',//设置web-view的地址，
    mydata:'',
  },
  onShow : function(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    let url = currPage.data.mydata;
    if(url){
      this.setData({
        url:url.url+'?'+Date.parse(new Date())
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    
  },

  onLoad: function (event) {
    /*
    *  别的页面跳转到这里时，首先判断是否是从商城支付订单后进来的，根据是否存在type来确定，
    *  type：virtual：虚拟订单，chufang：处方订单，chain：门店订单，
    *  如果没有type就是首页进来的,直接跳转到公众号页面的进行自动登录
    *  公众号那边需要处理：
    * 1：自动登录，
    * 根据小程序有没有传手机号码:
    * 1）:有的话就直接根据openid和手机号进行自动登录 
    * 2）:没有的话就进入到手机登录页面进行手机号码验证登录，此时如果手机登录成功之后就需要把手机号存起来，以备下次进入的时候
    * 虽然没有手机号，但是此时缓存中存在手机号，直接调用openid进行登录即可
    * 
    */
    console.log(event,"31 index");
    let url = '';
    if(event.type == 'virtual'){
      url = `${cng.APP_SERVER}/?t=${new Date().getTime()}&openid=${wx.getStorageSync('openid')}&appid=${cng.WXAPP_ID}&phone=${wx.getStorageSync('phone')}&wxUserInfo=${JSON.stringify(wx.getStorageSync('wxUserInfo'))}#/message`;
    }else if(event.type == 'chufang' || event.type == 'chain'){
      url = `${cng.APP_SERVER}/?t=${new Date().getTime()}&openid=${wx.getStorageSync('openid')}&appid=${cng.WXAPP_ID}&phone=${wx.getStorageSync('phone')}&wxUserInfo=${JSON.stringify(wx.getStorageSync('wxUserInfo'))}#/prescriptionList`;
    }else{
      url = `${cng.APP_SERVER}/?t=${new Date().getTime()}&openid=${wx.getStorageSync('openid')}&appid=${cng.WXAPP_ID}&phone=${wx.getStorageSync('phone')}&wxUserInfo=${JSON.stringify(wx.getStorageSync('wxUserInfo'))}#/`
    }
    console.log(url,"查看URL地址 42 index.js");
    // url = `http://192.168.1.105:81/?t=${new Date().getTime()}&openid=${wx.getStorageSync('openid')}&appid=${cng.WXAPP_ID}&phone=${wx.getStorageSync('phone')}&wxUserInfo=${JSON.stringify(wx.getStorageSync('wxUserInfo'))}#/`
    this.setData({
      url:url
    })
  },

  getMessage: function(e) {
    console.log("getMessage");
  },

  getUserInfo: function(e) {
    
  },

  onShareAppMessage: function () {
    
  },
})
