// pageOther/page/prescription-renewal/DeliverMedicine/index.js
import {
  chainAll
} from '../../../../utils/wx_network/service'
import {
  getMyRecipelList
} from "../../../../utils/wx_network/inquiry"
const cng = require("../../../../utils/config")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    navname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // TODOS：查找门店列表
    // chainAll().then(res => {
    //   this.setData({
    //     chainAll: res.datas.chainList
    //   })
    // })
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
    this.getMyRecipelList();
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
  //处方列表
  getMyRecipelList() {
    console.log('8899');
    // 这个是我的用药显示列表  默认只显示5条记录  查看全部才显示所有处方列表
    // if (wx.getStorageSync('userId')) {
      let params = {
        current: 1,
        size: 5,
        userId: wx.getStorageSync('userId')
      }
      getMyRecipelList(params).then(res => {
        this.setData({
          records: res.data.records
        })
      })
    // }
  },
  goToPage(options) {
    let url = '';
    // if (options.currentTarget.dataset.chainid) {
    //   let url = `${cng.APP_SERVER}/wap/tmpl/chain/chain_product_list.html?chainId=${options.currentTarget.dataset.chainid}`
    //   let data = escape(url)
    //   wx.navigateTo({
    //     url: `/pageOther/page/other/shop-mall/index?url=${data}`,
    //   })
    // }else
    if (options.currentTarget.dataset.navname == "findDoctor") {
      // url = '/pageOther/page/doctor/find-doctor/index'
      url = `/pageOther/page/inquiry/fast-inquiry/index?flagFastInquiry=false`
    }
    else if (options.currentTarget.dataset.navname == "allPresciption") {
      url = '/pageOther/page/prescription-renewal/all-prescription/index'
    }
    wx.navigateTo({
      url: url
    })
  },
})