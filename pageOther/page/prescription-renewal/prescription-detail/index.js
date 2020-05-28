// pageOther/page/prescription-renewal/prescription-detail/index.js
import {
  consulDetail,
  getPrescriptionApp
} from '../../../../utils/wx_network/inquiry'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registerId: '',
    pgoupNo:'',
    prescription:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.registerId = options.registerId;
    this.data.pgoupNo = options.pgoupNo;
    this.consulDetail();
    this.getPrescriptionApp();
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
  //问诊详情
  consulDetail() {
    let params = {
      // registerId: this.data.registerId
      registerId: this.data.registerId
      
    }
    consulDetail(params).then(res => {
      if (res.code == 200) {
        this.data.csult = res.data;
        if (this.data.csult.recordVO.diagnosis) {
          this.data.csult.recordVO.diagnosis = JSON.parse(this.data.csult.recordVO.diagnosis).join(",")
        }
        this.setData({
          csult: this.data.csult
        })
      }
    })
  },
  // 电子处方
  getPrescriptionApp() {
    let params = {
      pgoupNo : this.data.pgoupNo,
      userId : wx.getStorageSync('userId')
    }
    getPrescriptionApp(params).then(res => {
      this.setData({
        prescription:res.data
      })
    })
  },
  // 查看电子处方笺
  preChuFang(){
    wx.previewImage({
      urls: this.data.prescription.purlList,
    })
  },
})