
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
