// pageOther/page/doctor/doctor-schedule/index.js
import {
  schedules,doctorInfo
} from '../../../../utils/wx_network/doctor'
const cfg = require("../../../../utils/config")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showtab: 0, //顶部选项卡索引
    tabnav: {
      tabnum: 5,
      tabitem: []
    },
    currentTab:0,
    items:[],
    orderType: 0,
    doctorId: '',
  },
  setTab: function (e) {
    const edata = e.currentTarget.dataset;
    this.setData({
      showtab: edata.tabindex,
      currentTab:edata.tabindex
    })
  },

  switchTab(event){
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      showtab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  },

  getRouterData() {
    wx.showLoading({
      title: '加载中....',
    })
    let queryParam = {
      orderType: this.data.orderType,
      doctorId: this.data.doctorId,
      hospitalId:getApp().globalData.hospitalId
    };
    schedules(queryParam).then(res => {
      console.log(res,"this is res")
      if (res.code == 200 && res.data != null) {
        let schedules = res.data;
        if (schedules == null) {
          return;
        }
        for (var i = 0; i < schedules.length; i++) {
          let one = {
            name: i,
            label: schedules[i].date,
            item: schedules[i].item,
          };
          for(let j = 0;j<schedules[i].item.length;j++ ){
            schedules[i].item[j].start = schedules[i].item[j].startTime.substring(10,schedules[i].item[j].startTime.length-3)
            schedules[i].item[j].end = schedules[i].item[j].endTime.substring(10,schedules[i].item[j].endTime.length-3)
          }
          this.data.items.push(one);
        }
        console.log(this.data.items,"this is items");
        this.setData({
          items: this.data.items
        })
      }
      wx.hideLoading();
    });
  },

  getDoctorInfo(){
    doctorInfo({'doctorId': this.data.doctorId,'hospitalId':cfg.HOSPITAL_ID,'userId':wx.getStorageSync('userId')}).then(res => {
      console.log(res,"this is res");
      if(res.code == 200){
        this.setData({
          doctor:res.data
        })
      }
    })
  },

  //问诊
  createOder(event){
    console.log(event.currentTarget.dataset.item.item[0].resLeft<0,"")
    if(event.currentTarget.dataset.item.item[0].resLeft>0){
      wx.navigateTo({
        url: `/pageOther/page/inquiry/fast-inquiry/index?orderType=${event.currentTarget.dataset.item.item[0].orderType}&flagFastInquiry=true`,
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"this is options")
    this.data.orderType = options.orderType;
    this.data.doctorId = options.doctorId;
    this.getRouterData();
    this.getDoctorInfo();
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