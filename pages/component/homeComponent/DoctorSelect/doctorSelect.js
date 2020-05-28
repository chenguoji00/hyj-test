// pages/component/homeComponent/DoctorSelect/doctorSelect.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    deptDoctorData: {
      type: Array,
      value: []
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
      //点击某一项医生触发
  radioChange(e) {
    console.log(e,"this is e");
    this.triggerEvent('radioChange', e.detail.value)
  },
  }
})