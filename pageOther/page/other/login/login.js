// pages/login/login.js
const app = getApp()
import {
  send
} from "../../../../utils/wx_network/service";
import {
  getTokenByWeappOpenId
} from "../../../../utils/wx_network/login"
let cfg = require('../../../../utils/config.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    isHide: false,
    AuthorizedLogin: '微信登录',
    UserPhone: '手机号授权',
    flaglogin: true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let pages = getCurrentPages();//页面对象
    // let prevpage = pages[pages.length - 2];//上一个页面对象
    // if(prevpage.route = 'pages/message/main/main'){
    //   app.globalData.freshMessage = true;
    // }
    // 上面這一段代码是用来设置声网嵌套进来的聊天页面因为token失效了之后，网页跳转到这里，判断是否是main/main路由跳转过来的
    // 是的话就说明是聊天界面出现了失效问题，所以就需要去设置一个全局变量来声明一下，后面登录成功之后就返回到了聊天页面，聊天界面
    // 这个时候是不会再次触发onLoad方法，所以就需要用到onShow方法再次传入新的url携带token去聊天界面

    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          if (wx.getStorageSync('openid')) {
            that.data.flaglogin = false
          } else {
            that.data.flaglogin = true
          }
        } else {
          // 用户没有授权
          that.data.flaglogin = true
        }
        that.setData({
          flaglogin: that.data.flaglogin
        });
      }
    });
  },
  //用户需要手机登录。直接返回上一页的webView然后传个去H5页面的登录URL进行手机登录
  // loginForPhone() {
  //   var pages = getCurrentPages();
  //   var prevPage = pages[pages.length - 2]; //上一个页面
  //   //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
  //   prevPage.setData({
  //     mydata: {
  //       url: `${cfg.APP_SERVER}/#/login`
  //     }
  //   })
  //   wx.navigateBack({ //返回
  //     delta: 1
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取用户手机号码
  getPhoneNumber: function (e) {
    let that = this;
    //用户取消手机授权直接返回
    if (e.detail.iv == undefined && e.detail.encryptedData == undefined) {
      wx.showModal({
        title: "提示",
        content: "手机号码获取失败",
        showCancel: !1
      }), wx.hideLoading();
      return;
    }
    //先检查sessionKey
    wx.checkSession({
      success: function () {
        console.log('sessionKey没过期直接请求');
        wx.showLoading({
          title: "获取手机号登陆...",
          icon: "none"
        })
        send('/wx/decode', { //获取openid
          "appid": cfg.WXAPP_ID,
          "encryptedData": e.detail.encryptedData,
          "session_key": wx.getStorageSync('session_key'),
          "iv": e.detail.iv
        }).then(res => {
          if (res.phoneNumber) {
            wx.hideLoading();
            wx.setStorageSync('phone', res.phoneNumber);
            that.getHyjLogin();
          }
        }).catch(err => {
          wx.showToast({
            title: '请求失败,请重试',
            duration: 4000,
            icon: 'none'
          });
        });
      },
      fail: function () {
        //先更新sessionKey
        app.wxloginBtn().then(function (res) {
          wx.showLoading({
              title: "正在请求数据，请稍后...",
              icon: "none"
            }),
            send('/wx/decode', { //获取openid
              "appid": cfg.WXAPP_ID,
              "session_key": res.session_key,
              "encryptedData": e.detail.encryptedData,
              "iv": e.detail.iv
            }).then(res => {
              if (res.phoneNumber) {
                wx.hideLoading();
                wx.setStorageSync('phone', res.phoneNumber);
                that.getHyjLogin();
              }
            }).catch(err => {
              console.log(err)
              wx.showToast({
                title: '请求失败,请重试',
                duration: 4000,
                icon: 'none'
              });
            });
        });
      }
    })
  },

  getHyjLogin() {
    let wxUserInfo = wx.getStorageSync('wxUserInfo')
    let params = wxUserInfo == null || wxUserInfo == '' ? {} : wxUserInfo;
    params.openid = wx.getStorageSync('openid');
    params.appid = cfg.WXAPP_ID;
    // TODOS ：租户ID写死了，到时候修改
    params.tenantId = "000001";
    params.phone = wx.getStorageSync('phone');
    params.grant_type = "weapp";

    getTokenByWeappOpenId(params).then(res => {
      if (res.code == 200) {
        let token = res.token_type + " " + res.access_token;
        wx.setStorageSync('hyjToken', token);
        wx.setStorageSync('hyjUserInfo', res.userInfo);
        wx.setStorageSync('userId', res.user_id);
        wx.setStorageSync('shopToken', res.token);
        // wx.navigateBack({
        //   complete: (res) => {
        //     console.log(res)
        //   },
        // })
        let url = `${cfg.APP_SERVER}/?shopToken=${wx.getStorageSync('shopToken')}#/login`;//跳转慧医家设置token再返回
        let data = escape(url)
        wx.navigateTo({
          url: `/pageOther/page/other/shop-mall/index?url=${data}`,
        })
      } else {
        wx.showToast({
          title: '登录失败，请重试',
        })
      }
    })
  },

  /**
   * 微信登录按钮
   */
  bindGetUserInfo: function (e) {
    var that = this;
    wx.getUserInfo({
      success: function (t) {
        app.globalData.userInfo = t.userInfo;
        wx.setStorageSync('wxUserInfo', t.userInfo);
        app.wxloginBtn().then(function () {
          that.setData({
            flaglogin: (!that.data.flaglogin),
          })
        });
      },
      fail: function (t) {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”')
            }
          }
        })
      }
    });
  },

  //用户隐私
  privateBtn() {
    wx.navigateTo({
      url: '/pageOther/page/other/privatypolicy/PrivatyPolicy',
    })
  },
})