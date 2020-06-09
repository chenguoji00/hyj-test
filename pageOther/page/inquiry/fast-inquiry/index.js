// pageOther/page/fast-inquiry/index.js
var cng = require("../../../../utils/config");
import {
  getQINIUToken,
  symptomAdd
} from '../../../../utils/wx_network/service';
const qiniuUploader = require("../../../../utils/qiniuUploader");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAllergy: '0', //存在过敏源开关状态
    allergiesHistory: '', //过敏源存储字段(中文)
    illnessDescription: '', //病情描述
    radio: '1', //本次为初诊或者复诊
    imgList: [], //图片列表
    consentChecked: true, //同意书勾选状态
    osstoken: '', //七牛TOKEN
    fastOrder: {}, //快速问诊数据
    isfastOrder: false, //判断是否是快速问诊进来的
    orderType: '1',
    doctorId: '', //医生ID
    flagFastInquiry: true,
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.doctorId) {
      this.data.doctorId = options.doctorId;
    }
    if(options.orderType){
      this.data.orderType = options.orderType;
    }
    if (options.flagFastInquiry == "true") {
      this.data.flagFastInquiry = true
    } else {
      this.data.flagFastInquiry = false
    }
    if (options.fastOrder) {
      this.data.fastOrder = options.fastOrder;
      this.isfastOrder = true; //设置是闪电购药入口
    } else {
      this.data.fastOrder = {}
    }
    this.setData({
      flagFastInquiry: this.data.flagFastInquiry
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
    if(!this.data.osstoken){
      this.getQINIUToken(); //获取七牛token
    }
    let showAllergies = '';
    // 如果字数超过10个就截取
    if (wx.getStorageSync('showAllergy')) {
      if (wx.getStorageSync('showAllergy').join(',').length > 10) {
        showAllergies = wx.getStorageSync('showAllergy').join(',').substring(0, 10) + '...'
      } else {
        showAllergies = wx.getStorageSync('showAllergy').join(',');
      }
    }
    this.setData({
      allergiesHistory: wx.getStorageSync('showAllergy'),
      showAllergies: showAllergies
    })
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
  // 输入病情描述更改
  inputIllness(e) {
    this.setData({
      illnessDescription: e.detail.value
    })
    this.data.illnessDescription = this.data.illnessDescription.replace(/(^\s*)|(\s*$)/g, "");//去掉输入的空格
  },
  //获取七牛TOKEN
  getQINIUToken() {
    getQINIUToken().then(res => {
      this.data.osstoken = res.data;
    })
  },

  //是否存在过敏源开关
  isAllergyClick(event) {
    this.setData({
      isAllergy: event.detail
    })
  },
  //是否复诊开关
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  //选择图片进行上传
  ChooseImage() {
    var that = this;
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0 && (res.tempFilePaths.length + this.data.imgList.length) <= 9) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else if (this.data.imgList.length == 0) {
          this.setData({
            imgList: res.tempFilePaths
          })
        } else if ((res.tempFilePaths.length + this.data.imgList.length) > 9) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths).slice(0, 9)
          })
        }
      }
    });
  },
  //删除选中的图片
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '确定要删除该图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  //预览图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  // 知情同意书按钮
  onChangeConsent(event) {
    this.setData({
      consentChecked: event.detail
    })
  },

  //上传文件 然后下一步
  upload_btn(res) {
    var that = this;
    if (this.data.isAllergy == '0') {
      this.data.allergiesHistory = ''; //过敏源数据
    }
    if (this.data.consentChecked == false || this.data.radio == '0') {
      return;
    }
    var imgList1 = []; //多张图片地址，保存到一个数组当中
    var List = [];
    List = this.data.imgList;
    if (that.data.illnessDescription == '' || that.data.illnessDescription.length < 10) {
      wx.showToast({
        title: '病情描述不能为空或者小于10个字，请重试',
        icon: 'none',
      })
      return;
    }
    if (this.data.doctorId) { //判断是否有医生ID
      this.data.fastOrder.doctorId = this.data.doctorId;
    }
    // this.data.fastOrder.imgsList = this.imgsList;
    this.data.fastOrder.symptom = this.data.illnessDescription; //症状
    this.data.fastOrder.userId = wx.getStorageSync('userId') || ''; //用户ID
    this.data.fastOrder.hospitalId = wx.getStorageSync('HospitalId') || app.globalData.hospitalId; //医院ID
    this.data.fastOrder.orderType = this.data.orderType || 1; //订单类型
    this.data.fastOrder.subsequentVisit = this.data.radio == '1' ? 1 : 0; //是否复诊 1复诊 0初诊
    this.data.fastOrder.allergy = this.data.isAllergy == '1' ? 1 : 0; //是否有过敏源  1：是 0 否
    if (Number(this.data.isAllergy)) {
      console.log(this.data.isAllergy, "isAllergy");
      if (!wx.getStorageSync('AllergyList').length) {
        wx.showToast({
          title: '请选择过敏源',
          icon: 'none'
        })
        return;
      } else {
        this.data.fastOrder.allergiesHistory = this.data.allergiesHistory.join(','); //过敏源字段
      }
    } else {
      this.data.fastOrder.allergiesHistory = '';
    }
    let params = {
      orderType: this.data.orderType,
      symptom: this.data.illnessDescription,
      userId: wx.getStorageSync('userId') || ''
    }
    if (List.length == 0) {
      this.data.fastOrder.imgsList = [];
      this.symptomAdd(this.data.fastOrder, params);
      return;
    }
    wx.showLoading({
      title: '正在加载，请稍后',
      mask: true
    })
    var region = '';
    switch (cng.qn_ossurl) {
      case 'https://upload.qiniup.com':
        region = 'ECN';
        break;
      case 'https://upload-z1.qiniup.com':
        region = 'NCN';
        break;
      case 'https://upload-z2.qiniup.com':
        region = 'SCN';
        break;
      case 'https://upload-na0.qiniup.com':
        region = 'NA';
        break;
      case 'https://upload-as0.qiniup.com':
        region = 'ASG';
        break;
    }
    if (region == '') {
      wx.showToast({
        title: '请求的七牛云数据有误，请重试',
        icon: 'none',
      })
      return;
    }
    var state = 0; //state记录当前已经上传到第几张图片
    new Promise(function (resolve, reject) {
      for (var i = 0; i < List.length; i++) {
        qiniuUploader.upload(List[i], (res) => {
          state++;
          imgList1.push(res.imageURL);
          if (state == List.length) {
            resolve(imgList1);
          }
        }, (error) => {
          reject('error');
        }, {
          region: region,
          uptoken: that.data.osstoken, // 由其他程序生成七牛 uptoken
        })
      }
    }).then(function (imgList1) {
      console.log(imgList1, "所有图片上传到七牛成功了哦，接下来就是点下一步之后进行存储到我们的服务器了");
      let imgData = ''
      for (let i = 0; i < imgList1.length; i++) {
        // TODOS:這個上传的可访问文件地址 需要外面定義
        imgList1[i] = 'http://hyjfile.qn.phd91.com' + imgList1[i];
      }
      imgData = imgList1.join(',');
      console.info(imgData, "这个是图片的url，到时候传递到数据库中的图片地址字符串就是这个值");
      that.data.fastOrder.imgsList = imgList1;
      that.symptomAdd(that.data.fastOrder, params)
    }).catch(err => {
      console.log(err, "错误啦")
      wx.hideLoading()
    })
  },
  //快速问诊提交信息
  symptomAdd(fastOrder, params) {
    symptomAdd(fastOrder, params).then(res => {
      if (res.code == 200) {
        wx.setStorageSync('registerId', res.data); //保存registerId
        wx.navigateTo({
          url: `/pageOther/page/patient/select-patient/selectPatient?registerId=${wx.getStorageSync('registerId')}&orderType=${this.data.fastOrder.orderType}&doctorId=${this.data.doctorId||''}&isfastOrder=${this.data.isfastOrder}&flagFastInquiry=${this.data.flagFastInquiry}`,
        })
        wx.hideLoading()
      }
    }).catch(err => {
      wx.hideLoading()
    })
  },

  //页面跳转
  goToPage(event) {
    let url = '';
    if (event.currentTarget.dataset.navpath == 'zqtys') {
      url = '/pageOther/page/other/informright/index'
    } else if (event.currentTarget.dataset.navpath == 'allergy') {
      url = '/pageOther/page/other/allergen/index'
    }
    if (url) {
      wx.navigateTo({
        url: url,
      })
    }
  },
  // 没有凭证
  nopingzhen() {
    this.setData({
      show: true
    })
  },
  onConfirm() {
    wx.setStorageSync('flagDoctorShow', true);
    wx.navigateTo({
      url: "/pageOther/page/doctor/find-doctor/index",
    })
  }
})