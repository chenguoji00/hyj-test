/**
 * 此文件管理项目所有接口
 */
import {get, post, put, del} from './network';
import {
  WG
} from '../config'; //请求地址


/**
 * 获取图片
 */
export const getPhoto = (id) => get(`${APP_SERVER}/photos/${id}`);

export const send =(url,params) =>get(url,params);
export const getHospitalDetail = (url,params) => get(WG+url,params);