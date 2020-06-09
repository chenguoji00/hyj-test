const WXAPP_ID ="wxdd31c980d9ed1c8f";//appId  慧医家测试：wxce8f15f48dc6cffb  慧医家wxdd31c980d9ed1c8f   客服:wx7cc7d8165f3220bc
const APP_SERVER = "https://demo.hyj91.com";//请求域名地址
const WG = '/inqApi'//网关请求路径
const WZ = '/hyj-inquiry' //问诊的网关路径
const OSSWG = '/platform-oss'//OSS的网关请求
const QXWG = '/platform-auth'

const qn_ossurl = 'https://upload-z2.qiniup.com';//七牛的空间地址

const HOSPITAL_ID = '000003' //配置医院ID

// http://hyjfile.qn.phd91.com/  图片上传到的位置  这里要判断上传展示的地址是什么

const AGORA_SERVER = "https://api.agora.io/v1/apps";
const APPID = "b47eda0550fe4b6c989091c4ff3f61ea";  //d32fed1656ab43ac8fcb219a1f874220
const API_KEY = "c52a2f0d81c44e08bca02831e0d1bb28";
const API_SECRET = "108cc36e64164e7098228b51a7c1d7e0";


const CHECK_FLAG = false//是否校验房间号
const REC_FLAG = false//是否录制视频
const STATIS_FLAG = false//是否需要使用统计

//七牛
const ACCESS_KEY = '9uPQJMOJK3tYDXw8r7KCstOQFaVQN-4X__VffX2b'
const SECRET_KEY = 'Me40jXVraAH_oog-xZlk9Jv_CS42i9KCrL9Krz0H'
const BUCKET = 'schdx-video'
const REGION = 2
const VENDOR = 0 

if(APPID === ""){
  wx.showToast({
    title: `请在config.js中提供正确的appid`,
    icon: 'none',
    duration: 5000
  });
}







//变量 flagDoctorShow:这个是判断是需要显示医生还是选择医生
//变量 flagFastInquiry:这个是判断是否是快速问诊的，如果不是的话那就是开药问诊进去的
module.exports = {
  WXAPP_ID: WXAPP_ID,
  APP_SERVER: APP_SERVER,
  WG: WG,
  OSSWG: OSSWG,
  WZ: WZ,
  qn_ossurl: qn_ossurl,
  QXWG: QXWG,
  HOSPITAL_ID,
  APPID: APPID,
  AGORA_SERVER: AGORA_SERVER,
  CHECK_FLAG: CHECK_FLAG,
  REC_FLAG: REC_FLAG,
  STATIS_FLAG: STATIS_FLAG,
  ACCESS_KEY: ACCESS_KEY,
  SECRET_KEY: SECRET_KEY,
  BUCKET: BUCKET,
  REGION: REGION,
  VENDOR: VENDOR,
  API_KEY: API_KEY,
  API_SECRET: API_SECRET,
}
