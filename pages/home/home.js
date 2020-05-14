// pages/home/home.js
import {
  getHospitalDetail
} from '../../utils/wx_network/service'
import {
  recDoctorList,
  dtcollectionList
} from '../../utils/wx_network/doctor'
import {
  findDeptlist,deptDoctor
} from '../../utils/wx_network/dept'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    deptList: [],
    active: 10,
    indicatorDots: true, //轮播图指示点
    duration: 500,
    autoplay: true,
    vertical: false,
    interval: 2000,
    backgroundList: ['demo-text-1'], //首页轮播图
    deptDoctorData: [],//医生列表
  },
  // 點擊tab切換
  tabSelect(e) {
    this.deptDoctor(this.data.deptList[e.detail.index].id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getData();
    
  },
  async getData(){
    let hospital = await this.getHostipal();
    await this.recDoctorList();
    await this.getDeptList();
  },
  //获取医院信息
  getHostipal() {
    //TODO  这里的医院ID写死了
    return new Promise((resolve, reject) => {
      getHospitalDetail({
        'hospitalId': '000003'
      }).then(res => {
        wx.setNavigationBarTitle({
          title: res.data.hospitalName
        })
        resolve(res);
      }).catch(err => {
        reject(err)
        console.log(err);
      })
    }).catch(err=>{
      console.log(err)
    })
  },

  //获取部门列表
  getDeptList() {
    return new Promise((resolve, reject) => {
      findDeptlist({
        'hospitalId': '000003'
      }).then(res => {
        this.deptList = res.data;
        this.setData({
          deptList:this.deptList
        })
        resolve(res);
      }).catch(err => {
        reject(err)
        console.log(err);
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  //获取推荐医生
  recDoctorList(){
    return new Promise((resolve,reject)=>{
      recDoctorList({'hospitalId':'000003'}).then(res => {
        this.data.deptDoctorData = res.data;
        this.setData({
          deptDoctorData : this.data.deptDoctorData 
        })
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log(err);
      })
    }).catch(err=>{
      console.log(err)
    })
  },
  
  deptDoctor(deptId){
    let param = {
      hospitalId:'000003',
      deptId:deptId
    }
    deptDoctor(param).then(res => {
      this.data.deptDoctorData = res.data;
      this.setData({
        deptDoctorData : this.data.deptDoctorData 
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
  goToPage(event) {
    let type = event.currentTarget.dataset.navname;
    let url = '';
    if (type == "search") { //跳转到搜索
      url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    } else if (type == "fastInquiry") { //跳转到快速问诊
      url = "/pageOther/page/fast-inquiry/index";
    } else if (type == "onLineMall") { //跳转到在线商城
      url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    } else if (type == "fastMedicineDelivery") { //跳转到闪电送药
      url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    } else if (type == "allDept") {
      url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    } else if (type == "sysm") {
      url = "/pageOther/page/prescription-renewal/DeliverMedicine/index";
    }

    if (url) {
      wx.navigateTo({
        url,
      })
    }
  },
  //院内会诊
  inHospitalServicesBtn() {
    let params = {doctorId:'2005',userId:'41a9787660676b4a',hospitalId:'000003'};
    dtcollectionList(params).then(res => {
      console.log(res,"res");
    })
  }
})