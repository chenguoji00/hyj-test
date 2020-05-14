/**
 * 此文件管理项目登录的接口
 */
import {get, post} from './network';
import { QXWG, WZ } from '../config'; //请求地址


//根据小程序Openid登录,如果没有自动会注册新用户
export const getTokenByWeappOpenId = (url,data) => post(QXWG+url,data);

//获取科室下的医生列表
export const deptDoctor = (params) => get(WZ+'/dept/doctor/list',params)
