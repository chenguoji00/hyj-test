/**
 * 此文件管理项目医生的接口
 */
import {get, post, put, del} from './network';
import {  OSSWG, WZ } from '../config'; //请求地址


export const recDoctorList = (params) => get(WZ+'/doctor/recDoctorList',params);

//获取收藏的医生列表
export const dtcollectionList = (params) => get(WZ+'/patient/doctor/collect/list',params);


// 根据病情描述匹配医生
export const matchingDoct= (params)=> post(`${WZ}/inquiry/patient/symptom/matchingDoct?registerId=${params.registerId}`,params);

//找医生分页
export const findDoctorList = (params) => get(`${WZ}/doctor/findDoctorList`,params)


//找医生详情
export const doctorInfo = (params) => get(`${WZ}/doctor/info`,params)



//新增患者病情描述(绑定医生)
export const updateDoctor = (params) => post(`${WZ}/inquiry/patient/symptom/updateDoctor?doctorId=${params.doctorId}&registerId=${params.registerId}`,params);

