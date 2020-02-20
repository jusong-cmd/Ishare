import api from '@/api/api.js';
import request from '@/api/request.js'
//监控概览获取折线图
export function getPageData(data) {
	return request.post(api.getPage, data)
}
// export function getPageData(data) {
// 	return uni.request({
// 		url: api.getPage, //仅为示例，并非真实接口地址。
// 		data: data,
// 		method: 'POST',
// 		header: api.header,
// 	});
// }
export function getPageDetail(data) {
	return request.post(api.getPageDetail, data)
}
export function sendStudentImg(data) {
	return request.post(api.sendStudentImg, data)
}
export function getBindStatus(data) {
	return request.post(api.getBindStatus, data)
}
// export function getPageDetail(data) {
// 	return uni.request({
// 		url: api.getPageDetail, //仅为示例，并非真实接口地址。
// 		data: data,
// 		method: 'POST',
// 		header: api.header,
// 	});
// }
export function getCommentDetail(data) {
	return request.post(api.getComment, data)
}
// export function getCommentDetail(data) {
// 	return uni.request({
// 		url: api.getComment, //仅为示例，并非真实接口地址。
// 		data: data,
// 		method: 'POST',
// 		header: api.header,
// 	});
// }
export function getUserInfo(data) {
	return request.post(api.getUserInfo, data)
}
export function sendComment(data) {
	return request.post(api.sendComment, data)
}
export function getBindSms(data) {
	return request.post(api.getBindSms, data)
}
export function bindQQorPhone(data) {
	return request.post(api.bindQQorPhone, data)
}
// export function sendComment(data) {
// 	return uni.request({
// 		url: api.sendComment, //仅为示例，并非真实接口地址。
// 		data: data,
// 		method: 'POST',
// 		header: api.header,
// 	});
// }