// pageOther/page/select-patient/selectPatient.js
import {
  patientList,
  updatePatient
} from '../../../../utils/wx_network/patient'
import { APP_SERVER } from '../../../../utils/config'
import {
  getAgeByIdCard
} from '../../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientItems: [],//病人列表
    refresherState: false,//下拉刷新状态
    patientId: '',//选中的patient
    registerId: '',//订单ID
    orderType: '',//订单类型
  },
  //下拉刷新
  bindrefresherrefresh(e) {
    this.patientList().then(res => {
      //延時不會讓動畫太突兀
      setTimeout(() => {
        this.setData({
          refresherState: false
        })  
      }, 500);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"this is options")
    this.setData({
      flagFastInquiry : options.flagFastInquiry
    })
    this.data.registerId = wx.getStorageSync('registerId') || '';
    this.data.orderType = options.orderType || 1;
    this.patientList();
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
    this.data.patientId = '';
    this.patientList();
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
    console.log("下拉动作")
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
  //获取就诊人列表
  patientList() {
    return new Promise((resolve, reject) => {
      let params = {
        userId: wx.getStorageSync('userId')
      }
      patientList(params).then(res => {
        this.data.patientItems = res.data;
        for (let item of this.data.patientItems) {
          item.age = getAgeByIdCard(item.idCard);
          item.value = item.patientId;
        }
        this.setData({
          patientItems: this.data.patientItems
        })
        resolve(res)
      })
    })
  },

  //单选改变触发
  radioChange(e) {
    this.data.patientId = e.detail.value;
  },
  //编辑就诊人信息
  updatePatient(){
    let patient= {};
    if(!this.data.patientId){
      wx.showToast({
        title: '请选择某一就诊人进行编辑操作',
        icon:"none"
      })
      return;
    }
    for(let i of this.data.patientItems){
      if(this.data.patientId == i.patientId){
        patient = i
      }
    }
    wx.navigateTo({
      url: `/pageOther/page/patient/patient-list/index?patient=${JSON.stringify(patient)}`,
    })
  },
  //页面跳转
  goToPage() {
    if(this.data.patientId){
      let params = {
        patientId: this.data.patientId,
        registerId: this.data.registerId
      }
      updatePatient(`/inquiry/patient/symptom/updatePatient?patientId=${this.data.patientId}&registerId=${this.data.registerId}`,params).then(res => {
        if (res.code == 200) {
          if(res.data){
            // let cartList = res.data;
            // let buyData = encodeURI(JSON.stringify(cartList));
            // //虚拟订单支付页面路径buy_virtual_step1
            // let url = `${APP_SERVER}/wap/tmpl/buy/buy_virtual_step1.html?registerId=${this.data.registerId}&orderType=${this.data.orderType}&token=${wx.getStorageSync('hyjToken')}&isCart=0&buyData=${buyData}`;
            // let data = escape(url) 
            // wx.navigateTo({
            //   url: `../other/shop-mall/index?url=${data}`,
            // })
            
          }else{
            wx.setStorageSync('flagDoctorShow', false);
            wx.navigateTo({
              url: `/pageOther/page/doctor/find-doctor/index?registerId=${this.data.registerId}&matchDoctor=1&patientId=${this.data.patientId}&orderType=${this.data.orderType}`,
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请选择就诊人',
        icon:'none'
      })
    }
  },
  createPatient() {
    wx.navigateTo({
      url: '/pageOther/page/patient/patient-list/index',
    })
  }
})