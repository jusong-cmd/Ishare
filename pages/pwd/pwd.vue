<template>
	<view class="content pwd-view" :style="{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover' }">
		<view class="status_bar"></view>
		<view style="width: 100%;" class="gif-img">
			<div class="container">
				<div class="icecream">
					<div class="icecream-body">
						<div class="icecream-body__slice"></div>
						<div class="icecream-body__slice"></div>
						<div class="icecream-body__slice">
							<span class="eye"><span class="eye__retina"></span></span>
							<div class="mouth">
								<span class="mouth__lip"></span>
								<span class="mouth__saliva"></span>
							</div>
							<span class="eye"><span class="eye__retina"></span></span>
						</div>
						<div class="icecream-body__slice"></div>
					</div>
					<div class="icecream-stick"></div>
				</div>
			</div>
		</view>
		<view class="input-group">
			<view v-if="div_show">
				<view class="input-row login-input"><m-input type="text" focus clearable v-model="account" placeholder="请输入账号"></m-input></view>
				<view class="input-row login-input">
					<m-input type="text" focus clearable v-model="email" placeholder="请输入邮箱" style="width: 70%;"></m-input>
					<button type="primary" class="uni-button" @tap="SendCode" :loading="Send_Code" style="width: 30%;">{{ Lable }}</button>
				</view>
				<view class="tip-text"><text>注意：邮箱必须和注册时保持一致</text></view>
			</view>
			<view v-if="!div_show">
				<view class="input-row login-input"><m-input type="text" focus clearable v-model="code" placeholder="请输入验证码"></m-input></view>
				<view class="input-row login-input">
					<m-input type="text" focus clearable v-model="password" placeholder="请输入修改的密码" style="width: 70%;"></m-input>
					<button type="primary" class="uni-button" @tap="editpassword" :loading="Edit_Pw" style="width: 30%;">修改密码</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import service from '../../service.js';
import api from '../../api/api.js';
import mInput from '../../components/m-input.vue';
import indexBackgroundImage from '@/static/img/login.jpg';
export default {
	components: {
		mInput
	},
	data() {
		return {
			email: '',
			account: '',
			code: '',
			Lable: '发送验证',
			password: '',
			Send_Code: false,
			Edit_Pw: false,
			BackgroundImage: indexBackgroundImage,
			div_show: true
		};
	},
	onLoad: function(option) {
		this.account = option.account;
	},
	onShow() {},
	methods: {
		SendCode() {
			var _this = this;
			if (this.Lable == '发送验证') {
				var timetotal = 180;
				if (this.email.length < 3 || !~this.email.indexOf('@')) {
					uni.showToast({
						icon: 'none',
						title: '邮箱地址不合法'
					});
					return;
				}
				this.Send_Code = true;
				this.Lable = '180S';
				var timesleep = setInterval(function() {
					timetotal = timetotal - 1;
					_this.Lable = timetotal + 'S';
					if (timetotal == 0) {
						clearInterval(timesleep);
						_this.Lable = '发送验证';
						_this.Send_Code = false;
					}
				}, 1000);
				const data = {
					email: this.email,
					password: this.password,
					id: this.account,
					code: this.code
				};
				uni.request({
					url: api.sendemail, //仅为示例，并非真实接口地址。
					method: 'POST',
					data: data,
					header: api.header,
					success: res => {
						let redata = res.data;
						plus.nativeUI.toast(redata.type);
						if (redata.type == '邮件发送成功') {
							this.div_show = false;
						}
						//console.log(redata);
						//console.log(logintype.checklogin(data.type));
					}
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '请稍后再试'
				});
				return;
			}
		},
		editpassword() {
			const data2 = {
				email: this.email,
				password: this.password,
				account: this.account,
				code: this.code
			};
			uni.showLoading({
				title: '密码修改中'
			});
			uni.request({
				url: api.editpw, //仅为示例，并非真实接口地址。
				method: 'POST',
				data: data2,
				header: api.header,
				success: res => {
					let redata = res.data;
					plus.nativeUI.toast(redata.type);
					if (redata.type == '密码修改成功') {
						service.addUser(data2);
						uni.navigateBack({
							delta: 1
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
		}
	}
};
</script>
<style lang="less" scoped>
.pwd-view {
	@keyframes move {
		50% {
			transform: translateX(-0.5px) rotate(-5deg);
		}
		100% {
			transform: translateX(0.25px) rotate(1deg);
		}
	}
	@keyframes eyes {
		0% {
			transform: scaleY(1) translate(0, 0);
		}
		10% {
			transform: scaleY(-1) translate(0, -0.5px);
		}
		100% {
			transform: scaleY(-1) translate(0, -0.5px);
		}
	}
	@keyframes lip {
		to {
			transform: scaleY(0.7);
		}
	}
	@keyframes saliva {
		0% {
			transform: scaleY(1.5);
		}
		50% {
			transform: scaleY(1.75);
		}
		75% {
			transform: scaleY(1.6);
		}
		100% {
			transform: scaleY(2);
		}
	}
	*,
	*:after,
	*:before {
		box-sizing: border-box;
	}
	.gif-img{
		margin: 0;
		margin-top: 8%;
		padding: 0;
		width: 100%;
		background: rgba(255,255,255,0);
		.container {
			width: 95%;
			height: 100%;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.container .icecream {
			width: 135px;
			height: 240px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.container .icecream:hover {
			animation: move 1s ease-in-out infinite alternate;
		}
		.container .icecream:hover .icecream-body__slice:nth-child(3) .eye {
			animation: eyes 1s ease-in infinite alternate;
		}
		.container .icecream:hover .icecream-body__slice:nth-child(3) .mouth__lip {
			animation: lip 0.5s ease-in infinite alternate;
		}
		.container .icecream:hover .icecream-body__slice:nth-child(3) .mouth__saliva {
			opacity: 0;
		}
		.container .icecream .icecream-body {
			display: flex;
			flex-direction: column;
			height: 75%;
			width: 100%;
			border-radius: 135px 135px 30px 30px;
			border: 7px solid #461b19;
			position: relative;
			overflow: hidden;
			box-shadow: 12.5px 12.5px 0 Rgba(125,125,125,0.5);
		}
		.container .icecream .icecream-body:before {
			content: '';
			width: 100%;
			height: 100%;
			border-radius: 20px 27px 0 0;
			position: absolute;
			box-shadow: inset 1.8px 0 0 rgba(255, 255, 255, 0.2);
		}
		.container .icecream .icecream-body:after {
			content: '';
			width: 100%;
			height: 100%;
			border-radius: 27px 18px 0 0;
			position: absolute;
			box-shadow: inset -2.4px 0 0 rgba(0, 0, 0, 0.2);
		}
		.container .icecream .icecream-body__slice {
			display: flex;
			border-bottom: 5px solid #461b19;
		}
		.container .icecream .icecream-body__slice:nth-child(2n-1) {
			height: 30%;
		}
		.container .icecream .icecream-body__slice:nth-child(2n) {
			height: 20%;
		}
		.container .icecream .icecream-body__slice:nth-child(1) {
			background: #a9d8ea;
		}
		.container .icecream .icecream-body__slice:nth-child(2) {
			background: #ab96db;
		}
		.container .icecream .icecream-body__slice:nth-child(3) {
			align-items: center;
			justify-content: center;
			background: #fcbad2;
		}
		.container .icecream .icecream-body__slice:nth-child(3) .eye {
			width: 14px;
			height: 7.5px;
			background: #461b19;
			border-radius: 14px 14px 0 0;
			position: relative;
			margin-bottom: 17.5px;
			transform-origin: 0 50%;
		}
		.container .icecream .icecream-body__slice:nth-child(3) .eye:before {
			content: '';
			width: 4.5px;
			height: 4.5px;
			background: #461b19;
			border-radius: 100%;
			position: absolute;
			bottom: 0;
			left: 0;
			transform: translate(0, 2px);
			position: absolute;
			z-index: 1;
		}
		.container .icecream .icecream-body__slice:nth-child(3) .eye:after {
			content: '';
			width: 4.5px;
			height: 4.5px;
			background: #461b19;
			border-radius: 100%;
			position: absolute;
			bottom: 0;
			right: 0;
			transform: translate(0, 2px);
			position: absolute;
			z-index: 1;
		}
		.container .icecream .icecream-body__slice:nth-child(3) .eye__retina {
			width: 5px;
			height: 5px;
			background: #fcbad2;
			border-radius: 100%;
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translate(-0.5px, 2.5px);
			z-index: 1;
		}
		.container .icecream .icecream-body__slice:nth-child(3) .mouth {
			position: relative;
			width: 15px;
			height: 14px;
			margin: 0 5px;
		}
		.container .icecream .icecream-body__slice:nth-child(3) .mouth__lip {
			width: 100%;
			height: 100%;
			background: #461b19;
			border-radius: 30% 30% 50% 50% / 29% 29% 65% 65%;
			position: absolute;
			z-index: 1;
		}
		.container .icecream .icecream-body__slice:nth-child(3) .mouth__saliva {
			width: 7.5px;
			height: 12.5px;
			background: #ffffff;
			border-radius: 5px;
			position: absolute;
			transform-origin: 0 0;
			z-index: 0;
			animation: saliva 0.75s cubic-bezier(0.4, 0, 1, 1) infinite alternate;
		}
		.container .icecream .icecream-body__slice:nth-child(4) {
			background: #ffffd2;
			border-bottom: 0;
		}
		.container .icecream .icecream-stick {
			display: flex;
			height: 25%;
			width: 50px;
			border-radius: 0 0 50px 50px;
			border: 8.5px solid #461b19;
			border-top: 0;
			background: #ffd379;
			position: relative;
			box-shadow: 12.5px 12px 0 Rgba(125,125,125,0.5);
		}
		.container .icecream .icecream-stick:before {
			content: '';
			width: 100%;
			height: 17.5px;
			background: #d9ae58;
			position: absolute;
		}
	}
	.input-group {
		margin: 20px 0;
		margin-top: 60px;
	}
	/deep/.login-input {
		width: 70%;
		margin: 20px auto;
		border: #ffffff 1px solid;
		margin-bottom: 10px;
		border-radius: 50px;
		background-color: rgba(255, 255, 255, 0.5);
		height: 40px;
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
		text-align: center;
		width: 100%;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.8);
	}
}
</style>
