/**
 * 此文件管理项目部门的接口
 */
import {get, post, put, del} from './network';
import { OSSWG, WZ } from '../config'; //请求地址


//获取医院一级菜单
export const findDeptlist = (params) => get(WZ+'/dept/list/floor1',params);

//获取科室下的医生列表
export const deptDoctor = (params) => get(WZ+'/dept/doctor/list',params)
