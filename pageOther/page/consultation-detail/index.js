// pageOther/page/consultation-detail/index.js
import {
  consulDetail
} from '../../../utils/wx_network/inquiry'
import { getAgeByIdCard } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    csult: {},
    registerId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.registerId){
      this.data.registerId = options.registerId;
    }
    this.consulDetail();
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
    console.log(this.data.registerId,"this is registerId");
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
  //获取详情
  consulDetail() {
    let params = {
      registerId: this.data.registerId
      // TODOS:暂时没registerId
      // registerId:'51482609845031008500'
    }
    consulDetail(params).then(res => {
      if (res.code == 200) {
        this.data.csult = res.data;
        if (this.data.csult.recordVO.diagnosis) {
          this.data.csult.recordVO.diagnosis = JSON.parse(this.data.csult.recordVO.diagnosis).join(",")
        }
        this.data.csult.age = getAgeByIdCard(this.data.csult.idCard);
        console.log(this.data.csult)
        this.setData({
          csult: this.data.csult
        })
      }
    })
  },
  //跳转到电子处方列表
  goToCf(){
    console.log(this.data.csult,"this is csult");
    if(this.data.csult.pgoupNo==null){
      wx.showToast({
        title: '未找到该问诊的处方',
        icon:"none"
      })
      return;
    }
    wx.navigateTo({
      url: `/pageOther/page/prescription-renewal/prescription-detail?pgoupNo=${this.data.csult.pgoupNo}&registerId=${this.data.csult.registerId}`,
    })
  },
  //页面跳转
  goToPage(e){
    if(Object.keys(e.currentTarget.dataset.csult).length === 0){
      wx.showToast({
        title: '信息错误',
        icon:"none"
      })
      return;
    }
    wx.navigateTo({
      url: `/pageOther/page/doctor/doctor-detail/index?doctorId=${e.currentTarget.dataset.csult.doctorId}`,
    })
  },
  // 跳转到快速问诊
  toQuickInquiry(e){
    if(Object.keys(e.currentTarget.dataset.csult).length === 0){
      wx.showToast({
        title: '信息错误',
        icon:"none"
      })
      return;
    }
    
    wx.navigateTo({
      url: `/pageOther/page/inquiry/fast-inquiry/index?doctorId=${e.currentTarget.dataset.csult.doctorId}&flagFastInquiry=true`,
    })
  },
})