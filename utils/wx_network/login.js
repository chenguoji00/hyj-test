/**
 * 此文件管理项目登录的接口
 */
import {get, post} from './network';
import { QXWG, WZ } from '../config'; //请求地址



//根据小程序Openid登录,如果没有自动会注册新用户
export const getTokenByWeappOpenId = (data) => post('/qdp-auth/oauth/token',data,{
  'content-type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic d2VhcHA6d2VhcHBfc2VjcmV0'
});
