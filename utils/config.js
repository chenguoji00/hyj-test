const WXAPP_ID ="wxdd31c980d9ed1c8f";//appId  慧医家测试：wxce8f15f48dc6cffb  慧医家wxdd31c980d9ed1c8f
const APP_SERVER = "https://demo.hyj91.com";//请求域名地址
const WG = '/inqApi'//网关请求路径
const WZ = '/hyj-inquiry' //问诊的网关路径
const OSSWG = '/platform-oss'//OSS的网关请求
const QXWG = '/platform-auth'

const qn_ossurl = 'https://upload-z2.qiniup.com';//七牛的空间地址

// http://hyjfile.qn.phd91.com/  图片上传到的位置  这里要判断上传展示的地址是什么

//变量 flagDoctorShow:这个是判断是需要显示医生还是选择医生
//变量 flagFastInquiry:这个是判断是否是快速问诊的，如果不是的话那就是开药问诊进去的
module.exports = {
  WXAPP_ID: WXAPP_ID,
  APP_SERVER: APP_SERVER,
  WG: WG,
  OSSWG: OSSWG,
  WZ: WZ,
  qn_ossurl: qn_ossurl,
  QXWG: QXWG
}
