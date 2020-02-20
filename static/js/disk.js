import api from '@/api/api.js';
const getDiskStatus = function(data) {
	return uni.request({
		url: api.getDiskStatus, //仅为示例，并非真实接口地址。
		data: data,
		method: 'POST',
		header: api.header,
	});
}
const setDiskPw = function(data) {
	return uni.request({
		url: api.setDiskPassWord, //仅为示例，并非真实接口地址。
		data: data,
		method: 'POST',
		header: api.header,
	});
}
const getPraviteDiskData = function(data) {
	return uni.request({
		url: api.getPraviteDisk,
		data: data,
		method: 'POST',
		header: api.header
	});
}
const deletPrvDiskFile = function(data) {
	return uni.request({
		url: api.deletePrvDoc,
		data: data,
		method: 'POST',
		header: api.header
	});
}
const getPrvDiskFile = function(data) {
	return uni.request({
		url: api.getPrvDiskFile,
		data: data,
		method: 'POST',
		header: api.header
	});
}
const reNameFile = function(data) {
	return uni.request({
		url: api.reNameFile,
		data: data,
		method: 'POST',
		header: api.header
	});
}
const applyDisk = function(data) {
	return uni.request({
		url: api.applyDisk,
		data: data,
		method: 'POST',
		header: api.header
	});
}
const moveFile = function(data) {
	return uni.request({
		url: api.moveFile,
		data: data,
		method: 'POST',
		header: api.header
	});
}
const copyFile = function(data) {
	return uni.request({
		url: api.copyFile,
		data: data,
		method: 'POST',
		header: api.header
	});
}
const adminDelet = function(data) {
	return uni.request({
		url: api.AdminDelDoc,
		data: data,
		method: 'POST',
		header: api.header
	});
}
export default {
	getDiskStatus,
	setDiskPw,
	getPraviteDiskData,
	deletPrvDiskFile,
	getPrvDiskFile,
	reNameFile,
	applyDisk,
	moveFile,
	copyFile,
	adminDelet
}
