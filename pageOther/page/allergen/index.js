// pageOther/page/allergen/index.js
import { allergenTree } from '../../../utils/wx_network/service'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAllergy:[],//显示的  过敏源 名称 数组信息
    AllergyList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.allergenTree();
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
  //过敏源数据获取
  allergenTree(){
    allergenTree().then(res => {
      this.data.alleryData = res.data;
      for (let i = 0; i < this.data.alleryData.length; i++) {
        for (let j = 0; j < this.data.alleryData[i].children.length; j++) {
          if (wx.getStorageSync('showAllergy').indexOf(this.data.alleryData[i].children[j].title) !== -1) {
            this.data.alleryData[i].children[j].isActive = !this.data.alleryData[i].children[j].isActive
          }
        }
      }
      this.setData({
        alleryData: this.data.alleryData,
        AllergyList: wx.getStorageSync('AllergyList')||[],
        showAllergy: wx.getStorageSync('showAllergy')||[],
      })
    })
  },
  //点击某一个过敏源
  subItemClick(event) {
    let index = event.currentTarget.dataset.index;
    let item = event.currentTarget.dataset.item;
    let subItem = event.currentTarget.dataset.subitem;
    item.children[index].isActive = !item.children[index].isActive;
    this.data.alleryData[item.id-1] = item;
    this.setData({
      alleryData:this.data.alleryData
    })
      let flag = false;
      for(let i=0;i<this.data.AllergyList.length;i++) {
        if (this.data.AllergyList[i].title == subItem.title) {
              this.data.AllergyList.splice(i, 1);
              this.data.showAllergy.splice(i,1);
              flag = true;
            }
      }
      if (!flag) {
        this.data.AllergyList.push({ value: subItem.value, title: subItem.title });
        this.data.showAllergy = wx.getStorageSync('showAllergy') || [];
        this.data.showAllergy.push(subItem.title);
      }
      wx.setStorageSync('AllergyList', this.data.AllergyList);
      wx.setStorageSync('showAllergy', this.data.showAllergy);
      this.setData({
        AllergyList:this.data.AllergyList
      })
  },
  //删除某个过敏源
  deleteAllergy(event){
    console.log(event,"this is event")
    this.AllergyList.splice(index,1);
    
    // this.showAllergy.splice(index, 1);
    //   this.insurants.splice(index, 1);
    //   for (let i = 0; i < this.alleryData.length; i++) {
    //     for (let j = 0; j < this.alleryData[i].children.length; j++) {
    //       if (this.alleryData[i].children[j].value == item.value) {
    //         this.$set(
    //           this.alleryData[i].children[j],
    //           "isActive",
    //           !this.alleryData[i].children[j].isActive
    //         );
    //       }
    //     }
    //   }
    //   this.$store.commit("allergy/SET_SHOW_ALLERGY", this.showAllergy);
    //   this.$store.commit("allergy/SET_INSURANTS", this.insurants);
  }
})