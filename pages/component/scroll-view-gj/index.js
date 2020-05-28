// pages/component/scroll-view-gj/index.js
Component({
  /**
   * 组件的属性列表
   */
   /**
   * 启用插槽
   */
  options:{
    multipleSlots: true
  },
  properties: {
    height:{
      type: String,
      value: "100vh",
    },
    refresherState:{
      type: Boolean,
      value: false
    }
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
    // 下拉刷新
    bindrefresherrefresh(){
      this.triggerEvent("bindrefresherrefresh");
    },
    // 上拉加载
    bindscrolltolower(){
      this.triggerEvent("bindscrolltolower");
    }
  }
})
