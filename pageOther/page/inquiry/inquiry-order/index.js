// pageOther/page/inquiry/inquiry-order/index.js
import {
  step1,
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
    stepOneData:{},
    payId:0,//支付id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("问诊订单参数数据", options);
    this.data.registerId = options.registerId;
    this.data.buyData = decodeURI(options.buyData);
    this.step1();
    // this.orderPreview();
  },

  // 用户订单信息
  orderPreview() {
    let params = {
      registerId: this.data.registerId
    }
    orderPreview(params).then(res => {
      console.log("根据registerId获取订单用户信息", res)
    })
  },

  // 商城信息
  step1() {
    let that = this;
    let params = {
      "token": wx.getStorageSync('hyjToken'),
      "buyData": this.data.buyData,
      "clientType": "wap",
      "isCart": 0
    }
    let buyData = this.formdata(params);
    wx.request({
      url: 'https://demo.hyj91.com/api/member/buy/virtual/step1',
      method: 'POST',
      header: {
        'content-type': 'multipart/form-data; boundary=XXX'
      },
      data: buyData,
      success: function (res) {
        let mallData = res.data.datas.buyStoreVoList[0].buyGoodsItemVoList[0];
        that.data.stepOneData = res.data.datas;
        let orderType = mallData.goodsFullSpecs.split("：")[1];
        that.setData({
          mallData: mallData,
          orderType: orderType
        })
      }
    });
  },
  // 提交订单支付按钮 
  submitOrderBtn() {
    let that = this;
    let buy = `{"isCart": 0,"mobile":"${this.data.stepOneData.mobile}","realName":"${this.data.stepOneData.realName}","couponIdList":[],"usePoints":0,"storeList":[{"storeId":${this.data.mallData.storeId},"receiverMessage":"","conformId":null,"voucherId":null,"goodsList":[{"registerId":"${this.data.registerId}","orderType":"${this.data.orderType}","goodsId":${this.data.mallData.goodsId},"buyNum":${this.data.mallData.buyNum},"cartId":${this.data.mallData.cartId}}]}]}`
    let params = {
      "token": wx.getStorageSync('hyjToken'),
      "clientType": "miniprogram",
      "buyData":buy
    }
    wx.request({
      url: 'https://demo.hyj91.com/api/member/buy/virtual/step2',
      data: {
        "token": wx.getStorageSync('hyjToken'),
        "clientType": "miniprogram",
        "buyData":buy
      },
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //FormData请求修改此处即可
      },
      success (res) {
        console.log(res.data.datas.payId);
        that.data.payId = res.data.datas.payId;
        that.payMent();
      }
    })
  },
//支付订单
  payMent(){
    // let that = this;
    // wx.request({
    //   url: 'https://demo.hyj91.com/api/member/buy/pay/virtual/wx/miniprogram/pay',
    //   data: {
    //     "token": wx.getStorageSync('hyjToken'),
    //     "payId": this.data.payId,
    //     "openid": wx.getStorageSync('openid')
    //   },
    //   method:'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' //FormData请求修改此处即可
    //   },
    //   success (res) {
    //     console.log(res);
    //   }
    // })

    let url = `${cng.APP_SERVER}/api/member/buy/pay/virtual/wx/miniprogram/pay?token=${wx.getStorageSync('hyjToken')}&payId=${this.data.payId}&openid=${wx.getStorageSync('openid')}`
    let data = escape(url)
    wx.navigateTo({
      url: `/pageOther/page/other/shop-mall/index?url=${data}`,
    })
  },
  // 转为formdata格式  用于传递FormData格式的参数
  formdata(obj = {}) {
    let result = ''
    for (let name of Object.keys(obj)) {
      let value = obj[name];
      result +=
        '\r\n--XXX' +
        '\r\nContent-Disposition: form-data; name=\"' + name + '\"' +
        '\r\n' +
        '\r\n' + value
    }
    return result + '\r\n--XXX--'
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