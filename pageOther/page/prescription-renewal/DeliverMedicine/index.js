// pageOther/page/prescription-renewal/DeliverMedicine/index.js
import {
  getMyRecipelList,
  getPrescriptionApp,
  rebuyorder
} from "../../../../utils/wx_network/inquiry"
const cng = require("../../../../utils/config")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    navname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getMyRecipelList();
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
  buyPrescript(item1) {
    console.log(item1, "this is item");
    this.getPrescriptionApp(item1.currentTarget.dataset.item);
  },
  
  getPrescriptionApp(item) {
    let params = {
      pgoupNo: item.pgoupNo,
      userId: wx.getStorageSync('userId')
    }
    getPrescriptionApp(params).then(res => {
      console.log(res, "this is res");
      let prescription = res.data;
      let cfdata = prescription.RxInfo;
      let type = prescription.type;
      let isCart = 1;
      if (type == 'other' || type == "overseas") {
        for (let i = 0; i < cfdata.length; i++) {
          if (cfdata[i].cartId == "0" || cfdata[i].cartId == 0) {
            isCart = 0;
          }
          cfdata[i].goodsId = cfdata[i].cartId;
        }
      }
      let buyData = encodeURI(JSON.stringify(cfdata));
      wx.navigateTo({
        url: `/pageOther/page/inquiry/inquiry-prescription/inquiry-prescription?registerId=${item.pgoupNo}&orderType=1&token=${wx.getStorageSync('hyjToken')}&isCart=0&buyData=${buyData}&item=${JSON.stringify(item)}`,
      })
    })
  },


  //处方列表
  getMyRecipelList() {
    // 这个是我的用药显示列表  默认只显示5条记录  查看全部才显示所有处方列表
    let params = {
      current: 1,
      size: 5,
      userId: wx.getStorageSync('userId')
    }
    getMyRecipelList(params).then(res => {
      this.setData({
        records: res.data.records
      })
    })
  },
  goToPage(options) {
    let url = '';
    if (options.currentTarget.dataset.navname == "findDoctor") {
      url = `/pageOther/page/inquiry/fast-inquiry/index?flagFastInquiry=false`
    } else if (options.currentTarget.dataset.navname == "allPresciption") {
      url = '/pageOther/page/prescription-renewal/all-prescription/index'
    }
    wx.navigateTo({
      url: url
    })
  },
  //处方复购
  reGotoOrder(event) {
    console.log(event, "this is item");
    rebuyorder({
      registerId: event.currentTarget.dataset.item.registerId
    }).then(res => {
      if(res.code == 200){
        getApp().globalData.tmId= event.currentTarget.dataset.item.tmId;
        getApp().globalData.isTmId = true;
        wx.switchTab({
          url: `/pages/message/main/main`,
        })
      }else{
        wx.showToast({
          title: res.msg+'',
          icon:"none"
        })
      }
      console.log(res, "this is res");
    })
  },
})