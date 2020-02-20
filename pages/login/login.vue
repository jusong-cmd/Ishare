<template>
	<view class="content login-view" :style="{ backgroundImage: `url(${indexBackgroundImage})`, backgroundSize: 'cover' }">
		<view class="app-head">
			<image :src="appIcon" class="app-icon" />
			<text class="app-text">IShare爱分享</text>
		</view>
		<view class="input-group">
			<view class="input-row login-input" v-bind:style="{ height: positionTop + 'px' }">
				<m-input class="m-input" type="text" clearable focus v-model="account" placeholder="账号"></m-input>
			</view>
			<view class="input-row login-input" v-bind:style="{ height: positionTop + 'px' }">
				<m-input type="password" displayable v-model="password" placeholder="密码"></m-input>
			</view>
		</view>
		<view class="keep-password">
			<checkbox-group @change="checkboxChange">
				<label>
					<checkbox value="loginauto" color="#FFCC33" :checked="LoginAuto" style="transform:scale(0.7)" />
					自动登录
				</label>
				<label style="float: right;">
					<checkbox value="keeppw" color="#FFCC33" :checked="KeepPw" style="transform:scale(0.7)" />
					记住密码
				</label>
			</checkbox-group>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="bindLogin"><text class="icon">&#xe76a;</text></button>
		</view>
		<view class="action-row2">
			<view class="text1">——使用其他方式登录——</view>
			<view class="action-row2-img" @click="qqLogin()"><image src="../../static/img/qq.png" style="width: 55rpx;height: 55rpx;margin-top: 12.5rpx;"></image></view>
		</view>
		<view class="action-row">
			<navigator url="../reg/reg" animation-type="fade-in">注册账号</navigator>
			<text style="color: rgba(255, 255, 255, 0.7);">|</text>
			<navigator :url="'../pwd/pwd?account=' + account" animation-type="fade-in">忘记密码</navigator>
		</view>
	</view>
</template>

<script>
import service from '@/service.js';
import api from '@/api/api.js';
import { checklogin, SendQQInfo } from '@/api/login.js';
import { mapState, mapMutations } from 'vuex';
import mInput from '@/components/m-input.vue';
import indexBackgroundImage from '@/static/img/login.jpg';
import appIcon from '@/static/img/appicon.png';
import socket from '@/static/js/socket.js';
export default {
	components: {
		mInput
	},
	data() {
		return {
			indexBackgroundImage: indexBackgroundImage,
			appIcon: appIcon,
			imgsrc: api.apploginimage,
			providerList: [],
			hasProvider: false,
			account: '',
			accountold: '',
			password: '',
			positionTop: 0,
			KeepPw: true,
			LoginAuto: false,
			logintype: 'phone',
			openid: ''
		};
	},
	computed: mapState(['forcedLogin']),
	watch: {
		account(newValue, oldValue) {
			if (newValue != service.getUsers().account) {
				//service.deletUser()
				this.password = '';
			} else {
				this.password = service.getUsers().password;
			}
		},
		logintype(newValue, oldValue) {
			if (newValue != 'phone' && newValue == 'qq') {
				//service.deletUser()
				this.account = '';
				this.QQLogin();
				uni.showLoading({ title: 'QQ登录中...', mask: true });
			}
		},
		LoginAuto(newValue, oldValue) {
			if (newValue && service.getUsers().loginauto) {
				var _this = this;
				if (this.logintype == 'phone') {
					setTimeout(function() {
						_this.bindLogin();
					}, 1000);
				}
			}
		}
	},
	methods: {
		...mapMutations(['login']),
		qqLogin() {
			uni.showLoading({ title: 'QQ授权中...', mask: true });
			uni.login({
				provider: 'qq',
				success: res1 => {
					console.log(res1)
					SendQQInfo({ openid: res1.authResult.openid, asskey: res1.authResult.access_token, pfkey: res1.authResult.pfkey })
						.then(response => {
							var [error, res] = response;
							var msg = res.data.data;
							if (res.data.type == 'error') {
								plus.nativeUI.toast(msg);
							} else if (res.data.type == 'success') {
								getApp().globalData.token = res.data.token;
								getApp().globalData.userid = res.data.userid;
								getApp().globalData.account = res1.authResult.openid;
								service.addUser({
									type: 'qq',
									loginauto: true,
									account: res1.authResult.openid
								});
								service.addToken({ account: res1.authResult.openid, token: res.data.token });
								uni.hideLoading();
								//uni.showLoading({ mask: true, title: ' ' });
								uni.switchTab({
									url: '../main/main',
									animationType: 'pop-in',
									animationDuration: 200
								});
							}
						})
						.catch(response => {
							plus.nativeUI.toast('服务器异常');
							uni.hideLoading();
							//console.log(response)
						});
				},
				fail: (res) => {
					uni.hideLoading();
					plus.nativeUI.toast('授权失败');
				}
			});
		},
		checkboxChange: function(e) {
			this.KeepPw = false;
			this.LoginAuto = false;
			let prList = e.detail.value;
			for (let i = 0; i < prList.length; i++) {
				if (prList[i] == 'keeppw') {
					this.KeepPw = true;
				}
				if (prList[i] == 'loginauto') {
					this.LoginAuto = true;
				}
			}
		},
		bindLogin() {
			if (this.account != this.accountold) {
				service.deletFinger();
				service.deletUser();
			}
			if (this.account.length < 5) {
				plus.nativeUI.toast('账号最短为 5 个字符');
				return;
			}
			if (this.password.length < 6) {
				plus.nativeUI.toast('密码最短为 6 个字符');
				return;
			}
			const data = {
				account: this.account,
				password: this.password,
				id: this.account,
				loginauto: false
			};
			uni.showLoading({
				title: '登录验证中'
			});
			uni.request({
				url: api.login, //仅为示例，并非真实接口地址。
				method: 'POST',
				data: data,
				header: api.header,
				success: res => {
					let redata = res.data;
					if (checklogin(redata.type) == '登录成功') {
						if (this.KeepPw) {
							if (this.LoginAuto) {
								data.loginauto = true;
								service.addUser(data);
							} else {
								service.addUser(data);
							}
						}
						getApp().globalData.token = redata.token;
						getApp().globalData.userid = redata.userid;
						getApp().globalData.account = this.account;
						service.addToken({ account: data.account, token: redata.token });
						uni.hideLoading();
						var appdata = getApp().globalData;
						// appdata.Socket.onOpen(res => {
						// 	console.log('WebSocket已连接.....');
						// 	appdata.SocketOpend = true;
						// });
						uni.showLoading({ mask: true, title: ' ' });
						uni.switchTab({
							url: '../main/main',
							animationType: 'pop-in',
							animationDuration: 200
						});
					}
					uni.hideLoading();
				},
				fail: res => {
					if (res.errMsg == 'request:fail abort') {
						plus.nativeUI.toast('服务器连接出错');
					}
					uni.hideLoading();
				}
			});
		},
		QQLogin() {
			const data = {
				account: this.openid,
				openid: this.openid,
				type: 'qq',
				loginauto: true
			};
			uni.request({
				url: api.QQlogin, //仅为示例，并非真实接口地址。
				method: 'POST',
				data: data,
				header: api.header,
				success: res => {
					let redata = res.data;
					//console.log(redata);
					if (redata.type == 'success') {
						getApp().globalData.token = redata.token;
						getApp().globalData.userid = redata.userid;
						getApp().globalData.account = this.openid;
						service.addToken({ account: data.openid, token: redata.token });
						uni.switchTab({
							url: '../main/main',
							animationType: 'pop-in',
							animationDuration: 200
						});
					}else{
						service.deletFinger();
						service.deletUser();
						plus.nativeUI.toast(redata.data);
					}
					uni.hideLoading();
				},
				fail: res => {
					plus.nativeUI.toast('服务器连接出错');
					uni.hideLoading();
				}
			});
		},
		initPosition() {
			this.positionTop = uni.getSystemInfoSync().windowWidth * 0.6 * 0.19;
		}
	},
	onReady() {
		this.initPosition();
	},
	onShow() {
		// let userinfoget = service.getUsers();
		// this.account = userinfoget.account || '';
		// this.password = userinfoget.password || '';
		// this.LoginAuto = userinfoget.loginauto || false;
	},
	onLoad() {
		let userinfoget = service.getUsers();
		console.log(userinfoget);
		this.logintype = userinfoget.type;
		this.accountold = userinfoget.account || '';
		this.openid = userinfoget.account || '';
		this.account = userinfoget.account || '';
		this.password = userinfoget.password || '';
		this.LoginAuto = userinfoget.loginauto || false;
	}
};
</script>

<style lang="scss" scoped>
.login-view {
	.my-img {
		width: 100%;
		height: 100%;
	}
	.keep-password {
		color: rgba(255, 255, 255, 0.7);
		width: 70%;
		margin: 0 auto;
		uni-checkbox-group {
			padding: 0 20rpx;
		}
	}
	.app-head {
		width: 100%;
		text-align: center;
		.app-icon {
			width: 80px;
			height: 80px;
			margin-top: 20%;
		}
		.app-text {
			display: inline-block;
			width: 100%;
			color: rgba(255, 255, 255, 0.7);
		}
	}
	/deep/.login-input {
		width: 70%;
		margin: 20px auto;
		border: #ffffff 1px solid;
		margin-bottom: 10px;
		border-radius: 50px;
		background-color: rgba(255, 255, 255, 0.5);
		/deep/.m-input-view {
			//background-color: #4CD964;
			//height: 40px;
		}
	}
	/deep/.btn-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		height: 60px;
		.primary {
			line-height: 60px;
			height: 60px;
			width: 60px;
			padding: 0;
			border-radius: 50%;
			border: none;
			box-sizing: unset;
		}
		.icon {
			font-size: 30px;
			color: #ffffff;
			//line-height: 50px;
		}
	}
	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		bottom: 20px;
		left: 0;
		width: 100%;
	}
	.action-row2 {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		bottom: 15%;
		left: 0;
		width: 100%;
		.text1 {
			display: inline-block;
			width: 100%;
			color: rgba(255, 255, 255, 0.7);
			text-align: center;
			font-size: 12px;
			position: absolute;
			margin-top: -50rpx;
		}
		.action-row2-img {
			text-align: center;
			width: 80rpx;
			height: 80rpx;
			background-color: rgba(255, 255, 255, 0.4);
			border-radius: 50%;
			&:active {
				background-color: rgba(255, 255, 255, 0.8);
				box-shadow: 0px 0px 10px #666666;
			}
		}
	}

	.action-row navigator {
		color: rgba(255, 255, 255, 0.7);
		padding: 0 10px;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		width: 50px;
		height: 50px;
		border: 1px solid #dddddd;
		border-radius: 50px;
		margin: 0 20px;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 30px;
		height: 30px;
		margin: 10px;
	}
}
</style>
