// pages/component/homeComponent/DoctorShow/doctorShow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    deptDoctorData: {
      type:Array,
      value:[]
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToPage(e) {
      wx.navigateTo({
        url: `/pageOther/page/doctor/doctor-detail/index?doctorId=${e.currentTarget.dataset.doctorid}`,
      })
    }
  }
})
