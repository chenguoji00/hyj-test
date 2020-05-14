// pageOther/page/doctor/find-doctor/index.js
import {
  matchingDoct,
  findDoctorList,
  updateDoctor
} from '../../../../utils/wx_network/doctor'
const cng =require('../../../../utils/config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '', //查询的内容
    itemTitle: '筛选',
    option1: [
      {text: '全部商品',value: 0},
      {text: '新款商品',value: 1},
      {text: '活动商品',value: 2},
    ],
    comprehensiveSorting: [ //1综合排序，2问诊量，3价格从低到高，4价格从高到低 
      {text: '综合排序',value: 1},
      {text: '问诊量',value: 2},
      {text: '价格从低到高',value: 3},
      {text: '价格从高到低',value: 4},
    ],
    comprehensiveValue: 1,
    value1: 0,
    hospitalCondition: [
      {"name": '三甲医院',"value": '三甲医院'}],
    inquiryCondition: [
      {"name": '图文',"value": 1},
      {"name": '电话',"value": 2},
      {"name": '视频',"value": 3}
    ],
    doctorCondition: [
      {"name": '主任医师',"value": '主任医生'},
      {"name": '副主任医生',"value": '副主任医生'},
      {"name": '主治医师',"value": '主治医生'}
    ],
    item1: [],
    item2: [],
    item3: [],
    currentHospital: [-1], //筛选的医院是否选中，当选中了其值不为负数 
    currentinquiry: [-1, -1, -1], //筛选的问诊类型是否选中，当选中了其值不为负数
    currentdoctor: [-1, -1, -1], //筛选的医生职称是否选中，当选中了其值不为负数
    doctorItems: [],
    registerId: '',
    inputText: '', //搜索框搜索的内容
    page:1,
    isLoading:2, //1：不动余中2：正在加载 ，3 加载完毕
    doctorId:'',//选中的医生
    orderType:'',//订单类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"this is options");
    if(options.registerId) {
      this.data.registerId = options.registerId;
      this.data.orderType = options.orderType;
    }
    if (options.matchDoctor == 1) {
      this.matchDoctor();
    } else { //否则就查询医生列表，用户只是找医生
      this.findDoctorList(1);
    }
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
  //匹配医生
  matchDoctor() {
    matchingDoct({
      registerId: this.data.registerId
    }).then(res => {
      console.log(res, "this is res.data");
    })
  },
  //查找医生
  findDoctorList(current) {
    let params = {
      sortBy: this.data.comprehensiveValue || null, //排序类型：1综合排序，2问诊量，3价格从低到高，4价格从高到低 ,
      current: current,
      size: 10,
      //TODOS 因为还没有选择科室  所以默认写一个外科用于测试
      deptName: '外科',
      //TODOS 这里还没有部门选择；
      // deptId : this.data.deptId||''
    }
    if(this.data.inputText|| this.data.inputText ==''){
      params.keyWord = this.data.inputText
    }
    if(this.data.item1){
      params.hospitalGrade = this.data.item1.join(",")
    }
    if(this.data.item2){
      params.business = this.data.item2.join(",")
    }
    if(this.data.item3){
      params.level = this.data.item3.join(",")
    }
    if(this.data.deptId){
      params.deptId = this.data.deptId;
    }
    findDoctorList(params).then(res => {
      if (res.code == 200) {
        if(current == 1){
          this.data.doctorItems = res.data.records;
          for (let item of this.data.doctorItems) {
            item.value = item.doctorId
          }
        }else {
          if(res.data.records.length) {
            this.data.doctorItems = this.data.doctorItems.concat(res.data.records);
            
          }else{
            this.data.isLoading = 3;
          }
        }
        setTimeout(() => {
          this.setData({
            doctorItems: this.data.doctorItems,
            isLoading: this.data.isLoading
          })
        }, 500);
      }
    })
  },
  //提问 (提交订单)
  submitBtn() {
    console.log('提交订单',this.data.doctorId);
    //订单购买页面跳转
      let param = {
        registerId: this.data.registerId,
        doctorId: this.data.doctorId,
        userId: wx.getStorageSync('userId')
      };
      // if(this.$route.query.isfastOrder){
      //   fastOrder(param).then(res => {
      //     if(res.data){
      //       this.$router.push({
      //       path : '/message',
      //       query : {
      //         tmId : res.data.doctorId
      //         }
      //       })
      //     }
      //   })
      // }else{
        updateDoctor(param).then(res => {
          if (res.data != null) {
            let cartList = res.data
            let buyData = encodeURI(JSON.stringify(cartList));
            //虚拟订单支付页面路径buy_virtual_step1
            wx.navigateTo({
              url: `/pageOther/page/shop-mall/index?url=${cng.APP_SERVER}/wap/tmpl/buy/buy_virtual_step1.html?registerId=${this.data.registerId}&orderType=1&token=${wx.getStorageSync('hyjToken')}&isCart=0&buyData=${buyData}`,
            })
          }
        });
      // }
    
  },
  //改变综合查询的某一项触发
  changeComprehensive(event) {
    this.data.comprehensiveValue = event.detail;
    this.findDoctorList(1);
  },
  //搜索框查找
  searchInput(e) {
    this.data.inputText = e.detail.value;
  },
  //搜索框确认查询
  searchConfirm() {
    this.findDoctorList(1);
  },
  //点击某一项医生触发
  radioChange(e) {
    console.log(e,"this is e");
    this.data.doctorId = e.detail.value;
  },
  //点击医院等级触发
  clickhospitalCon(event) {
    let item = event.currentTarget.dataset.item;
    let type = event.currentTarget.dataset.type;
    let index = event.currentTarget.dataset.index;
    let currentArray = [];
    if (type == 1) {
      currentArray = this.data.currentHospital;
    } else if (type == 2) {
      currentArray = this.data.currentinquiry;
    } else {
      currentArray = this.data.currentdoctor;
    }
    if (currentArray[index] < 0) {
      currentArray[index] = index;
      if (type == 1) {
        this.data.item1.push(item.value);
      } else if (type == 2) {
        this.data.item2.push(item.value);
      } else {
        this.data.item3.push(item.value);
      }
    } else {
      currentArray[index] = -1;
      if (type == 1) {
        for (let i = 0; i < this.data.item1.length; i++) {
          if (this.data.item1[i] == item.value) {
            this.data.item1.splice(i, 1);
          }
        }
      } else if (type == 2) {
        for (let i = 0; i < this.data.item2.length; i++) {
          if (this.data.item2[i] == item.value) {
            this.data.item2.splice(i, 1);
          }
        }
      } else {
        for (let i = 0; i < this.data.item3.length; i++) {
          if (this.data.item3[i] == item.value) {
            this.data.item3.splice(i, 1);
          }
        }
      }
    }
    if (type == 1) {
      this.setData({
        currentHospital: currentArray
      })
    } else if (type == 2) {
      this.setData({
        currentinquiry: currentArray
      })
    } else if (type == 3) {
      this.setData({
        currentdoctor: currentArray
      })
    }
  },
  //筛选的重置按钮
  reset() {
    this.setData({
      currentHospital: [-1],
      currentinquiry: [-1, -1, -1],
      currentdoctor: [-1, -1, -1],
      item1: [],
      item2: [],
      item3: []
    })
  },
  //筛选确定按钮
  confirmBtn() {
    this.selectComponent('#item').toggle();
    // 点确定的时候去查询数据
    this.findDoctorList(1);
  },

  // scroll-view 触底加载更多
  bindscrolltolower() {
    this.data.page ++;
    this.setData({
      isLoading:2
    })
    this.findDoctorList(this.data.page);
    
  },
  //scroll-view 下拉刷新
  bindrefresherrefresh() {
    this.findDoctorList(1)
    //延時不會讓動畫太突兀
    setTimeout(() => {
      this.setData({
        refresherState: false
      })  
    }, 500);
  }
})