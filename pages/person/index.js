// pages/person/index.js
const app = getApp();
import {
  patientList
} from '../../utils/wx_network/patient'
import {
  getAgeByIdCard,
} from '../../utils/util'
const cng = require("../../utils/config");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avater: '',
    healthRecord: []
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
    // 如果没有用户的信息的话就需要跳转到登录页面
    if (!wx.getStorageSync('wxUserInfo')) {
      wx.navigateTo({
        url: `/pageOther/page/other/login/login`,
      })
    } else {
      let wxUserInfo = wx.getStorageSync('wxUserInfo')
      if (wxUserInfo) {
        this.setData({
          wxUserInfo
        })
      }
      this.patientList()
    }
  },

  patientList() {
    let params = {
      userId: wx.getStorageSync('userId')
    }
    patientList(params).then(res => {
      this.data.healthRecord = [...res.data];
      for (let item of this.data.healthRecord) {
        item.age = getAgeByIdCard(item.idCard);
        item.value = item.patientId;
        item.idCards = item.idCard.substring(0, 10) + '*****' + item.idCard.substring(14, 17)
      }
      this.setData({
        healthRecord: this.data.healthRecord
      })
    })
  },

  //跳转到用户档案修改页面
  goUpdateRecode(event) {
    wx.navigateTo({
      url: `/pageOther/page/patient/patient-list/index?patient=${JSON.stringify(event.currentTarget.dataset.item)}`,
    })
  },

  orderBtn(e) {
    console.log(e.currentTarget.dataset.item, "e");
    let item = e.currentTarget.dataset.item;
    let url = '';
    if (item == "quanbu") {
      url = `${cng.APP_SERVER}/wap/tmpl/member/order_list.html?t=${new Date().getTime()}&token=${wx.getStorageSync('shopToken')}`;
    } else if (item == "daifukuai") {
      url = `${cng.APP_SERVER}/wap/tmpl/member/order_list.html?t=${new Date().getTime()}&token=${wx.getStorageSync('shopToken')}&data-state=new`;
    } else if (item == "daifahuo") {
      url = `${cng.APP_SERVER}/wap/tmpl/member/order_list.html?t=${new Date().getTime()}&token=${wx.getStorageSync('shopToken')}&data-state=pay`;
    } else if (item == "daipingjia") {
      url = `${cng.APP_SERVER}/wap/tmpl/member/order_list.html?t=${new Date().getTime()}&token=${wx.getStorageSync('shopToken')}&data-state=noeval`;
    } else if (item == "shouquhuo") {
      url = `${cng.APP_SERVER}/wap/tmpl/member/order_list.html?t=${new Date().getTime()}&token=${wx.getStorageSync('shopToken')}&data-state=send`;
    }
    let data = escape(url)
    wx.navigateTo({
      url: `/pageOther/page/other/shop-mall/index?url=${data}`
    })
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
  //业务跳转
  goToPage(e) {
    let navName = e.currentTarget.dataset.navname;
    let route = ''
    if (navName == "myMedication") {
      // route = '/pageOther/page/prescription-renewal/DeliverMedicine/index' //跳转到送药上门
      route = '/pageOther/page/prescription-renewal/all-prescription/index' //跳转到我的用药
    } else if (navName == "myConsultation") {
      route = '/pageOther/page/my-consultation/index'
    } else if (navName == "perfectInformation") {
      route = '/pageOther/page/person/person-info/index'
    } else if (navName == "setting") {
      route = '/pageOther/page/person/setting/index'
    } else if (navName == 'patient-list') {
      route = '/pageOther/page/patient/patient-list/index'
    }
    wx.navigateTo({
      url: route,
    })
  },
})