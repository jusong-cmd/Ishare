<template>
	<view class="bindstatus-view">
		<view class="phone-check">
			<view class="comment-view">
				<text class="icon font-view inner">&#xe647;</text>
				<text style="text-align: center;font-size: 14px;color: #FFFFFF;font-weight: bold;">手机认证</text>
			</view>
			<view class="comment-view center-view" style="margin-left: 60rpx;width: 340rpx;">
				<text class="font-item-view">{{bindData.bindphone?'已绑定':'未绑定'}}</text>
				<text v-if="bindData.bindphone" class="font-item-view">绑定手机：{{bindData.phone}}</text>
				<text v-if="!bindData.bindphone" class="font-item-view" @click.stop="gotobind('phone')">立即绑定&nbsp;></text>
			</view>
		</view>
		<view class="student-check">
			<view class="comment-view">
				<text class="icon font-view" style="line-height: 140rpx;">&#xe604;</text>
				<text style="text-align: center;font-size: 14px;color: #FFFFFF;font-weight: bold;">本校认证</text>
			</view>
			<view class="comment-view center-view" style="margin-left: 60rpx;width: 340rpx;">
				<text v-if="bindData.bindstudent" class="font-item-view">已认证:{{bindData.stuname}}</text>
				<view v-if="bindData.bindstudent" class="image-view-info">
				<image  :src="bindData.schoolcard" style="width: 316rpx;height: 200rpx;border-radius: 5px;border: 1px solid #FFFFFF;"></image>
				</view>
				<text v-if="!bindData.bindstudent" class="font-item-view">未认证</text>
				<avatar
					v-if="!bindData.bindstudent"
					selWidth="316px"
					selHeight="200px"
					expHeight="400px"
					expWidth="632px"
					quality="0.9"
					@upload="confirm"
					inner="true"
					canRotate="false"
					:avatarSrc="studentCard || '../../static/img/student.jpg'"
					avatarStyle="width: 316rpx;height: 200rpx;border-radius: 5px;"
				></avatar>
				<text v-if="!bindData.bindstudent" class="font-item-view" style="font-size: 10px;">(本校认证需上传本校一卡通照片)</text>
			</view>
		</view>
		<view class="phone-check qq-img" style="margin-top: 50upx;">
			<view class="comment-view">
				<text class="icon font-view inner qq-img">&#xe605;</text>
				<text style="text-align: center;font-size: 14px;color: #FFFFFF;font-weight: bold;">QQ绑定</text>
			</view>
			<view class="comment-view center-view" style="margin-left: 60rpx;width: 340rpx;">
				<view v-if="bindData.bindqq" class="image-view-info">
					<image :src="bindData.qqheader" style="width: 110rpx;height: 110rpx;border: 1px solid #FFFFFF;border-radius: 50%;"></image>
				</view>
				<text class="font-item-view">{{bindData.bindqq?'已绑定：'+bindData.qqname:'未绑定'}}</text>
				<text v-if="!bindData.bindqq" class="font-item-view" @click.stop="gotobind('QQ')">立即绑定&nbsp;></text>
				<text v-if="!bindData.bindqq" class="font-item-view" style="font-size: 10px;">(绑定QQ后可以使用QQ快捷登录)</text>
				<text v-if="bindData.bindqq" class="font-item-view" style="font-size: 10px;">(可以使用QQ快捷登录)</text>
			</view>
		</view>
		<!-- <view class="phone-check disk-img" style="margin-top: 50upx;">
			<view class="comment-view">
				<text class="icon font-view inner disk-img">&#xe781;</text>
				<text style="text-align: center;font-size: 14px;color: #FFFFFF;font-weight: bold;">个人云盘</text>
			</view>
			<view class="comment-view center-view" style="margin-left: 60rpx;width: 340rpx;">
				<text class="font-item-view">{{bindData.disk?'可用':'不可用'}}</text>
				<text v-if="!bindData.disk" class="font-item-view" @click.stop="gotobind('disk')">立即申请&nbsp;></text>
				<text v-if="!bindData.disk" class="font-item-view" style="font-size: 10px;">(个人云盘可以快速存取文件)</text>
			</view>
		</view> -->
	</view>
</template>

<script>
import avatar from '@/components/yq-avatar/yq-avatar';
import { sendStudentImg, getBindStatus } from '@/api/getpage.js';
export default {
	components: { avatar },
	data() {
		return {
			studentCard: null,
			tempFilePath: null,
			bindData: {},
			token: '',
			account: ''
		};
	},
	onLoad() {
		const app = getApp();
		this.account = app.globalData.account;
		this.token = app.globalData.token;
		//this.getBindData();
	},
	onShow() {
		this.getBindData();
	},
	methods: {
		gotobind(type){
			uni.navigateTo({
				url: '../bind/bind?type=' + type
			});
		},
		confirm(rsp) {
			var that = this;
			plus.io.resolveLocalFileSystemURL(rsp.path, function(entry) {
				entry.file(
					function(file1) {
						var reader = new plus.io.FileReader();
						reader.readAsDataURL(file1, 'utf-8');
						reader.onload = function(evt) {
							that.studentCard = evt.target.result;
							that.tempFilePath = evt.target.result.replace('data:image/jpeg;base64,', '');
							sendStudentImg({ image: that.tempFilePath, token: that.token }).then(res => {
								if (res.data.type == 'success') {
									plus.nativeUI.toast('认证成功');
									that.getBindData();
								} else {
									plus.nativeUI.toast(res.data.data);
								}
							});
						};
					},
					function(e) {
						console.log(e);
					}
				);
			});
		},
		getBindData() {
			getBindStatus({ token: this.token }).then(res => {
				if (res.data.type == 'success') {
					this.bindData = res.data.data;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f4f5f6;
	height: 100%;
	font-size: 28upx;
	//line-height: 1.8;
}
.image-view-info{
	display: flex;
	flex-direction: row;
	justify-content: center;
}
.qq-img{
	background-image: linear-gradient(to right, #0c62ff, #c545ff) !important;
}
.disk-img{
	background-image: linear-gradient(to right, #fa9004, #ffdd3e) !important;
}
.font-item-view {
	display: flex;
	justify-content: center;
	font-size: 14px;
	color: #ffffff;
}
.comment-view {
	display: flex;
	flex-direction: column;
	width: 250rpx;
}
.center-view {
	justify-content: center;
}
.font-view {
	display: inline-block;
	width: 150rpx;
	border-radius: 50%;
	font-size: 90rpx;
	color: #ffffff;
	text-align: center;
	border: 1px solid #ffffff;
	background-color: pink;
	margin-left: 50rpx;
	margin-top: 65rpx;
	height: 150rpx;
	background-image: linear-gradient(to right, #77bbff, #3dfcb3);
	line-height: 150rpx;
}
.inner {
	background-image: linear-gradient(to right, #ff5673, #ff3add);
}
.bindstatus-view {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 30rpx 30rpx;
	.phone-check {
		display: flex;
		height: 300rpx;
		flex-direction: row;
		box-shadow: 0px 0px 5px #666666;
		border-radius: 5px;
		width: 100%;
		background-image: linear-gradient(to right, #ff5673, #ff3add);
	}
	.student-check {
		display: flex;
		flex-direction: row;
		margin-top: 50upx;
		height: 300rpx;
		box-shadow: 0px 0px 5px #666666;
		border-radius: 5px;
		width: 100%;
		background-color: red;
		background-image: linear-gradient(to right, #77bbff, #3dfcb3);
	}
}
</style>
