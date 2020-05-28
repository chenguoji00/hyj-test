/**
 * 此文件管理项目所有接口
 */
import { get, post } from './network';
import { WZ } from '../config'; //请求地址

// Step1  问诊订单提交  api/member/buy/virtual/step1
export const step1 = (params) => post(`/api/member/buy/virtual/step1`, params,{
  'Content-Type': 'multipart/form-data',
  'Client-Auth': 'aHlqX2g1X3VpOjZjYjcwODEzLTk0NTQtNWVlZC04NzUyLTQyZDZmNDk2MGJmMQ==',
  'Authorization': wx.getStorageSync('hyjToken')
});

//订单信息
export const orderPreview = (param) => get(`${WZ}/inquiry/order/preview`, param)
