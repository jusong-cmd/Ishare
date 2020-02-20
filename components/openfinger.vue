<template>
	<view class="prvdisk-login-view">
		<view class="input-group">
			<view v-show="type == 'CheckPw'">
				<view v-show="!fingerShow">
					<view class="input-row login-input"><m-input type="password" displayable v-model="password" placeholder="请输入独立密码"></m-input></view>
					<view class="open-finger">
						<switch @change="OpenFinger" style="transform:scale(0.7)" :disabled="Switch.FingerSwitch" :checked="Switch.SwitchCheck" color="#05d376" />
						开启指纹登录,下次登录生效
					</view>
					<view class="btn-class"><button @click="LoginInDisk()" class="btn">登陆云盘</button></view>
				</view>
				<view v-show="fingerShow" class="finger-color">
					<view class="finger" style="margin-bottom: 20px;">请验证你的指纹</view>
					<view class="finger"><text class="icon icon-denglu finger" :class="{ fingerTrue: fingerclassTrue, fingerFalse: fingerclassFalse }">&#xe626;</text></view>
				</view>
			</view>
			<view v-show="type == 'SetPw'">
				<view class="finger">你未设置独立密码，请设置6位独立密码</view>
				<view class="input-row login-input"><m-input type="password" displayable v-model="password" placeholder="请输入独立密码"></m-input></view>
				<view class="input-row login-input"><m-input type="password" displayable v-model="passwordcheck" placeholder="请确认独立密码"></m-input></view>
				<view class="btn-class"><button @click="SetPw()" class="btn">设置密码</button></view>
			</view>
			<view v-show="type == 'CreatDisk'">
				<view class="finger">你暂无私人云盘授权，请联系管理员添加</view>
				<view class="input-row login-input"><m-input clearable type="text" v-model="msg" placeholder="请输入申请理由或授权码"></m-input></view>
				<view class="btn-class"><button @click="ApplyDisk()" class="btn">立即申请</button></view>
			</view>
			<view v-show="type == 'unbind'">
				<view class="finger">系统安全限制，未绑定手机暂无法使用该功能</view>
				<view class="btn-class"><button @click="BindPhone()" class="btn">立即绑定</button></view>
			</view>
		</view>
		<!-- <view class="music-btn">
			<view class="btn-class" v-if="needlogin"><button @click="musicLogin()">登录会员</button></view>
			<view class="btn-class"><button @click="CheckDiskStatus()">刷新登录</button></view>
			<view class="btn-class" v-if="!needlogin"><button @click="LoginOut()">退出登录</button></view>
		</view> -->
	</view>
</template>

<script>
import mInput from '@/components/m-input';
import disk from '@/static/js/disk.js';
import service from '@/service.js';
import {mapState} from 'vuex'
export default {
	components: {
		mInput
	},
	props: {
		token: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			account: '',
			password: '',
			fingerShow: false,
			passwordcheck: '',
			needlogin: false,
			type: '',
			msg:'',
			fingerclassTrue: false,
			fingerclassFalse: false,
			fingercanUse: false,
			Switch: {
				FingerSwitch: false,
				SwitchCheck: false
			}
		};
	},
	created() {
		this.CheckDiskStatus();
		this.fingerShow = Boolean(service.getToken().finger);
		if (this.FingerCanUse() && this.fingerShow) {
			this.password=service.getToken().diskpw
			this.fingercanUse = true;
		} else {
			service.deletFinger();
			this.fingerShow = false;
		}
		//console.log(service.getToken());
	},
	mounted() {
		var that = this;
		if (this.fingercanUse) {
			//plus.nativeUI.toast('请验证你的指纹');
			plus.fingerprint.authenticate(
				function() {
					that.fingerclassTrue = true;
					that.LoginSuccess()
				},
				function(e) {
					switch (e.code) {
						case e.AUTHENTICATE_MISMATCH:
							plus.nativeUI.toast('指纹匹配失败，请重试');
							that.fingerclassFalse = true;
							break;
						case e.AUTHENTICATE_OVERLIMIT:
							plus.nativeUI.alert('指纹识别失败次数超出限制，请使用密码登录');
							service.deletFinger();
							that.fingerShow = false;
							break;
						default:
							break;
					}
				}
			);
		}
	},
	watch: {
		fingerclassTrue(newValue, oldValue) {
			var that = this;
			setTimeout(function() {
				that.fingerclassTrue = false;
			}, 300);
		},
		fingerclassFalse(newValue, oldValue) {
			var that = this;
			setTimeout(function() {
				that.fingerclassFalse = false;
			}, 300);
		}
	},
	computed: {
		SwitchChecked() {
			//console.log(this.Switch.SwitchCheck)
			return this.Switch.SwitchCheck;
		},
		...mapState(['diskrouter'])
	},
	destroyed() {
		plus.fingerprint.cancel();
	},
	methods: {
		BindPhone(){
			
		},
		ApplyDisk(){
			const data={
				token:this.token,
				msg:this.msg
			}
			disk.applyDisk(data)
			.then(response => {
				var [error, res] = response;
				var msg = res.data.data;
				if (res.data.type == 'error') {
					plus.nativeUI.toast(msg);
				} else if (res.data.type == 'success') {
					plus.nativeUI.toast(msg);
					if(msg=='云盘创建成功，请设置独立密码'){
						this.type = 'SetPw';
					}
				}
			})
			.catch(response => {
				plus.nativeUI.toast('服务器异常');
				//console.log(response)
			});
		},
		LoginSuccess() {
			var data = {
				token: this.token,
				password: this.password
			};
			if(this.fingercanUse){
				disk.getPraviteDiskData(data)
					.then(response => {
						let [error, res] = response;
						var msg = res.data.data;
						if (res.data.type == 'error') {
							plus.nativeUI.toast(msg);
							service.deletFinger();
							this.fingerShow=false
						} else if (res.data.type == 'success') {
							plus.nativeUI.toast('登录成功');
							//console.log(res.data)
							this.$store.commit('DiskRouter',msg)
							this.$emit('diaShow', false);
							uni.navigateTo({
								url: '../prvdisk/prvdisk',
								animationType: 'pop-in',
								animationDuration: 200
							});
						}
					})
					.catch(response => {
						plus.nativeUI.toast('服务器异常');
					});
			}else{
				this.$emit('diaShow', false);
				uni.navigateTo({
					url: '../prvdisk/prvdisk',
					animationType: 'pop-in',
					animationDuration: 200
				});
			}
		},
		SetPw() {
			if (this.password.length != 6) {
				plus.nativeUI.toast('请设置6位独立密码');
				return;
			}
			if (this.password != this.passwordcheck) {
				plus.nativeUI.toast('两次输入不一致');
				return;
			}
			const data = {
				token: this.token,
				type: 'setpw',
				password: this.password
			};
			disk.setDiskPw(data)
				.then(response => {
					var [error, res] = response;
					var msg = res.data.data;
					if (res.data.type == 'error') {
						plus.nativeUI.toast(msg);
					} else if (res.data.type == 'success') {
						plus.nativeUI.toast('密码设置成功，请登录云盘');
						this.type = 'CheckPw';
					}
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
					//console.log(response)
				});
		},
		OpenFinger(val) {
			let that = this;
			this.Switch.SwitchCheck = !this.Switch.SwitchCheck;
			if (val.detail.value) {
				if (!plus.fingerprint) {
					plus.nativeUI.toast('当前环境不支持指纹识别，请更新到最新版本');
					that.$nextTick(() => {
						this.Switch.SwitchCheck = false;
					});
					this.Switch.FingerSwitch = true;
					return;
				}
				if (!plus.fingerprint.isSupport()) {
					plus.nativeUI.toast('该设备不支持指纹识别');
					that.$nextTick(() => {
						this.Switch.SwitchCheck = false;
					});
					this.Switch.FingerSwitch = true;
					return;
				}
				if (!plus.fingerprint.isKeyguardSecure()) {
					plus.nativeUI.toast('未设置锁屏密码无法使用指纹识别');
					that.$nextTick(() => {
						this.Switch.SwitchCheck = false;
					});
					this.Switch.FingerSwitch = true;
					return;
				}
				if (!plus.fingerprint.isEnrolledFingerprints()) {
					plus.nativeUI.toast('未录入指纹无法使用指纹识别');
					that.$nextTick(() => {
						this.Switch.SwitchCheck = false;
					});
					this.Switch.FingerSwitch = true;
					return;
				}
			}
			this.Switch.SwitchCheck = true;
		},
		FingerCanUse() {
			if (!plus.fingerprint) {
				plus.nativeUI.toast('当前环境不支持指纹识别，请更新到最新版本');
				return false;
			}
			if (!plus.fingerprint.isSupport()) {
				plus.nativeUI.toast('该设备不支持指纹识别');
				return false;
			}
			if (!plus.fingerprint.isKeyguardSecure()) {
				plus.nativeUI.toast('未设置锁屏密码无法使用指纹识别');
				return false;
			}
			if (!plus.fingerprint.isEnrolledFingerprints()) {
				plus.nativeUI.toast('未录入指纹无法使用指纹识别');
				return false;
			}
			return true;
		},
		LoginInDisk() {
			var data = {
				token: this.token,
				password: this.password
			};
			if (this.password.length == 0) {
				plus.nativeUI.toast('请输入独立密码');
				return;
			}
			disk.getPraviteDiskData(data)
				.then(response => {
					let [error, res] = response;
					var msg = res.data.data;
					if (res.data.type == 'error') {
						plus.nativeUI.toast(msg);
					} else if (res.data.type == 'success') {
						plus.nativeUI.toast('登录成功');
						if (this.SwitchChecked) {
							const setfingerdata = {
								finger: true,
								diskpw: this.password
							};
							service.setFinger(setfingerdata);
						}
						this.$store.commit('DiskRouter',msg)
						this.LoginSuccess()
					}
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
					console.log(response);
				});
		},
		CheckDiskStatus() {
			const data = {
				token: this.token
			};
			disk.getDiskStatus(data)
				.then(response => {
					var [error, res] = response;
					//console.log(res)
					var msg = res.data.data;
					var dataBack = JSON.stringify(res.data);
					if (res.data.type == 'error') {
						plus.nativeUI.toast(msg);
						setTimeout(() => {
							this.$emit('diaShow', false);
						}, 320);
					} else if (res.data.type == 'success') {
						this.type = 'CheckPw';
					} else if (res.data.type == 'warning') {
						this.type = 'SetPw';
					} else if (res.data.type == 'fail') {
						this.type = 'CreatDisk';
						service.deletFinger();
						this.password=''
					}else if (res.data.type == 'unbind') {
						this.type = 'unbind';
						this.password=''
					}
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
					//console.log(response)
				});
		}
	}
};
</script>

<style lang="less" scoped>
.prvdisk-login-view {
	width: 600rpx;
	.fingerTrue {
		color: green;
	}
	.fingerFalse {
		color: red;
		animation: fingerHandle .3s ease infinite both;
	}
	.finger-normol {
		color: #aaaaaa;
	}
	@keyframes fingerHandle {
		0% {
			transform: none;
		}
		70% {
			transform: scale3d(0.8, 0.8, 0.8);
		}
		100% {
			transform: none;
		}
	}
	.open-finger {
		padding-left: 90rpx;
		font-size: 12px;
		color: #666666;
		height: 32px;
		line-height: 32px;
	}
	.finger-color{
		color: #777777;
	}
	.finger {
		width: 100%;
		text-align: center;
		font-size: 12px;
		.icon-denglu {
			//color: #007aff;
			font-size: 120rpx;
		}
	}
	.btn-class {
		width: 80px;
		height: auto;
		margin: 0 auto;
		margin-top: 15px;
		border: none;
		border-radius: 20px;
		.btn {
			line-height: 30px !important;
			height: 30px;
			font-size: 12px;
			font-weight: bold;
			color: #666666;
			border-radius: 20px;
			&:after {
				display: none;
			}
		}
	}
	.input-group {
		margin-top: 0;
	}
	.music-btn {
		display: inline-block;
		width: 100%;
		padding: 0 20%;
	}
	/deep/.login-input {
		width: 80%;
		margin: 0px auto;
		height: 35px;
		border: #ffffff 1px solid;
		margin-bottom: 15px;
		border-radius: 50px;
		background-color: rgba(0, 0, 0, 0.5);
		/deep/.m-input-view {
			//background-color: #4CD964;
			//height: 40px;
		}
	}
}
</style>
