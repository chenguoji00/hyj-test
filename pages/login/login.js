// pages/login/login.js
const app = getApp()
import {
  send
} from "../../utils/wx_network/service";
import {
  getTokenByWeappOpenId
} from "../../utils/wx_network/login"
let cfg = require('../../utils/config.js');
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
    console.log(app, "this is send")
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
  //手机获取
  getPhoneNumber(e) {
    let that = this;
    //成功："getPhoneNumber:ok"  失敗 ："getPhoneNumber:fail user deny" ,"getPhoneNumber:fail:user deny"
    if (e.detail.errMsg == "getPhoneNumber:fail user deny" || e.detail.errMsg == "getPhoneNumber:fail:user deny") {
      wx.showModal({
        title: "提示",
        content: "手机号码获取失败",
        showCancel: !1
      }), wx.hideLoading();
    } else {
      app.wxloginBtn().then(function () {
        wx.showLoading({
            title: "获取手机号登陆..."
          }),
          send('/wx/decode', { //获取openid
            "appid": cfg.WXAPP_ID,
            "session_key": wx.getStorageSync('session_key'),
            "encryptedData": e.detail.encryptedData,
            "iv": e.detail.iv
          }).then(res => {
            console.log(res, "this is res");
            if (res.phoneNumber) {
              wx.hideLoading();
              wx.setStorageSync('phone', res.phoneNumber);
              // wx.reLaunch({
              //   url: '/pages/index/index',
              // })
              that.getHyjLogin();
            }
          }).catch(err => {
            console.log(err)
            wx.showToast({
              title: '请求失败,请重试'
            });
            wx.hideLoading();
          });
      });
    }
  },

  getHyjLogin() {
    let wxUserInfo = wx.getStorageSync('wxUserInfo')
    let params = wxUserInfo == null || wxUserInfo == '' ? {} : wxUserInfo;
    params.openid = wx.getStorageSync('openid');
    params.appid = cfg.WXAPP_ID;
    let data = {
      // TODO  这里的tenantId是默认000001的吗？
      tenantId: "000001",
      phone: wx.getStorageSync('phone')
    }
    getTokenByWeappOpenId(`/auth/getTokenByWeappOpenId?tenantId=${data.tenantId}&phone=${data.phone}`, params).then(res => {
      if (res.code == 200) {
        wx.setStorageSync('hyjToken', res.data.token);
        wx.setStorageSync('hyjUserInfo', res.data.userInfo);
        wx.setStorageSync('userId', res.data.userInfo.userId);
        let default_tenantId = '';
        let tenants = res.data.userInfo.tenants;
        if (tenants.length == 1) {
          default_tenantId = tenants[0].tenantId;
        } else {
          tenants.forEach(i => {
            if (i.isDefault == 1) {
              default_tenantId = i.tenantId;
            }
          });
        }
        wx.setStorageSync('tenantId', default_tenantId)
        wx.navigateBack({
          complete: (res) => {
            console.log(res)
          },
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

  wxloginBtn(res) {
    var t = this;
    return wx.showLoading({
        title: "授权登录中"
      }),
      new Promise(function (resolve, reject) {
        wx.login({
          success: function (e) {
            e.code ? (
              wx.getUserInfo({
                success: function (datas) {
                  send(`/wx/weapp/getOpenId`, { //获取openid
                    "appid": cfg.WXAPP_ID,
                    "js_code": e.code
                  }).then(res => {
                    if (res.openid) {
                      wx.setStorageSync('code', e.code)
                      wx.setStorageSync('openid', res.openid);
                      wx.setStorageSync('session_key', res.session_key);
                      t.setData({
                        flaglogin: (!t.data.flaglogin),
                      })
                      wx.hideLoading();
                      resolve(res)
                    }
                  }).catch(err => {
                    wx.showToast({
                      title: '请求失败'
                    });
                    reject(err);
                  })
                }
              })
            ) : (t.loginFailed());
          }
        });
      });
  },
  loginFailed: function () {
    wx.showModal({
      title: "提示",
      content: "登录失败!",
      showCancel: !1
    }), wx.hideLoading();
  },

  //用户隐私
  privateBtn() {
    wx.navigateTo({
      url: '/pageOther/page/privatypolicy/PrivatyPolicy',
    })
  },

  // bindGetUserInfo: function(e) {
  //   if (e.detail.userInfo) {
  //     //用户按了允许授权按钮
  //     var that = this;
  //     let user = e.detail.userInfo;
  //     // 获取到用户的信息了，打印到控制台上看下
  //     console.log("用户的信息如下：");
  //     console.log(user);
  //     //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
  //     that.data.lee
  //     if (that.data.lee == '') {
  //       wx.showToast({
  //           icon: "none",
  //           title: '请继续点击获取手机号',
  //         }),
  //         that.setData({
  //           isHide: true,
  //           flag: (!that.data.flag),
  //           lee: true
  //         })
  //       that.wxlogin();
  //     } else if (!that.data.lee) {
  //       wx.switchTab({
  //         url: "/wurui_house/pages/index/index"
  //       })

  //     }
  //   } else {
  //     //用户按了拒绝按钮
  //     wx.showModal({
  //       title: '警告',
  //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
  //       showCancel: false,
  //       confirmText: '返回授权',
  //       success: function(res) {
  //         // 用户没有授权成功，不需要改变 isHide 的值
  //         if (res.confirm) {
  //           console.log('用户点击了“返回授权”');
  //         }
  //       }
  //     });
  //   }
  // },
})