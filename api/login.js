import api from '@/api/api.js';
export function SendSms(data) {
	return uni.request({
		url: api.sendSms, //仅为示例，并非真实接口地址。
		data: data,
		method: 'POST',
		header: api.header,
	});
}
export function SendQQInfo(data) {
	return uni.request({
		url: api.getQQInfo, //仅为示例，并非真实接口地址。
		data: data,
		method: 'POST',
		header: api.header,
	});
}
export function checklogin(type) {
    if(type=="Non-existent")
	{
		plus.nativeUI.toast('账号不存在');
		uni.removeStorage({
		    key: 'USERS_KEY',
		    success: function (res) {
		    }
		});
		return;
	}else if(type=="login-failure")
	{
		plus.nativeUI.toast('账号或密码错误');
		uni.removeStorage({
		    key: 'USERS_KEY',
		    success: function (res) {
		    }
		});
		return;
	}else if(type=="login-success")
	{
		plus.nativeUI.toast('登录成功');
		return '登录成功';
	}else
	{
		plus.nativeUI.toast('服务器响应失败');
		return;
	}
    
}