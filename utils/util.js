import cng from '../utils/config';
const qiniuUploader = require("../utils/qiniuUploader");
let logitems = [];
let dbgRtmp = false;
let systemInfoChecked = false;
let uid = `${parseInt(Math.random() * 1000000)}`;
let timer;



const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const timeSet = date => {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var nowDate = year + "-" + month + "-" + day;
  return nowDate
}


const fIDCard = (cellValue) => {
  if (Number(cellValue) && String(cellValue).length === 18) {
    let idcard = String(cellValue)
    return idcard.substring(0, 10) + '*****' + idcard.substring(14, 17);
  } else {
    return cellValue
  }
}

const getAgeByIdCard = (identityCard) => {
  var len = (identityCard + "").length;
  if (len == 0) {
    return '';
  } else {
    if ((len != 15) && (len != 18)) //身份证号码只能为15位或18位其它不合法
    {
      return '';
    }
  }
  var strBirthday = "";
  if (len == 18) //处理18位的身份证号码从号码中得到生日和性别代码
  {
    strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
  }
  if (len == 15) {
    strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
  }
  //时间字符串里，必须是“/”
  var birthDate = new Date(strBirthday);
  var nowDateTime = new Date();
  var age = nowDateTime.getFullYear() - birthDate.getFullYear();
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
    age--;
  }
  return age + '岁';
}

const debounce = function (fn, delay) {
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const requestPermission = (scope, cb) => {
  wx.getSetting({
    success(res) {
      if (res.authSetting[scope]) {
        cb && cb();
      } else {
        wx.authorize({
          scope: scope,
          success() {
            cb && cb();
          }
        })
      }
    }
  })
}


const log = (msg, level) => {
  let time = formatTime(new Date());
  logitems.push(`${time}: ${msg}`);
  if (level === "error") {
    console.error(`${time}: ${msg}`);
  } else {
    console.log(`${time}: ${msg}`);
  }
}

const getUid = () => {
  return uid;
}

const mashupUrl = (url, channel) => {
  return url;
}

const checkSystemInfo = (app) => {
  if (!systemInfoChecked) {
    systemInfoChecked = true;
    wx.getSystemInfo({
      success: function (res) {
        log(`${JSON.stringify(res)}`);
        let sdkVersion = res.SDKVersion;
        let version_items = sdkVersion.split(".");
        let major_version = parseInt(version_items[0]);
        let minor_version = parseInt(version_items[1]);

        app.globalData.systemInfo = res;

        if (major_version <= 1 && minor_version < 7) {
          wx.showModal({
            title: '版本过低',
            content: '微信版本过低，部分功能可能无法工作',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  }
}




/* 
  @author  CD00
  @module  通用的七牛上传文件-组件
  @prop  List 是需要上传到七牛云的图片集合 osstoken:后台请求的七牛随机token
  
  @return  imgList1  上传到七牛服务器的图片列表
*/
const gjUploadFile = function (List,osstoken) {
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
        uptoken: osstoken, // 由其他程序生成七牛 uptoken
      })
    }
  }).then(function (imgList1) {
    console.log(imgList1, "所有图片上传到七牛成功了哦，接下来就是点下一步之后进行存储到我们的服务器了");
    return imgList1;
  }).catch(err => {
    console.log(err, "错误啦123")
    wx.hideLoading()
  })
}

module.exports = {
  formatTime: formatTime,
  getAgeByIdCard: getAgeByIdCard,
  timeSet: timeSet,
  gjUploadFile: gjUploadFile,
  fIDCard: fIDCard,
  getUid: getUid,
  checkSystemInfo: checkSystemInfo,
  requestPermission: requestPermission,
  log: log,
  clearLogs: function () {
    logitems = []
  },
  getLogs: function () {
    return logitems
  },
  mashupUrl: mashupUrl,
  debounce: debounce
}