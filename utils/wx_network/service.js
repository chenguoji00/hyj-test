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

//获取商城药店的门店列表
export const chainAll = (params) => get(`/api/chain/all?areaId2=305&location=%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%B8%9C%E8%8E%9E%E5%B8%82%E4%B8%87%E6%B1%9F%E5%8C%BA%E8%B5%B5%E5%B1%8B%E6%9D%91`)
