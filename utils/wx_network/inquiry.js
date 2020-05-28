/**
 * 此文件管理项目所有接口
 */
import { get, post } from './network';
import { WZ } from '../config'; //请求地址

// 我的问诊列表
export const inquiryList = (params) => get(`${WZ}/inquiry/list`, params);

export const consulDetail = (params) => get(`${WZ}/inquiry/info`, params)

export const getPrescriptionApp =(params) =>get(`${WZ}/prescription/getPrescriptionApp`,params) 

//处方列表
export const getMyRecipelList = (param) => get(`${WZ}/medorder/getMyRecipel`, param)
