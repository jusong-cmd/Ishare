import api from '../../api/api.js';
const getSocket = function(account) {
	var socketTask = uni.connectSocket({
		url: api.socapi,
		header: api.header,
		protocols: [account],
		success: (res) => {}
	});
	return socketTask;
}
const CheckToken = function(token) {
	const app = getApp();
	var Socket = app.globalData.Socket
	Socket.onOpen(res => {
		console.log('WebSocket已连接.....');
		Socket.send({
			data: token,
			success: res => {
				console.log("token发送成功.....");
			},
			fail: res => {
				console.log(res);
			},
		});
	});
}
const KeepTimer = function(socketTask, account, token) {
	const app = getApp();
	var data1 = {}
	data1.account = account
	data1.token = token
	data1.type = 'timer'
	var data2 = JSON.stringify(data1)
	//console.log(data1)
	socketTask.onOpen(res => {
		app.globalData.SocketTimer = setInterval(function() {
			socketTask.send({
				data: data2,
				success: res => {
					console.log("timer发送成功.....");
				},
				fail: res => {
					console.log(res);
				},
			});
		}, 25 * 1000)
	});
}
const SendMsg = function(socketTask, data) {
	var data2 = JSON.stringify(data)
	socketTask.send({
		data: data2,
		success: res => {
			console.log("消息发送成功.....");
		},
		fail: res => {
			plus.nativeUI.toast('消息发送失败');
		},
	});
}
const GetSocMsg = function() {
	const app = getApp();
	var Socket = app.globalData.Socket
	var data = Socket.onMessage(onMessage => {
		return onMessage.data
	});
	return data
}
export default {
	getSocket,
	CheckToken,
	GetSocMsg,
	KeepTimer,
	SendMsg
}
