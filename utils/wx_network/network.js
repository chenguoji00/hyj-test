/**
 * 基于Promise的网络请求库,包含GET POST请求，上传下载功能
 * 使用方法：
 * 先引入： import {get,post,...} from 本文件;
 * · get请求:    get("/index",{id:2}).then(data=>{}).catch(error=>{});
 * · post请求:    post("/index",{id:2}).then(data=>{}).catch(error=>{});
 * Promise详细介绍：
 * http://es6.ruanyifeng.com/#docs/promise
 */
import {
  APP_SERVER,
  WG,
  HOSPITAL_ID
} from '../config'; //请求地址
/**
 * 发起get请求
 * @param url 请求路径 必填
 * @param data 请求参数 get请求的参数会自动拼到地址后面
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const get = (url, data, headers) => request('GET', url, data, headers);

/**
 * 发起post请求
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const post = (url, data, headers) => request('POST', url, data, headers);

/**
 * 发起put请求
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const put = (url, data, headers) => request('PUT', url, data, headers);
/**
 * 发起delete请求
 * @param url 请求路径 必填
 * @param data 请求参数 delete请求的参数会自动拼到地址后面
 * @param headers 请求头 选填
 * @returns {Promise}
 */
export const del = (url, data, headers) => request('DELETE', url, data, headers);

/**
 * 接口请求基类方法
 * @param method 请求方法 必填
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param header 请求头 选填
 * @returns {Promise}
 */
export function request(method, url, data, header = {
  'Authorization': 'Basic d2VhcHA6d2VhcHBfc2VjcmV0',
  'qdp-Auth': wx.getStorageSync('hyjToken'),
  'hospitalId': HOSPITAL_ID
}) {
  console.group('==============>新请求<==============');
  console.info(method, url);
  if (url.includes('getOpenId') || url.includes('wx/decode') || url.includes('/chain/all') ||
    url.includes('/api/member')
  ) {
    url = APP_SERVER + url;
  } else {
    url = APP_SERVER + WG + url;
  }
  if (data) console.info('参数：', data);
  return new Promise((resolve, reject) => {
    const response = {};
    wx.request({
      url,
      method,
      data,
      header,
      success: (res) => response.success = res.data,
      fail: (error) => response.fail = error,
      complete() {
        if (response.success) {
          console.info('请求成功：', response.success);
          if (response.success.code == 401) {
            console.log("这个是因为没有权限导致的错误，需要跳转到登录页");
            wx.showToast({
              title: response.success.msg + '',
              icon: "none",
              duration: 3000
            })
            setTimeout(() => {

              wx.navigateTo({
                url: '/pageOther/page/other/login/login',
              })
            }, 1000);
          }
          // 如果返回的code是401就是需要跳转到登录页面，然后code不是200就说明请求没成功
          // 这里还需要判断一下授权登录获取openid也是没有code返回的,但是有openid会返回,所以如果没有openid并且不是
          // code等于200的话就报错提示
          else if (response.success.code != 200 && !response.success.openid && !response.success.phoneNumber) {
            wx.showToast({
              title: response.success.msg || '请求出错请重试',
              duration: 3000,
              icon: 'none'
            })
          }
          resolve(response.success)
        } else {
          reject(response.fail)
        }
      },
    });
  });
}

export const fomtDataServe = (url, data) => {
  const response = {};
    return new Promise((resolve, reject) => {
        wx.request({
          // /member/buy/pay/wx/miniprogram/pay 
          url: `${APP_SERVER}${url}`,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' //FormData请求修改此处即可
          },
          data: data,
          success: (res) => response.success = res.data,
          fail: (error) => response.fail = error,
          complete() {
            if (response.success) {
              resolve(response.success)
            }else {
              reject(response.fail)
            }
          }
        });
      })
    }