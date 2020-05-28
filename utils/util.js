import cng from '../utils/config';
const qiniuUploader = require("../utils/qiniuUploader");
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

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getAgeByIdCard = (identityCard) =>{
  var len = (identityCard + "").length;
  if (len == 0) {
    return '';
  } else {
    if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
    {
      return '';
    }
  }
  var strBirthday = "";
  if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
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
  return age+'岁';
}


const gjUploadFile = function(List){
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
          uptoken: that.data.osstoken, // 由其他程序生成七牛 uptoken
        })
      }
    }).then(function (imgList1) {
      console.log(imgList1, "所有图片上传到七牛成功了哦，接下来就是点下一步之后进行存储到我们的服务器了");
      return imgList1;
    }).catch(err => {
      console.log(err, "错误啦")
      wx.hideLoading()
    })
}













module.exports = {
  formatTime: formatTime,
  getAgeByIdCard:getAgeByIdCard,
  timeSet:timeSet,
  gjUploadFile:gjUploadFile
}
