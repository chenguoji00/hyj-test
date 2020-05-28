
/**
 * 此文件管理项目所有接口
 */
import {get, post} from './network';
import { WZ } from '../config'; //请求地址



// 获取就诊人列表
export const patientList = (params) => get(WZ+'/patient/list',params);

//新增患者病情描述
export const symptomAdd =  (params,param) => post(`${WZ}/inquiry/patient/symptom/add?orderType=${param.orderType}&symptom=${param.symptom}&userId=${param.userId}`,params)

export const updatePatient = (url,params) => post(`${WZ}/${url}`,params)

//新增看诊人
export const aadPatient= (params) => post(`${WZ}/patient/add`,params)

// 修改看诊人
export const updatePatientDetail = (params) => post(`${WZ}/patient/update`,params)

//删除看诊人
export const removePatient = (params) => post(`${WZ}/patient/remove`,params,{
  'content-type': 'application/x-www-form-urlencoded',
  'Client-Auth': 'aHlqX2g1X3VpOjZjYjcwODEzLTk0NTQtNWVlZC04NzUyLTQyZDZmNDk2MGJmMQ==',
  'Authorization': wx.getStorageSync('hyjToken')
})