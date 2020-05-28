// pages/person/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avater: ''
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
    if(!wx.getStorageSync('wxUserInfo')){
      wx.navigateTo({
        url: `/pageOther/page/other/login/login`,
      })
    }else{
      let wxUserInfo = wx.getStorageSync('wxUserInfo')
      if(wxUserInfo){
        this.setData({
          wxUserInfo
        })
      }
      
    }
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
      route = '/pageOther/page/prescription-renewal/DeliverMedicine/index'
    } else if (navName == "myConsultation") {
      route = '/pageOther/page/my-consultation/index'
    } else if (navName == "perfectInformation") {
      route = '/pageOther/page/person/person-info/index'
    } else if (navName == "setting") {
      route = '/pageOther/page/person/setting/index'
    }
    wx.navigateTo({
      url: route,
    })
  },
})