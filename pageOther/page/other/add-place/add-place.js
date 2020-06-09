// pageOther/page/other/add-place/add-place.js
// const citys = {
//   浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
//   福建: ['福州', '厦门', '莆田', '三明', '泉州'],
// };
const cng = require("../../../../utils/config")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errPhoneMessage: '',
    isAddressChecked: false,
    realName: '', //真實姓名
    isDefult: 0, //是否默認
    mobPhone: '', //電話
    areaInfo: '', //詳細地址
    address: '',
    areaId1: 34,
    areaId2: 534,
    areaId3: 0,
    areaId4: 0,
    areaId: 534,
    column1: ["请选择"],
    column2: [],
    column3: [],
    citys1: [],
    citys2: [],
    citys3: []
  },

  onChange(event) {
    console.log(event, "this is event");
    const {
      picker,
      value,
      index
    } = event.detail;
    console.log(picker.getValues(), "this is getColumnValue")
    if (index == 0) {
      // this.getAddress(0);
      for (let i = 0; i < this.data.citys1.length; i++) {
        if (value[0] == this.data.citys1[i].areaName) {
          this.getAddress(this.data.citys1[i].areaId, 1);
        }
      }
      console.log(this.data.citys1, "this is that.data.citys1")
    } else if (event.detail.index == 1) {
      for (let i = 0; i < this.data.citys2.length; i++) {
        if (value[1] == this.data.citys2[i].areaName) {
          this.getAddress(this.data.citys2[i].areaId, 2);
        }
      }
    }
    //
    // picker.setColumnValues(1, citys[value[0]]);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddress(0, 0);
  },


  getAddress(areaId, index) {
    let that = this;
    wx.request({
      url: `${cng.APP_SERVER}/api/area/list?areaId=${areaId}`,
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res.data);
          if (index == 0) {
            that.data.citys1 = res.data.datas.areaList;
            that.data.column1 = ["请选择"];
            for (let i = 0; i < res.data.datas.areaList.length; i++) {
              that.data.column1.push(res.data.datas.areaList[i].areaName)
            }
          } else if (index == 1) {
            that.data.citys2 = res.data.datas.areaList;
            that.data.column2 = [];
            for (let i = 0; i < res.data.datas.areaList.length; i++) {
              that.data.column2.push(res.data.datas.areaList[i].areaName)
            }
          } else if (index == 2) {
            that.data.citys3 = res.data.datas.areaList;
            that.data.column3 = [];
            for (let i = 0; i < res.data.datas.areaList.length; i++) {
              that.data.column3.push(res.data.datas.areaList[i].areaName)
            }
          }

          let columns = [{
              values: that.data.column1,
              className: 'column1',
            },
            {
              values: that.data.column2,
              className: 'column2',
            },
            {
              values: that.data.column3,
              className: 'column3',
            }
          ]
          that.setData({
            columns: columns
          })

          // that.data.column1 = res.data.datas.areaList;
        } else {
          wx.showToast({
            title: '数据请求出错，请重试..',
            icon: "none"
          })
        }
      }
    });
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



  // 是否选择默认地址开关
  isAddressOnChange(e) {

    console.log(e);
    if (e.detail == true) {
      this.data.isDefult = 1;
    } else {
      this.data.isDefult = 0;
    }
    this.setData({
      isAddressChecked: e.detail
    })
  },

  //收货人OnChange
  receiverOnChange(e) {
    console.log(e, "this is shouhuoren");
    this.data.realName = e.detail;
  },
  //电话修改
  phoneOnChange(e) {
    if (e.detail) {
      let isphone = this.testPhone(e.detail);
      if (!isphone) {
        this.data.errPhoneMessage = '手机号格式错误'
      } else {
        this.data.errPhoneMessage = '';
      }
    } else {
      this.data.errPhoneMessage = '';
    }
    this.data.mobPhone = e.detail;
    this.setData({
      errPhoneMessage: this.data.errPhoneMessage
    })
  },
  // 詳細地址改變触发
  addressDetailChange(event) {
    this.data.address = event.detail;
    console.log(event, "this is event");
  },
  // 保存地址
  submitAddress() {
    let params = {
      "token": wx.getStorageSync('shopToken'),
      "isDefault": this.data.isDefult,
      "realName": this.data.realName,
      "mobPhone": this.data.mobPhone,
      "areaInfo": "澳门 澳门特别行政区",
      "address": this.data.address,
      "areaId1": 34,
      "areaId2": 534,
      "areaId3": 0,
      "areaId4": 0,
      "areaId": 534
    }
    wx.request({
      url: `${cng.APP_SERVER}/api/member/address/add`,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //FormData请求修改此处即可
      },
      data: params,
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.code == 200) {
            var that = this;
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 3]; //上两页
            prevPage.setData({
              pre_item: {
                addressId: res.data.datas.addressId
              }
            })
            wx.navigateBack({
              delta: 2
            })
          }
        } else {
          wx.showToast({
            title: '数据请求出错，请重试..',
            icon: "none"
          })
        }
      }
    });

  },


  //手机号码校验
  testPhone(pone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  },
})