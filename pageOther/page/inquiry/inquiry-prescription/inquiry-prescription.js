// pageOther/page/inquiry/inquiry-prescription/inquiry-prescription.js
// 复方续购支付订单
const cng = require("../../../../utils/config");
import {
  fomtDataServe
} from '../../../../utils/wx_network/network'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buy: '',
    payId: '',
    freight: "", //地址显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderType = 4;
    this.data.registerId = options.registerId;
    this.data.itemData = JSON.parse(options.item);
    this.data.buyData = decodeURI(options.buyData);
    this.step1();
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
    wx.request({
      url: `${cng.APP_SERVER}/api/member/buy/step1`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //FormData请求修改此处即可
      },
      data: params,
      success: function (res) {
        console.log("this is step1 48 inquiry-prescription", res);
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            let mallData = res.data.datas.buyStoreVoList[0].buyGoodsItemVoList;
            let allmallData = res.data.datas.buyStoreVoList[0];
            that.data.stepOneData = res.data.datas;
            that.setData({
              mallData: mallData,
              stepOneData: that.data.stepOneData,
              itemData: that.data.itemData,
              allmallData: allmallData
            })
            let ad = res.data.datas.address == null ? null : res.data.datas.address.addressId;
            let storeList = [];
            for (let i = 0; i < that.data.mallData.length; i++) {
              storeList.push(`{"storeId": "${that.data.mallData[i].storeId}","receiverMessage": "","conformId": null,"voucherId": null,"goodsList": [{"registerId": "${that.data.registerId}","orderType": "${that.data.orderType}","goodsId": "${that.data.mallData[i].goodsId}","buyNum": "${that.data.mallData[i].buyNum}","cartId": "${that.data.mallData[i].cartId}"}]}`)
            }
            that.data.buy = `{"addressId":"${ad}","paymentTypeCode":"online","isCart":"${that.data.stepOneData.isCart}","idCard":null,"isGroup":"${that.data.stepOneData.isGroup}","groupId":"0","goId":"","bargainOpenId":"","isExistBundling":"","isExistTrys":0,"usePoints":0,"couponIdList":[],"storeList":[${storeList}]}`
            if (res.data.datas.address != null) {
              that.freight();
            }
            that.calc();
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
            title: res.data + '',
            icon: "none"
          })
        }
      }
    });
  },
  // 运费计算
  freight() {
    let params = {
      "token": wx.getStorageSync('shopToken'),
      "clientType": "miniprogram",
      "buyData": this.data.buy
    }
    fomtDataServe(`/api/member/buy/calc/freight`, params).then(res => {
      console.log(res, "99 inquiry-prescription");
      this.setData({
        freight: res.datas.address
      })
    })
  },
  // 金额计算
  calc() {
    let params = {
      "token": wx.getStorageSync('shopToken'),
      "clientType": "miniprogram",
      "buyData": this.data.buy
    }
    fomtDataServe(`/api/member/buy/calc`, params).then(res => {
      console.log(res, "计算金额");
      this.setData({
        calc: res.datas
      })
    })
  },

  // 提交订单支付按钮 
  submitOrderBtn() {
    var that = this;
    if (!this.data.freight) {
      wx.showToast({
        title: '请先选择地址...',
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '提交订单中...',
        icon: "none"
      })
      wx.request({
        url: `${cng.APP_SERVER}/api/member/buy/step2`,
        data: {
          "token": wx.getStorageSync('shopToken'),
          "clientType": "miniprogram",
          "buyData": this.data.buy
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' //FormData请求修改此处即可
        },
        success(res) {
          console.log(res, "inquiry-prescription 146")
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
    }
  },

  payMent() {
    let that = this;
    wx.showLoading({
      title: '请稍等',
      icon:"none"
    })
    wx.request({
      // /member/buy/pay/wx/miniprogram/pay 
      url: `${cng.APP_SERVER}/api/member/buy/pay/wx/miniprogram/pay2?token=${wx.getStorageSync('shopToken')}&payId=${this.data.payId}&openid=${wx.getStorageSync('openid')}`,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //FormData请求修改此处即可
      },
      data: {},
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res.data)
          that.weChatPay(res.data);
        } else {
          wx.showToast({
            title: '数据请求出错，请重试..',
            icon: "none"
          })
        }
        wx.hideLoading();
      }
    });
  },

  // 微信支付
  weChatPay(event) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页
    if (currPage.data.pre_item) {
      //调取接口操作
      let storeList = [];
      for (let i = 0; i < that.data.mallData.length; i++) {
        storeList.push(`{"storeId": "${that.data.mallData[i].storeId}","receiverMessage": "","conformId": null,"voucherId": null,"goodsList": [{"registerId": "${that.data.registerId}","orderType": "${that.data.orderType}","goodsId": "${that.data.mallData[i].goodsId}","buyNum": "${that.data.mallData[i].buyNum}","cartId": "${that.data.mallData[i].cartId}"}]}`)
      }
      that.data.buy = `{"addressId":"${currPage.data.pre_item.addressId}","paymentTypeCode":"online","isCart":"${that.data.stepOneData.isCart}","idCard":null,"isGroup":"${that.data.stepOneData.isGroup}","groupId":"0","goId":"","bargainOpenId":"","isExistBundling":"","isExistTrys":0,"usePoints":0,"couponIdList":[],"storeList":[${storeList}]}`
    }
    if (this.data.buy != '') {
      this.freight();
      this.calc();
    }
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
  //跳转到地址管理
  goAddressManagerBtn() {
    let addressId = "";
    if (this.data.freight) {
      addressId = this.data.freight.addressId
    }
    wx.navigateTo({
      url: `/pageOther/page/other/place-manager/index?addressId=${addressId||''}`,
    })
  },
})