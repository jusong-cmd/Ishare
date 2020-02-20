<template>
	<view class="bind-phoneorQQ-view" :style="{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover' }">
		<view class="bind-phone" v-if="type == 'phone'">
			<view class="input-row reg-input">
				<m-input type="text" focus clearable v-model="phone" placeholder="请输入手机号码" style="width: 70%;"></m-input>
				<button type="primary" class="uni-button" @tap="sendCode" :loading="Send_Code" style="width: 30%;">{{ Lable }}</button>
			</view>
			<view class="input-row reg-input"><m-input type="text" focus clearable v-model="code" placeholder="请输入手机验证码"></m-input></view>
			<view class="btn-row"><button type="primary" class="primary" @tap="bindPhone">立即绑定</button></view>
		</view>
		<view class="bind-phone" v-if="type == 'QQ'">
			<view class="action-row2">
				<view class="text1">——点击进行QQ授权——</view>
				<view class="action-row2-img" @click="bindQQ()"><image src="../../static/img/qq.png" style="width: 55rpx;height: 55rpx;margin-top: 12.5rpx;"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
import mInput from '@/components/m-input.vue';
import { getBindSms, bindQQorPhone } from '@/api/getpage.js';
import indexBackgroundImage from '@/static/img/login.jpg';
export default {
	components: {
		mInput
	},
	data() {
		return {
			BackgroundImage: indexBackgroundImage,
			Send_Code: false,
			account: '',
			code: '',
			token: '',
			phone: '',
			userid: '',
			type: '',
			Lable: '发送验证'
		};
	},
	onLoad(e) {
		this.type = e.type || '';
		console.log(this.type);
		const app = getApp();
		if(this.type=='QQ'){
			uni.setNavigationBarTitle({
			    title: '绑定QQ'
			});
		}else if(this.type=='phone'){
			uni.setNavigationBarTitle({
			    title: '绑定手机'
			});
		}
		this.account = app.globalData.account;
		this.userid = app.globalData.userid;
		this.token = app.globalData.token;
	},
	methods: {
		bindQQ(){
			uni.login({
				provider: 'qq',
				success: res1 => {
					bindQQorPhone({ openid: res1.authResult.openid, asskey: res1.authResult.access_token, pfkey: res1.authResult.pfkey,type:'QQ',token:this.token})
						.then(response => {
							let res = response;
							plus.nativeUI.toast(res.data.data);
							if (res.data.type == 'success') {
								uni.navigateBack({
								    delta: 1
								});
							}
						})
						.catch(response => {
							plus.nativeUI.toast('服务器异常');
						});
				},
				fail: (res) => {
					plus.nativeUI.toast('授权失败');
				}
			});
		},
		bindPhone() {
			if (this.phone == '' || this.code == '') {
				uni.showToast({ icon: 'none', title: '请输入手机号码及验证码' });
				return;
			}
			var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
			if (!myreg.test(this.phone)) {
				uni.showToast({ icon: 'none', title: '手机号码格式错误!' });
				return;
			}
			const data = {
				token: this.token,
				phone: this.phone,
				code: this.code,
				type: 'phone'
			};
			bindQQorPhone(data)
				.then(response => {
					let res = response;
					plus.nativeUI.toast(res.data.data);
					if (res.data.type == 'success') {
						uni.navigateBack({
						    delta: 1
						});
					}
				})
				.catch(response => {
					console.log(response);
					plus.nativeUI.toast('服务器异常');
				});
		},
		sendCode() {
			var _this = this;
			if (this.Lable == '发送验证') {
				var timetotal = 180;
				var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
				if (!myreg.test(this.phone)) {
					uni.showToast({ icon: 'none', title: '电话号码格式错误!' });
					return;
				}
				this.Send_Code = true;
				const data = {
					token: this.token,
					phone: this.phone
				};
				getBindSms(data)
					.then(response => {
						let res = response;
						if (res.data.type == 'success') {
							_this.Lable = '180S';
							var timesleep = setInterval(function() {
								timetotal = timetotal - 1;
								_this.Lable = timetotal + 'S';
								if (timetotal == 0) {
									clearInterval(timesleep);
									_this.Lable = '发送验证';
									_this.Send_Code = false;
								}
							}, 1000);
						} else {
							plus.nativeUI.toast(res.data.data);
							this.Send_Code = false;
						}
					})
					.catch(res => {
						plus.nativeUI.toast('服务器访问异常');
						this.Send_Code = false;
					});
			} else {
				uni.showToast({ icon: 'none', title: '请稍后再试' });
				return;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.bind-phoneorQQ-view {
	width: 100%;
	min-height: 300px;
	height: auto;
	.bind-phone {
		width: 100%;
		margin-top: 300rpx;
		/deep/.reg-input {
			width: 70%;
			margin: 20rpx auto;
			border: #ffffff 1px solid;
			margin-bottom: 1px;
			border-radius: 40px;
			background-color: rgba(255, 255, 255, 0.5);
			height: 37px;
			.uni-button {
				border-radius: 50px;
				line-height: 38px;
				padding: 0;
				background-color: rgba(255, 255, 255, 0);
				font-size: 16px;
				font-weight: bold;
				color: #0faeff;
				border-bottom-left-radius: 0px;
				border-top-left-radius: 0px;
				border-left: 1px solid #ffffff;
			}
		}
		/deep/.btn-row {
			width: 200rpx;
			margin: 0 auto;
			padding-top: 20px;
			border-radius: 50px;
			.primary {
				padding: 0;
				border-radius: 50px;
				border: none;
				box-sizing: unset;
			}
		}
		.action-row2 {
			display: flex;
			flex-direction: row;
			justify-content: center;
			position: absolute;
			bottom: 50%;
			left: 0;
			width: 100%;
			.text1 {
				display: inline-block;
				width: 100%;
				color: rgba(255, 255, 255, 0.7);
				text-align: center;
				font-size: 14px;
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
	}
}
</style>
