// pageOther/page/person/person-info/index.js
import { getAgeByIdCard } from '../../../../utils/util'
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
    let hyj = wx.getStorageSync('hyjUserInfo');
    let wxUserInfo = wx.getStorageSync('wxUserInfo');
    let hyjUserInfo = {
      nickName: wxUserInfo.nickName || '',
      avatar: wxUserInfo.avatarUrl || '',
      sex: hyj.sex == 1 ? "男" : hyj.sex == 2 ? "女" : '未知',
      address: hyj.province + hyj.city || '',
      birthday: hyj.birthday?hyj.birthday.substring(0,10) : '',
      idCard:hyj.idCard?getAgeByIdCard(hyj.idCard) : ''
    }
    this.setData({
      hyjUserInfo
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