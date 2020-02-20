<template>
	<view class="userinfo-view">
		<view class="header-view">
			<view class="header-image">
				<avatar
					selWidth="200px"
					selHeight="400upx"
					expHeight="200px"
					expWidth="200px"
					quality="0.7"
					@upload="myUpload"
					inner="true"
					canRotate="false"
					:avatarSrc="userInfo.headurl || '../../static/img/noheader.png'"
					avatarStyle="width: 140rpx;height: 140rpx;border-radius: 50%;"
				></avatar>
				<!-- <image :src="userInfo.headurl || '../../static/img/noheader.png'" style="width: 140rpx;height: 140rpx;border-radius: 50%;border: 1upx solid #FFFFFF;"></image> -->
			</view>
			<text style="text-align: center;font-size: 14px;color: #FFFFFF;font-weight: bold;margin-top: 10upx;">{{ userInfo.name }}</text>
			<view class="tags-view">
				<div class="tags-item" v-if="userInfo.tags == null" style="background-color: #d7422c;"><text class="tags-text">未认证</text></div>
				<div class="tags-item" v-if="userInfo.tags != null" v-for="(item, index) in userInfo.tags" :key="index">
					<text class="tags-text">{{ item }}</text>
				</div>
			</view>
		</view>
		<view class="list-view">
			<uni-list>
				<uni-list-item :show-extra-icon="false" :showArrow="true" v-for="(item, index) in ContralList" :title="item.name" :thumb="item.img" :key="index" @click="GoToPage(item.url)"/>
			</uni-list>
			<view class="buttom-view"><button type="warn" class="button-view" @click="clearLogin()">注销登录</button></view>
		</view>
	</view>
</template>

<script>
import avatar from '@/components/yq-avatar/yq-avatar';
import uniList from '@/components/uni-ui/uni-list/uni-list';
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item';
import { getUserInfo } from '@/api/getpage.js';
import api from '@/api/api.js';
import service from '@/service.js';
export default {
	components: { uniList, uniListItem, avatar },
	data() {
		return {
			token: null,
			account: null,
			userInfo: {},
			ContralList: [
				{
					name: '我的认证',
					img: '../../static/img/video.png',
					url:'../bindstatus/bindstatus'
				},
				{
					name: '个人资料',
					img: '../../static/img/video.png',
					url:'../chat/HM-chat'
				},
				{
					name: '修改密码',
					img: '../../static/img/video.png'
				},
				{
					name: '个性主题',
					img: '../../static/img/video.png'
				}
			]
		};
	},
	onLoad() {
		const app = getApp();
		this.account = app.globalData.account;
		this.token = app.globalData.token;
		getUserInfo({ token: this.token }).then(res => {
			if (res.data.type == 'success') {
				this.userInfo = res.data.data;
			}
		});
	},
	methods: {
		GoToPage(url){
			uni.navigateTo({
				url: url,
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		clearLogin(){
			service.deletFinger();
			service.deletUser();
			uni.reLaunch({
				url: '../login/login',
				animationType: 'pop-in',
				animationDuration: 200
			});
		},
		myUpload(rsp) {
			const data={
				token:this.token
			} 
			var uploadTask = uni.uploadFile({
				url: api.sendHeader, 
				filePath:rsp.path,
				name:'file',
				formData: data,
				success: uploadFileRes => {
					let res=JSON.parse(uploadFileRes.data)
					if(res.type=='success'){
						this.userInfo.headurl = rsp.path;
					}
					plus.nativeUI.toast(res.data)
				},
				fail: res => {
					console.log(res)
				}
			});
			uploadTask.onProgressUpdate(res => {
				
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.userinfo-view {
	width: 100%;
	.list-view {
		display: flex;
		flex-direction: column;
		.buttom-view {
			display: flex;
			position: absolute;
			bottom: 0;
			width: 750rpx;
			height: 50px;
			.button-view {
				height: 30px;
				margin: 10px auto;
				width: 200upx;
				padding: 0;
				font-size: 14px;
				line-height: 30px;
				vertical-align: top;
				border-radius: 20px;
			}
		}
	}
	.header-view {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 452rpx;
		background-image: linear-gradient(to right, #ff5673, #ff3add);
		.header-image {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: stretch;
			margin-top: 150rpx;
			width: 100%;
			height: 140upx;
		}
		.tags-view {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: stretch;
			margin-top: 10rpx;
			height: 18px;
			width: 100%;
			.tags-item {
				height: 16px;
				width: 100upx;
				margin-right: 20upx;
				flex-direction: column;
				align-items: stretch;
				border-radius: 5px;
				background-color: #42b983;
				border: 1px solid #ffffff;
				&:last-child {
					margin-right: 0upx;
				}
				.tags-text {
					display: inline-block;
					color: #ffffff;
					width: 100upx;
					text-align: center;
					line-height: 14px;
					vertical-align: top;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
