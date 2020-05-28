// pageOther/page/doctor/doctor-detail/index.js
import { doctorInfo } from '../../../../utils/wx_network/doctor'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rateValue:4,//评分
    doctorInfo:{},//医生详情
    inquiryType:'',//问诊类型
    inquiryMoney:'',//问诊价格
    evaluation:[
      {id:1,name:"张某某",time:"2020-01-02",rateValue:5,evaluation:"医生非常好，什么都会，解答很开心"},
      {id:1,name:"陈生",time:"2020-01-02",rateValue:1,evaluation:"医生非常好，什么都会，解答很开心"},
      {id:1,name:"赵生",time:"2019-10-18",rateValue:2,evaluation:"医生非常好，什么都会，解答很开心"},
      {id:1,name:"刘某",time:"2020-11-05",rateValue:4,evaluation:"医生非常好，什么都会，解答很开心"},
      {id:1,name:"黄生",time:"2018-09-30",rateValue:5,evaluation:"我很佩服有些医生，他不止懂自己医学专业的知识，而且还上知天文下知地理，无所不知，不所不晓，跟患者解答完全是在秀自己高超的技术，但是这种谈论也非常能让患者开心"},
      {id:1,name:"李某",time:"2016-05-01",rateValue:3,evaluation:"我很佩服有些医生，他不止懂自己医学专业的知识，而且还上知天文下知地理，无所不知，不所不晓，跟患者解答完全是在秀自己高超的技术，但是这种谈论也非常能让患者开心"},
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //TODOS 这里拿的openId是tenantId，不是传入的医院ID   wx.getStorageSync('tenantId')
    doctorInfo({'doctorId':options.doctorId,'hospitalId':app.globalData.hospitalId,'userId':wx.getStorageSync('userId')}).then(res => {
      // TODOS 現在正式库没有返回这个字段，所以判断一下，如果没有就设置为空数组。
      if(!res.data.business){
        res.data.business="[1]"
      }
      
      this.setData({
        doctorInfo:res.data,
        business1:res.data.business.indexOf(1),
        business2:res.data.business.indexOf(2),
        business3:res.data.business.indexOf(3),
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
    else if(e.currentTarget.dataset.current == 2){
      this.data.inquiryType = '视频问诊'
      this.data.inquiryMoney = this.data.doctorInfo.videoPrice;
      currentSelect = e.currentTarget.dataset.current==2&&this.data.business2!=-1;
      current2 = currentSelect;
    }else{
      this.data.inquiryType = '语音问诊'
      this.data.inquiryMoney = this.data.doctorInfo.voicePrice;
      currentSelect = e.currentTarget.dataset.current==3&&this.data.business3!=-1;
      current3 = currentSelect;
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
    console.log(this.data.inquiryType=='',"this is inquiryType")
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
        wx.navigateTo({
          url: `/pageOther/page/inquiry/fast-inquiry/index?doctorId=${options.currentTarget.dataset.doctorid}&orderType=1&flagFastInquiry=true`,
        })
      }
    }
  },
  //跳转到个人简介
  personalProfile(){
    wx.navigateTo({
      url: `/pageOther/page/doctor/personal-profile/index?doctorInfo=${JSON.stringify(this.data.doctorInfo)}`,
    })
  },
})