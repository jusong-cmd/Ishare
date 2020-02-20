import api from '@/api/api.js';
export function OutPut(data) {
	return uni.request({
		url: api.OutPut, //仅为示例，并非真实接口地址。
		data: data,
		method: 'POST',
		header: api.header,
	});
}