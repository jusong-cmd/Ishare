<template>
	<view class="content reg-view" :style="{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover' }">
		<view class="status_bar"></view>
		<view class="cat-view">
			<div class="cat">
				<div class="shadow"></div>
				<div class="key">
					<div class="bow">
						<div class="upper"><div class="hole"></div></div>
						<div class="lower"><div class="hole"></div></div>
					</div>
					<div class="blade "></div>
				</div>
				<div class="tail"></div>
				<div class="body"></div>
				<div class="leg left"></div>
				<div class="paw left"></div>
				<div class="leg right "></div>
				<div class="paw right "></div>
				<div class="leg left forward"></div>
				<div class="paw left forward"></div>
				<div class="leg right forward"></div>
				<div class="paw right forward"></div>
				<div class="bowl">
					<div class="lower"></div>
					<div class="rim"></div>
					<div class="milk"></div>
				</div>
				<div class="tongue"></div>
				<div class="head">
					<div class="ear left"></div>
					<div class="ear right"></div>
				</div>
			</div>
		</view>
		<view class="input-group">
			<view class="input-row reg-input">
				<m-input type="text" focus clearable v-model="account" placeholder="请输入手机号码" style="width: 70%;"></m-input>
				<button type="primary" class="uni-button" @tap="sendCode" :loading="Send_Code" style="width: 30%;">{{Lable}}</button>
			</view>
			<view class="input-row reg-input"><m-input type="text" focus clearable v-model="code" placeholder="请输入注册验证码"></m-input></view>
			<view class="input-row reg-input"><m-input type="text" focus clearable v-model="name" placeholder="请设置昵称"></m-input></view>
			<view class="input-row reg-input"><m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input></view>
			<view class="input-row reg-input"><m-input type="password" displayable v-model="password2" placeholder="请确认密码"></m-input></view>
			<view class="input-row reg-input"><m-input type="text" clearable v-model="email" placeholder="请输入邮箱"></m-input></view>
			<view class="tip-text"><text>邮箱用于找回密码操作，谨慎填写</text></view>
		</view>
		<view class="btn-row"><button type="primary" class="primary" @tap="register">注册</button></view>
	</view>
</template>

<script>
import service from '@/service.js';
import { SendSms } from '@/api/login.js';
import api from '@/api/api.js';
import mInput from '@/components/m-input.vue';
import indexBackgroundImage from '@/static/img/login.jpg';

export default {
	components: {
		mInput
	},
	data() {
		return {
			account: '',
			password: '',
			password2: '',
			code:'',
			Lable: '发送验证',
			name: '',
			email: '',
			tel: '',
			Send_Code: false,
			Edit_Pw: false,
			BackgroundImage: indexBackgroundImage,
			div_show: true
		};
	},
	methods: {
		sendCode() {
			var _this = this;
			if (this.Lable == '发送验证') {
				var timetotal = 180;
				var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
				if(!myreg.test(this.account)){
					uni.showToast({icon: 'none',title: '电话号码格式错误!'});
					return 
				}
				this.Send_Code = true;
				let data = {
					phone: this.account,
					checkid:'sendSms'
				};
				SendSms(data).then(response => {
					let [error, res] = response;
					if(res.data.type=='success'){
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
					}else{
						plus.nativeUI.toast(res.data.data);
						this.Send_Code = false;
					}
				}).catch(res => {
					plus.nativeUI.toast('服务器访问异常');
					this.Send_Code = false;
				})
				;
			} else {
				uni.showToast({icon: 'none',title: '请稍后再试'});
				return;
			}
		},
		register() {
			var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
			var myreg2 = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
			if(!myreg.test(this.account)){
				uni.showToast({icon: 'none',title: '电话号码格式错误!'});
				return 
			}
			if(!myreg2.test(this.email)){
				uni.showToast({icon: 'none',title: '邮箱格式错误!'});
				return 
			}
			if (this.password.length < 6) {
				uni.showToast({icon: 'none',title: '密码最短为 6 个字符!'});
				return;
			}
			if (this.code.length != 6) {
				uni.showToast({icon: 'none',title: '验证码格式错误!'});
				return;
			}
			if (this.password != this.password2) {
				uni.showToast({icon: 'none',title: '两次输入密码不同!'});
				return;
			}
			if (this.name.length > 11) {
				uni.showToast({icon: 'none',title: '昵称不得超过11位!'});
				return;
			}
			if (this.name.length == 0) {
				uni.showToast({icon: 'none',title: '请输入昵称!'});
				return;
			}
			uni.showLoading({
				title: '注册验证中'
			});
			const data = {
				email: this.email,
				password: this.password,
				code:this.code,
				phone: this.account,
				name: this.name,
				account:this.account,
			};
			uni.request({
				url: api.register, //仅为示例，并非真实接口地址。
				method: 'POST',
				data: data,
				header: api.header,
				success: res => {
					let redata = res.data;
					//console.log(redata)
					plus.nativeUI.toast(redata.data);
					if (redata.type == 'success') {
						service.addUser(data);
						uni.navigateBack({
							delta: 1
						});
						uni.hideLoading();
					}
					uni.hideLoading();
				},
				fail: res => {
					plus.nativeUI.toast('服务器连接出错');
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.reg-view {
	max-width: 100%;
	.cat-view {
		position: relative;
		.shadow {
			position: absolute;
			left: 50%;
			top: 75%;
			transform: translate(-50%, -50%);
			background: black;
			opacity: 0.05;
			height: 70px;
			width: 150px;
			border-radius: 50%;
		}

		.cat {
			margin: auto;
			position: relative;
			//margin-top: 100px;
			height: 200px;
			width: 200px;
		}

		.bowl {
			position: relative;
			top: 88%;
		}
		.bowl .milk {
			left: 50%;
			transform: translate(-50%, -50%);
			position: absolute;
			height: 20px;
			border-radius: 60%;
			width: 60px;
			background: white;
		}
		.bowl .rim {
			left: 50%;
			transform: translate(-50%, -50%);
			position: absolute;
			height: 30px;
			border-radius: 50%;
			width: 80px;
			background: #637fdb;
		}
		.bowl .lower {
			left: 50%;
			transform: translate(-50%, -50%);
			position: absolute;
			height: 26px;
			top: 13px;
			border-radius: 0 0 80% 80%;
			width: 80px;
			background: #fd903d;
		}

		.head {
			position: relative;
			transform: translate(-50%, -50%);
			border-bottom: 2px solid #322944;
			border-top: 2px solid transparent;
			top: 20%;
			left: 50%;
			background: #cd7555;
			height: 60px;
			width: 60px;
			border-radius: 50%;
			animation: drink 8s cubic-bezier(0.8, 0, 0.2, 1) infinite;
		}

		.ear {
			position: absolute;
			background-color: #382f46;
			text-align: left;
		}
		.ear.left {
			left: 5px;
			transform: rotate(12deg) skewX(-30deg) scale(1, 0.9);
		}
		.ear.right {
			right: -1px;
			top: 5px;
			transform: rotate(100deg) skewX(-30deg) scale(1, 0.866);
		}

		.ear:before,
		.ear:after {
			content: '';
			position: absolute;
			background-color: inherit;
		}

		.ear,
		.ear:before,
		.ear:after {
			width: 1em;
			height: 1em;
			border-top-right-radius: 30%;
		}

		.ear {
			transform: rotate(100deg) skewX(-30deg) scale(1, 0.866);
		}

		.ear:before {
			transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707) translate(0, -50%);
		}

		.ear:after {
			transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%);
		}

		.tail {
			position: absolute;
			top: 0%;
			transform-origin: center bottom;
			left: calc(50% - 8px);
			height: 120px;
			width: 15px;
			background: #382f46;
			border-radius: 40px;
			transform: rotatez(45deg);
			animation: wag infinite 1.5s ease-in-out alternate;
		}

		.body {
			transform: translate(-50%, -50%);
			position: absolute;
			transform-origin: center center;
			top: 50%;
			left: 50%;
			background: #463f56;
			height: 100px;
			width: 70px;
			border-radius: 100px;
		}

		.leg {
			transform: translate(-50%, -50%);
			position: absolute;
			transform-origin: center center;
			top: 55%;
			left: 34%;
			background: #463f56;
			height: 60px;
			width: 25px;
			border-radius: 100px;
		}
		.leg.right {
			left: unset;
			right: 22%;
		}
		.leg.right.forward {
			top: 68%;
			left: unset;
			right: 34%;
			width: 20px;
		}
		.leg.forward {
			top: 68%;
			left: 42%;
			width: 20px;
		}

		.paw {
			transform: translate(-50%, -50%) rotate(60deg);
			position: absolute;
			transform-origin: center center;
			top: 70%;
			left: 30%;
			background: #463f56;
			height: 30px;
			width: 20px;
			border-radius: 100px;
		}
		.paw.right {
			left: unset;
			right: 22%;
			transform: translate(-50%, -50%) rotate(-60deg);
		}
		.paw.right.forward {
			top: 80%;
			left: unset;
			right: 32%;
			width: 20px;
		}
		.paw.forward {
			top: 80%;
			left: 40%;
			width: 20px;
		}

		.tongue {
			transform-origin: top center;
			opacity: 0;
			left: 45%;
			top: 80%;
			position: absolute;
			height: 15px;
			width: 10px;
			background: #ffb9be;
			border-radius: 40px;
			animation: lick 8s cubic-bezier(0.8, 0, 0.2, 1) infinite;
		}

		.key {
			position: absolute;
			left: 20px;
			top: 100px;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			animation: rotate infinite 1.5s linear;
		}
		.key .blade {
			width: 30px;
			height: 10px;
			background: #8c8c8c;
		}
		.key .bow {
			position: relative;
			height: 10px;
			width: 10px;
			background: #8c8c8c;
		}
		.key .bow .upper {
			top: -80%;
			left: -30%;
			position: absolute;
			border-radius: 50%;
			width: 15px;
			height: 15px;
			background: #8c8c8c;
		}
		.key .bow .hole {
			margin-top: 3px;
			margin-left: 3px;
			border-radius: 50%;
			width: 8px;
			height: 8px;
			background: #ffb9be;
		}
		.key .bow .lower {
			left: -30%;
			top: 30%;
			position: absolute;
			border-radius: 50%;
			width: 15px;
			height: 15px;
			background: #8c8c8c;
		}

		@keyframes drink {
			0% {
				border-top: 2px solid transparent;
			}
			30% {
				transform: translate(-50%, 50%) rotate3d(1, 0, 0, 30deg);
				border-top: 2px solid #322944;
				top: 40%;
				border-bottom: 2px solid transparent;
			}
			40% {
				top: 40%;
				border-bottom: 0 solid transparent;
			}
			70% {
				border-top: 2px solid transparent;
				top: 20%;
			}
			100% {
				top: 20%;
			}
		}
		@keyframes rotate {
			from {
				transform: rotatex(0deg);
			}
			to {
				transform: rotatex(359deg);
			}
		}
		@keyframes lick {
			0% {
				opacity: 0;
			}
			29% {
				opacity: 0;
			}
			30% {
				opacity: 1;
				transform: rotate(-95deg);
			}
			40% {
				opacity: 1;
				transform: rotate(90deg);
			}
			41% {
				opacity: 0;
			}
		}
		@keyframes wag {
			from {
				transform: rotatez(45deg);
			}
			to {
				transform: rotatez(70deg);
			}
		}
	}
	.input-group {
		margin: 0;
		margin-top: 10px;
	}
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
	.tip-text {
		padding-left: 18%;
		max-width: 100%;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.8);
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
}
</style>
