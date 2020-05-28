// pageOther/page/prescription-renewal/all-prescription/index.js
import {
  getMyRecipelList
} from "../../../../utils/wx_network/inquiry"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    pageSize:5,
    refresherState: false,
    records:[],
    pages:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyRecipelList(this.data.currentPage = 1,true);
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
  //下来刷新
  bindrefresherrefresh() {
    this.getMyRecipelList(this.data.currentPage = 1,true).then(()=>{
      this.setData({
        refresherState: false
      })
    })
  },
  //上拉加载更多
  bindscrolltolower(){
    // 判断当前页数是不是小于总页数，是的话就发起请求
    if(this.data.currentPage < this.data.pages){
      this.setData({
        isLoading:2
      })
      this.getMyRecipelList(this.data.currentPage + 1)
    }else{
      this.setData({
        isLoading:1
      })
    }
  },
  //处方列表
  getMyRecipelList(page,override) {
    console.log(page)
    // return new Promise((resolve, reject) => {
      // 这个是我的用药显示列表  默认只显示5条记录  查看全部才显示所有处方列表
      if (wx.getStorageSync('userId')) {
        let params = {
          current: page,
          size: this.data.pageSize,
          userId: wx.getStorageSync('userId')
        }
       return getMyRecipelList(params).then(res => {
          let recodesList = res.data.records
          setTimeout(() => {
            this.setData({
              currentPage:page,
              pages:res.data.pages, //总页数
              isLoading:3,
              records: override ? recodesList : this.data.records.concat(recodesList)
            })
          }, 500);
          
        })
      }
    // })
  },
  goToPage(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pageOther/page/prescription-renewal/prescription-detail/index?registerId=${e.currentTarget.dataset.registerid}&pgoupNo=${e.currentTarget.dataset.pgoupno}`,
    })

  },
  goToPage1(e) {
    console.log(e, "e1");

  }

})