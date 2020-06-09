// pages/home/home.js
let WebIM = wx.WebIM = require("../../utils/huanxinIM/WebIM")["default"];
import {
  getHospitalDetail,
  bannerList
} from '../../utils/wx_network/service'
import {
  // recDoctorList,
  dtcollectionList
} from '../../utils/wx_network/doctor'
import {
  findDeptlist,deptDoctor
} from '../../utils/wx_network/dept'
const app = getApp()
const cng = require('../../utils/config.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    deptList: [],
    active: 10,
    indicatorColor:"rgba(255, 255, 255, .3)",
    indicatorDots: true, //轮播图指示点
    duration: 500,
    autoplay: true,
    vertical: false,
    interval: 2000,
    backgroundList: [], //首页轮播图
    deptDoctorData: [],//医生列表
    imgheights: [],

    
  },
  // 點擊tab切換
  tabSelect(e) {
    this.deptDoctor(this.data.deptList[e.detail.index].id);
  },

  unlockJoin: function() {
    this.lock = false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  async getData(){
    this.bannerList();
    this.deptDoctor();
    await this.getHostipal();
    // await this.recDoctorList();
    await this.getDeptList();
  },
  //获取医院信息
  getHostipal() {
    //TODO  这里的医院ID写死了
    return new Promise((resolve, reject) => {
      getHospitalDetail({
        'hospitalId': cng.HOSPITAL_ID
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

  // 获取Banner信息
  bannerList(){
    let params= {
      hospitalId:cng.HOSPITAL_ID
    }
    bannerList(params).then(res => {
      console.log(res,"this is params");
      if(res.code == 200){
        this.setData({
          backgroundList:res.data
        })
      }else{

      }
    })
  },

  //获取部门列表
  getDeptList() {
    return new Promise((resolve, reject) => {
      findDeptlist({
        'hospitalId': app.globalData.hospitalId
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
  imgH:function(e){
    var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
    var imgh=e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw=e.detail.width;
    var swiperH=winWid*imgh/imgw + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
        Hei:swiperH　　　　　　　　//设置高度
    })
},
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },
  deptDoctor(deptId){
    let param = {hospitalId:app.globalData.hospitalId}
    if(deptId){
      param.deptId=deptId
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
    //获取地址  经纬度信息
    const _this = this;
    // wx.getLocation({
    //   type: 'wgs84',
    //   success(res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

   

    wx.setStorageSync('registerId', '');//如果跳到首页的话就把registerId 设置为null
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
      // url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    } else if (type == "fastInquiry") { //跳转到快速问诊
      url = "/pageOther/page/inquiry/fast-inquiry/index?flagFastInquiry=true";
    } else if (type == "onLineMall") { //跳转到在线商城
      // url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    } else if (type == "fastMedicineDelivery") { //跳转到闪电送药
      // url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    } else if (type == "allDept") {
      // url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    } else if (type == "sysm") {
      // url = "/pageOther/page/prescription-renewal/DeliverMedicine/index"; //跳转到送药上门
      url = `/pageOther/page/prescription-renewal/all-prescription/index`; //跳转到我的用药
    } else if (type == "find-doctor"){
      wx.setStorageSync('flagDoctorShow', true);
      url = "/pageOther/page/doctor/find-doctor/index"
    }
    if (url) {
      wx.navigateTo({
        url,
      })
    }
  },

  saoyisao(){
    wx.setStorage({
			key: "myUsername",
			data: 'chenguojiqq'
		});
    app.conn.open({
			apiUrl: WebIM.config.apiURL,
			user: 'chenguojiqq',
			pwd: '123456',
			grant_type: 'password',
			appKey: WebIM.config.appkey
		});
  },
})