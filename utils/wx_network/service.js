/**
 * 此文件管理项目所有接口
 */
import {get, post, put, del} from './network';
import { OSSWG, WZ } from '../config'; //请求地址


/**
 * 获取图片
 */
export const getPhoto = (id) => get(`${APP_SERVER}/photos/${id}`);

export const send =(url,params={}) =>get(url,params);
export const getHospitalDetail = (params) => get(WZ+'/hospital/detail',params);
export const getQINIUToken = (params) =>  get(OSSWG+'/qiniu/token',params);

// 获取过敏源
export const allergenTree = () => get(WZ+'/allergen/tree')

//新增患者病情描述
export const symptomAdd =  (params,param) => post(`${WZ}/inquiry/patient/symptom/add?orderType=${param.orderType}&symptom=${param.symptom}&userId=${param.userId}`,params)

//  {
//   return axios({
//     data: params,
//     params:param
//   }).then(res =>res.data)
//   return requestPost(`/hyj-inquiry/inquiry/patient/symptom/add`, params).then(res => res.data)
// }