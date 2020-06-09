// pageOther/page/doctor/doctor-detail/index.js
import { doctorInfo, evaluateList } from '../../../../utils/wx_network/doctor'
import config from '../../../../utils/huanxinIM/WebIMConfig';
const cfg = require("../../../../utils/config")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    doctorInfo:{},//医生详情
    inquiryType:'',//问诊类型
    inquiryMoney:'',//问诊价格
    evaluation:[],
    doctorId:'',//医生ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.doctorId = options.doctorId;
    
  },

  getDoctorDetail(){
    doctorInfo({'doctorId':this.data.doctorId,'hospitalId':cfg.HOSPITAL_ID,'userId':wx.getStorageSync('userId')}).then(res => {
      console.log(res,"this is res");
      if(res.code == 200){
        this.setData({
          doctorInfo:res.data,
          business1:res.data.business.indexOf(1),
          business2:res.data.business.indexOf(2),
          business3:res.data.business.indexOf(3),
        })
        this.evaluateList();
      }
    })
  },

//医生评价列表
  evaluateList(){
    let params = {
      doctorId: this.data.doctorId,
      hospitalId: cfg.HOSPITAL_ID
    }
    evaluateList(params).then(res => {
      this.setData({
        evaluation:res.data
      })
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
    this.getDoctorDetail();
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
  //选择的是哪个问诊类型
  inquiryTypeBtn(e) {
    let currentSelect=false ,current1=false,current2=false,current3=false;
    if(e.currentTarget.dataset.current == 1){
      this.data.inquiryType = '图文问诊';
      this.data.inquiryMoney = this.data.doctorInfo.textPrice;
      currentSelect = e.currentTarget.dataset.current==1&&this.data.business1!=-1;
      current1 = currentSelect;
    }
    else if(e.currentTarget.dataset.current == 3){
      this.data.inquiryType = '视频问诊'
      this.data.inquiryMoney = this.data.doctorInfo.videoPrice;
      currentSelect = e.currentTarget.dataset.current==3&&this.data.business3!=-1;
      current3 = currentSelect;
    }else{
      this.data.inquiryType = '语音问诊'
      this.data.inquiryMoney = this.data.doctorInfo.voicePrice;
      currentSelect = e.currentTarget.dataset.current==2&&this.data.business2!=-1;
      current2 = currentSelect;
    }
    this.setData({
      current: e.currentTarget.dataset.current,
      inquiryType:this.data.inquiryType,
      inquiryMoney:this.data.inquiryMoney,
      current1,current2,current3,
      currentSelect
    })
  },
  //如果是图文问诊的话跳转到快速问诊页面
  selDoctorInquiry(options) {
    let url = ``;
    if(!this.data.inquiryType){
      wx.showToast({
        title: '注意：请选择问诊类型',
        icon: 'none'
      })
      return
    }
    if(!this.data.currentSelect){
      wx.showToast({
        title: '注意：医生未开通',
        icon: 'none'
      })
    }else{
      if(options.currentTarget.dataset.current==1){
        url = `/pageOther/page/inquiry/fast-inquiry/index?doctorId=${options.currentTarget.dataset.doctorid}&orderType=1&flagFastInquiry=true`;
      }else if(options.currentTarget.dataset.current==3){
        // url = `/pageOther/page/doctor/doctor-schedule/index?doctorId=${options.currentTarget.dataset.doctorid}&orderType=3&flagFastInquiry=true`;
        url = `/pageOther/page/inquiry/fast-inquiry/index?doctorId=${options.currentTarget.dataset.doctorid}&orderType=3&flagFastInquiry=true`;
      }
      wx.navigateTo({
        url
      })
    }
  },
  //跳转到个人简介
  personalProfile(){
    wx.navigateTo({
      url: `/pageOther/page/doctor/personal-profile/index?doctorInfo=${JSON.stringify(this.data.doctorInfo)}`,
    })
  },
})