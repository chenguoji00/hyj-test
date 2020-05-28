// pageOther/page/patient-list/index.js
import {
  timeSet
} from "../../../../utils/util";
import {
  aadPatient,
  updatePatientDetail,
  removePatient
} from "../../../../utils/wx_network/patient"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientName: "",
    isSex: "1",
    show: false,
    idCardNum: '', //身份證號碼
    patientId:'',//看诊人ID
  },
  //选择日期触发
  bindDateChange(event) {
    this.setData({
      value: event.detail.value
    })
  },
  //输入姓名时触发
  patientNameInput(e) {
    this.setData({
      patientName: e.detail
    })
  },
  //输入身份证时触发
  idCartInput(e) {
    console.log(e, "this is e");
    this.setData({
      idCardNum: e.detail
    })
  },
  //设置性别
  isSexClick(event) {
    this.setData({
      isSex: event.detail,
    });
  },
  //提交檔案 
  submitPatientBtn(e) {
    //TODOS 接口没要求要填入出生年月日以及性别要求
    if(!this.data.patientName){
      wx.showToast({
        title: '姓名不能为空',
        icon:"none"
      })
      return;
    }
    else if(!this.data.idCardNum){
      wx.showToast({
        title: '证件号码不能为空',
        icon:"none"
      })
      return;
    }
    let params = {
      addressStr: "[]",
      detailAdress: "",
      idCard: this.data.idCardNum,
      patientId: "",
      patientName: this.data.patientName,
      phone: wx.getStorageSync('phone'),
      setDefault: 1,
      userId: wx.getStorageSync('userId')
    }
    aadPatient(params).then(res => {
      if(res.code == 200){
        wx.showToast({
          title: '新增成功，正在跳转',
          icon:"none"
        })
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
    })
  },
  // 修改就诊人
  updatePatientBtn(){
    //TODOS 接口没要求要填入出生年月日以及性别要求
    if(!this.data.patientName){
      wx.showToast({
        title: '姓名不能为空',
        icon:"none"
      })
      return;
    }
    else if(!this.data.idCardNum){
      wx.showToast({
        title: '证件号码不能为空',
        icon:"none"
      })
      return;
    }
    let params = {
      addressStr: "[]",
      detailAdress: "",
      idCard: this.data.idCardNum,
      patientId: this.data.patientId,
      patientName: this.data.patientName,
      phone: wx.getStorageSync('phone'),
      setDefault: 1,
      userId: wx.getStorageSync('userId')
    }
    updatePatientDetail(params).then(res=>{
      if(res.code == 200){
        wx.showToast({
          title: '修改成功，正在跳转',
          icon:"none"
        })
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      }
    })
  },
  deletePatientBtn(){
    if(this.data.patientId){
      removePatient({patientId:this.data.patientId}).then(res=>{
        if(res.code == 200){
          wx.showToast({
            title: '删除成功',
            icon:"none"
          })
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        }
        
      })
    }else{
      wx.showToast({
        title: '就诊人信息有误，请重试',
        icon:'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.patient){
      let optPatient = JSON.parse(options.patient);
      this.data.patientId = optPatient.patientId;
      this.setData({
        idCardNum:optPatient.idCard,
        value:optPatient.birthDate.substring(0,10),
        patientName:optPatient.patientName,
        isSex:optPatient.sex.toString(),
        updateState:true
      })
    }
    this.setData({
      endDate: timeSet()
    })
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

  },

})