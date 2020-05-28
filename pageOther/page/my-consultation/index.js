// pageOther/page/my-consultation/index.js
import {
  getAgeByIdCard
} from '../../../utils/util'
import { inquiryList } from '../../../utils/wx_network/inquiry'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    consuList:[
      {id:0,consutitle:"全部"},
      {id:1,consutitle:"待接诊"},
      {id:2,consutitle:"已接诊"},
      {id:3,consutitle:"已完成"}
    ],
    todoList:[],
    refresherState:false,
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInquiryList('');
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
  // 點擊tab切換
  tabSelect(e) {
    this.data.index = e.detail.index;
    this.getInquiryList(e.detail.index||'');
  },
  //获取问诊列表
  getInquiryList(status){
    let params = {
      userId:wx.getStorageSync('userId'),
      status:status
    }
    inquiryList(params).then(res=>{
      this.setData({
        todoList:res.data
      })
    })
  },
  //scroll-view 下拉刷新
  bindrefresherrefresh() {
    this.getInquiryList(this.data.index||'')
    //延時不會讓動畫太突兀
    setTimeout(() => {
      this.setData({
        refresherState: false
      })  
    }, 500);
  },
  goToPage(e){
    wx.navigateTo({
      url: `/pageOther/page/consultation-detail/index?registerId=${e.currentTarget.dataset.registerid}`,
    })
  }
})