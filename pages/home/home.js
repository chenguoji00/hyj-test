// pages/home/home.js
import { getHospitalDetail } from '../../utils/wx_network/service'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,//轮播图指示点
    duration: 500,
    autoplay: true,
    vertical: false,
    interval: 2000,
    background: ['demo-text-1'],
    deptSwipe:[{id:1,title:'内科'},{id:2,title:'外科'},{id:3,title:'感染科'}],
    deptDoctorData: [
      {auditStatus: null,
        birthDate: null,
        business: null,
        certificate: "医师资格证",
        certificateDate: null,
        certificateNo: "10203232498231",
        certificatePic: "http://hyj-certpic.qn.phd91.com/doctorCertificatePic.png",
        collection: null,
        commonId: null,
        createTime: null,
        createUser: "admin",
        deptId: null,
        deptIdJson: null,
        deptName: null,
        doctorId: "2005",
        doctorName: "孙思邈",
        doctorPic: "http://img0.pconline.com.cn/pconline/1409/14/5429456_4796237_561_thumb1_thumb.jpg",
        doctorStatus: null,
        employmentDate: "2020-04-07 00:00:00",
        evaluate: 12,
        grade: null,
        haveCertificateUrl: "F",
        havePractisingCertificateUrl: "F",
        hospitalId: "000003",
        hospitalName: null,
        hyjDeptId: null,
        idCard: "330781198509071397",
        isDeleted: 0,
        level: "副主治医生",
        licensePic: "http://hyj-certpic.qn.phd91.com/doctorLicensePic.png",
        nation: "01",
        openingDate: null,
        phone: "13434199330",
        practisingCertificateNo: "2131234132131231",
        practitioners: "8",
        registrationDate: null,
        reply: 201,
        resume: "新型冠状病毒，肺炎免费咨询",
        sex: 1,
        similarity: 0,
        specialty: "胃肠良恶肿瘤，肠道炎性疾病，阑尾炎，肠梗阻等胃肠外科疾病及肝胆胰良恶性肿瘤、胆石症、急慢性胰腺炎、甲状腺良恶性疾病、腹外疝、周围血管等疾病的诊断及治疗，上下消化道出血的急症诊断及处理等。尤其擅长腔镜胃肠肿瘤手术，腔镜甲状腺美容手术，腔镜疝手术及各种肝胆疾病的微创手术治疗等。",
        storeId: 0,
        tag: "",
        textInqNumber: 0,
        textPrice: null,
        updateTime: null,
        updateUser: "",
        videoInqNumber: 0,
        videoPrice: null,
        voiceInqNumber: 0,
        voicePrice: null},
      {auditStatus: null,
        birthDate: null,
        business: null,
        certificate: "医师资格证",
        certificateDate: null,
        certificateNo: "10203232498231",
        certificatePic: "http://hyj-certpic.qn.phd91.com/doctorCertificatePic.png",
        collection: null,
        commonId: null,
        createTime: null,
        createUser: "admin",
        deptId: null,
        deptIdJson: null,
        deptName: null,
        doctorId: "2006",
        doctorName: "陈国基",
        doctorPic: "http://img.tukexw.com/img/c83ff4dea4cb04dd.jpg",
        doctorStatus: null,
        employmentDate: "2020-04-07 00:00:00",
        evaluate: 12,
        grade: null,
        haveCertificateUrl: "F",
        havePractisingCertificateUrl: "F",
        hospitalId: "000003",
        hospitalName: null,
        hyjDeptId: null,
        idCard: "330781198509071397",
        isDeleted: 0,
        level: "副主治医生",
        licensePic: "http://hyj-certpic.qn.phd91.com/doctorLicensePic.png",
        nation: "01",
        openingDate: null,
        phone: "13434199330",
        practisingCertificateNo: "2131234132131231",
        practitioners: "8",
        registrationDate: null,
        reply: 201,
        resume: "新型冠状病毒，肺炎免费咨询",
        sex: 1,
        similarity: 0,
        specialty: "胃肠良恶肿瘤，肠道炎性疾病，阑尾炎，肠梗阻等胃肠外科疾病及肝胆胰良恶性肿瘤、胆石症、急慢性胰腺炎、甲状腺良恶性疾病、腹外疝、周围血管等疾病的诊断及治疗，上下消化道出血的急症诊断及处理等。尤其擅长腔镜胃肠肿瘤手术，腔镜甲状腺美容手术，腔镜疝手术及各种肝胆疾病的微创手术治疗等。",
        storeId: 0,
        tag: "",
        textInqNumber: 0,
        textPrice: null,
        updateTime: null,
        updateUser: "",
        videoInqNumber: 0,
        videoPrice: null,
        voiceInqNumber: 0,
        voicePrice: null},
      {auditStatus: null,
        birthDate: null,
        business: null,
        certificate: "医师资格证",
        certificateDate: null,
        certificateNo: "10203232498231",
        certificatePic: "http://hyj-certpic.qn.phd91.com/doctorCertificatePic.png",
        collection: null,
        commonId: null,
        createTime: null,
        createUser: "admin",
        deptId: null,
        deptIdJson: null,
        deptName: null,
        doctorId: "2007",
        doctorName: "双击666",
        doctorPic: "http://hyj-certpic.qn.phd91.com/doctorLicensePic.png",
        doctorStatus: null,
        employmentDate: "2020-04-07 00:00:00",
        evaluate: 12,
        grade: null,
        haveCertificateUrl: "F",
        havePractisingCertificateUrl: "F",
        hospitalId: "000003",
        hospitalName: null,
        hyjDeptId: null,
        idCard: "330781198509071397",
        isDeleted: 0,
        level: "主治医生",
        licensePic: "http://hyj-certpic.qn.phd91.com/doctorLicensePic.png",
        nation: "01",
        openingDate: null,
        phone: "13434199330",
        practisingCertificateNo: "2131234132131231",
        practitioners: "8",
        registrationDate: null,
        reply: 201,
        resume: "新型冠状病毒，肺炎免费咨询",
        sex: 1,
        similarity: 0,
        specialty: "胃肠良恶肿瘤，肠道炎性疾病，阑尾炎，肠梗阻等胃肠外科疾病及肝胆胰良恶性肿瘤、胆石症、急慢性胰腺炎、甲状腺良恶性疾病、腹外疝、周围血管等疾病的诊断及治疗，上下消化道出血的急症诊断及处理等。尤其擅长腔镜胃肠肿瘤手术，腔镜甲状腺美容手术，腔镜疝手术及各种肝胆疾病的微创手术治疗等。",
        storeId: 0,
        tag: "",
        textInqNumber: 0,
        textPrice: null,
        updateTime: null,
        updateUser: "",
        videoInqNumber: 0,
        videoPrice: null,
        voiceInqNumber: 0,
        voicePrice: null}    
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取医院详情
    getHospitalDetail('/hospital/detail', {'hospitalId':'000003'}).then(res => {
      console.log(res,"this is res")
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
    if(type == "search"){ //跳转到搜索
      url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    }else if (type == "fastInquiry") { //跳转到快速问诊
      url = "/pageOther/page/fast-inquiry/index";
    }else if (type == "onLineMall") {//跳转到在线商城
      url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    }else if (type == "fastMedicineDelivery") {//跳转到闪电送药
      url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    }else if (type == "allDept") {
      url = "/pageOther/page/privatypolicy/PrivatyPolicy";
    }
    if(url){
      wx.navigateTo({
        url,
      })
    }
  }
})