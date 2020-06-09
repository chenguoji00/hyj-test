// pageOther/page/inquiry/inquiry-order/index.js
import {
  orderPreview
} from '../../../../utils/wx_network/mall';
const cng = require('../../../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buyData: {},
    registerId: '',
    stepOneData: {},
    payId: 0, //支付id
    step1Url: '',
    step2Url: '',
    orderType: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "this is orderType");
    // 有inquiry：问诊订单，否则是处方购买订单
    this.data.isInquiry = options.inquiry;
    this.data.step1Url = `${cng.APP_SERVER}/api/member/buy/virtual/step1`;
    this.data.step2Url = `${cng.APP_SERVER}/api/member/buy/virtual/step2`;
    this.data.orderType = options.orderType;
    this.data.registerId = options.registerId;
    this.data.buyData = decodeURI(options.buyData);
    this.orderPreview();
    this.step1();
  },

  // 用户订单信息
  orderPreview() {
    let params = {
      registerId: this.data.registerId
    }
    orderPreview(params).then(res => {
      this.setData({
        orderPreview: res.data
      })
    })
  },

  // 商城信息
  step1() {
    let that = this;
    let params = {
      "token": wx.getStorageSync('shopToken'),
      "buyData": this.data.buyData,
      "clientType": "wap",
      "isCart": 0
    }
    wx.showLoading({
      title: '数据请求中,请稍后',
      icon: "none"
    })
    wx.request({
      url: this.data.step1Url,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //FormData请求修改成这样即可
      },
      data: params,
      success: function (res) {
        console.log(res, "step1");
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            let mallData = res.data.datas.buyStoreVoList[0].buyGoodsItemVoList;
            that.data.stepOneData = res.data.datas;
            let goodsFullSpecs = mallData[0].goodsFullSpecs.split("：")[1];
            that.setData({
              mallData: mallData,
              goodsFullSpecs: goodsFullSpecs
            })
          } else {
            wx.showToast({
              title: res.data.datas.error + '',
              icon: "none"
            })
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          }
        } else {
          wx.showToast({
            title: "请求错误",
            icon: "none"
          })
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }

        wx.hideLoading();
      }
    });
  },
  // 提交订单支付按钮 
  submitOrderBtn() {
    var that = this;
    wx.showLoading({
      title: '数据请求中,请稍后',
      icon: "none"
    })
    let storeList = [];
    let buy = '';
    for (let i = 0; i < this.data.mallData.length; i++) {
      storeList.push(`{"storeId": "${this.data.mallData[i].storeId}","receiverMessage": "","conformId": null,"voucherId": null,"goodsList": [{"registerId": "${this.data.registerId}","orderType": "${this.data.orderType}","goodsId": "${this.data.mallData[i].goodsId}","buyNum": "${this.data.mallData[i].buyNum}","cartId": "${this.data.mallData[i].cartId}"}]}`)
    }
    buy = `{"isCart": 0,"mobile":"${this.data.stepOneData.mobile}","realName":"${this.data.stepOneData.realName}","couponIdList":[],"usePoints":0,"storeList":[${storeList}]}`
    wx.request({
      url: this.data.step2Url,
      data: {
        "token": wx.getStorageSync('shopToken'),
        "clientType": "miniprogram",
        "buyData": buy
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //FormData请求修改此处即可
      },
      success(res) {
        console.log(res, "this is res")
        // 加个状态码不是200的话提示错误信息然后返回页面
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            that.data.payId = res.data.datas.payId;
            that.payMent();
          } else {
            wx.showToast({
              title: res.data.datas.error || "请求错误",
              icon: "none"
            })
          }
        } else {
          wx.showToast({
            title: res.data.datas.error || "请求错误",
            icon: "none"
          })
        }
        wx.hideLoading();
      }
    })
  },
  //支付订单
  payMent() {
    let that = this;
    // if (this.data.isInquiry) {
    let url = `${cng.APP_SERVER}/api/member/buy/pay/virtual/wx/miniprogram/pay2?token=${wx.getStorageSync('shopToken')}&payId=${this.data.payId}&openid=${wx.getStorageSync('openid')}`
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {},
      success(res) {
        console.log(res, "this is res pay2");
        if (res.statusCode == 200) {
          console.log(res.data)
          that.weChatPay(res.data);
        } else {
          wx.showToast({
            title: '数据请求出错，请重试..',
            icon: "none"
          })
        }
      }
    })
    // } else {
    // wx.request({
    //   // /member/buy/pay/wx/miniprogram/pay 
    //   url: `${cng.APP_SERVER}/api/member/buy/pay/wx/miniprogram/pay2?token=${wx.getStorageSync('shopToken')}&payId=${this.data.payId}&openid=${wx.getStorageSync('openid')}`,
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' //FormData请求修改此处即可
    //   },
    //   data: {

    //   },
    //   success: function (res) {
    //     if (res.statusCode == 200) {
    //       console.log(res.data)
    //       that.weChatPay(res.data);
    //     } else {
    //       wx.showToast({
    //         title: '数据请求出错，请重试..',
    //         icon: "none"
    //       })
    //     }
    //   }
    // });
    // }
  },
  // 微信支付
  weChatPay(event) {
    console.log(event, "this  is event");
    if (event.isPay == "1") {
      getApp().globalData.isTmId = false;
      wx.switchTab({
        url: '/pages/message/main/main',
      })
    } else {
      wx.requestPayment({
        'timeStamp': event.timeStamp,
        'nonceStr': event.nonceStr,
        'package': 'prepay_id=' + event.package,
        'signType': event.signType,
        'paySign': event.paySign,
        'success': function (res) {
          console.log(res, "this is res");
          //小程序微信支付成功的回调通知 
          if (event.type == 'virtual') {
            getApp().globalData.isTmId = false;
            wx.switchTab({
              url: '/pages/message/main/main',
            })
          } else if (event.type == 'chufang' || event.type == 'chain') {
            wx.navigateTo({
              url: '/pageOther/page/prescription-renewal/all-prescription/index'
            })
          } else if (event.type == 'feichufang') {
            wx.switchTab({
              url: '/pages/person/index'
            })
          } else {
            wx.switchTab({
              url: 'pages/home/home'
            })
          }
        },
        //小程序支付失败的回调通知  
        'fail': function (res) {
          console.log("支付失败", res);
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        }
      })
    }
  },

  // 转为formdata格式  用于传递FormData格式的参数
  // formdata(obj = {}) {
  //   let result = ''
  //   for (let name of Object.keys(obj)) {
  //     let value = obj[name];
  //     result +=
  //       '\r\n--XXX' +
  //       '\r\nContent-Disposition: form-data; name=\"' + name + '\"' +
  //       '\r\n' +
  //       '\r\n' + value
  //   }
  //   return result + '\r\n--XXX--'
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

  }
})