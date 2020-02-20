<template>
	<view class="music-login-view">
		<view class="input-group" v-if="needlogin">
			<view class="input-row login-input" v-bind:style="{ height: 30 + 'px' }">
				<m-input class="m-input" type="text" clearable focus v-model="account" placeholder="账号"></m-input>
			</view>
			<view class="input-row login-input" v-bind:style="{ height: 30 + 'px' }"><m-input type="password" displayable v-model="password" placeholder="密码"></m-input></view>
		</view>
		<view class="music-btn">
			<view class="btn-class" v-if="needlogin"><button @click="musicLogin()">登录会员</button></view>
			<view class="btn-class"><button @click="checkLogin()">刷新登录</button></view>
			<view class="btn-class" v-if="!needlogin"><button @click="LoginOut()">退出登录</button></view>
		</view>
	</view>
</template>

<script>
import mInput from '@/components/m-input';
import music from '@/static/js/music.js';
export default {
	components: {
		mInput
	},
	data() {
		return {
			account: '',
			password: '',
			needlogin: false
		};
	},
	created() {
		this.checkLogin();
	},
	methods: {
		musicLogin() {
			const data={
				phone:this.account,
				password:this.password
			}
			music.MusicLogin(data)
				.then(response => {
					var [error, res] = response;
					if ((res.data.code == 200)) {
						this.needlogin = false;
						plus.nativeUI.toast('会员登录成功');
					}else{
						plus.nativeUI.toast('会员登录失败');
					}
					//console.log(res);
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
				});
		},
		LoginOut(){
			music.LoginOut()
				.then(response => {
					var [error, res] = response;
					if ((res.data.code == 200)) {
						this.needlogin = true;
						plus.nativeUI.toast('会员退出成功');
					}else{
						plus.nativeUI.toast('会员退出失败');
					}
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
				});
		},
		checkLogin() {
			music
				.CheckLogin()
				.then(response => {
					var [error, res] = response;
					if ((res.statusCode == 301)) {
						this.needlogin = true;
						plus.nativeUI.toast('会员需要登录');
					}else{
						if (res.data.code&&(res.data.code == 200)) {
							this.needlogin = false;
							plus.nativeUI.toast('会员已登录');
						}
					}
					//console.log(res)
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
.music-login-view {
	.input-group {
		margin-top: 0;
	}
	.music-btn {
		display: inline-block;
		width: 100%;
		padding: 0 20%;
		.btn-class {
			width: 60%;
			height: auto;
			margin-bottom: 15px;
		}
	}
	/deep/.login-input {
		width: 80%;
		margin: 0px auto;
		border: #ffffff 1px solid;
		margin-bottom: 15px;
		border-radius: 50px;
		background-color: rgb(66, 185, 131);
		/deep/.m-input-view {
			//background-color: #4CD964;
			//height: 40px;
		}
	}
}
</style>
