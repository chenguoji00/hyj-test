//app.js
import { send } from './utils/wx_network/service';
let cfg = require('./utils/config.js'); 
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              wx.setStorageSync('wxUserInfo', res.userInfo);
              // wx.reLaunch({
              //   url: '/pages/index/index', //成功后跳转至小程序首页开始体验
              // })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          // 未经授权，弹框确认后调用 getUserInfo
          // wx.reLaunch({
          //   url: '/pages/login/login', //成功后跳转至小程序首页开始体验
          // })
        }
      }
    })
  },

  globalData: {
    userInfo: null
  },
  // 微信登录
  wxloginBtn() {
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
                  send(`/wx/weapp/getOpenId`,{ //获取openid
                    "appid": cfg.WXAPP_ID,
                    "js_code": e.code
                  }).then(res => {
                    if (res.openid) {
                      wx.setStorageSync('code', e.code)
                      wx.setStorageSync('openid', res.openid);
                      wx.setStorageSync('session_key', res.session_key);
                      wx.hideLoading();
                      resolve(res)
                    }
                  }).catch(err=>{
                    wx.showToast({title: '请求失败'});
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
})