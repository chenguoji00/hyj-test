// pageOther/page//other/place-manager/index.js
import {
  fomtDataServe
} from '../../../../utils/wx_network/network'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.defaultAddressId = options.addressId
    this.getAddressList();
  },

  getAddressList() {
    if (wx.getStorageSync("shopToken")) {
      let params = {
        token: wx.getStorageSync("shopToken")
      }
      fomtDataServe('/api/member/address/list', params).then(res => {
        for (let i = 0; i < res.datas.addressList.length; i++) {
          if (this.data.defaultAddressId == res.datas.addressList[i].addressId) {
            res.datas.addressList[i].checked = true;
          }
        }
        console.log(res.datas.addressList, "res.datas.addressList")
        if (res.code == 200) {
          this.setData({
            addressList: res.datas.addressList
          })
        } else {
          wx.showToast({
            title: '请求错误，请重试',
            icon: 'none'
          })
        }

      })
    } else {
      wx.navigateTo({
        url: `/pageOther/page/other/login/login`,
      })
    }
  },

  radioChange(event) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一页
    prevPage.setData({
      pre_item: {
        addressId: parseInt(event.detail.value)
      }
    })
    wx.navigateBack({
      delta: 1
    })
  },

  //跳转到新增收货地址
  goToAddPlace() {
    wx.navigateTo({
      url: `/pageOther/page/other/add-place/add-place`,
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

  }
})