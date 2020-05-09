// pageOther/page/fast-inquiry/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVisitAgain: true,//是否复诊开关状态
    isAllergy: false,//存在过敏源开关状态
    allergiesHistory: '海鲜,花粉,油漆',//过敏源存储字段(中文)
    fileList: [
      { url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' },
      // Uploader 根据文件后缀来判断是否为图片文件
      // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
      {
        url: 'http://iph.href.lu/60x60?text=default',
        name: '图片2',
        isImage: true
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //是否复诊开关
  isVisitAgainClick(event) {
    this.setData({
      isVisitAgain:!this.data.isVisitAgain
    })
    console.log(this.data.isVisitAgain,"this is chenguoji ")
  },
  //是否存在过敏源开关
  isAllergyClick(event){
    this.setData({
      isAllergy:!this.data.isAllergy
    })
    console.log(this.data.isAllergy,"this is chenguoji ")
  },
  //删除图片触发
  deleteImg(event){
    console.log(this.data.fileList,"this is index",event);
    this.data.fileList.splice(event.detail.index,1);
    this.setData({
      fileList:this.data.fileList
    })
  }
})