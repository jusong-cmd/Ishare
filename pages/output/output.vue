<template>
	<view class="page">
		<view class="feedback-title"><text>发布类型（必选）</text></view>
		<view class="feedback-body" style="position: relative;">
			<picker @change="bindPickerChange" :value="index" :range="typeList" class="feedback-input">
				<view class="uni-inputlable">{{ typeList[index] ? typeList[index] : '无数据' }}</view>
				<text class="icon select-icon">&#xe886;</text>
			</picker>
		</view>
		<view class="feedback-body">
			<input placeholder="请输入物品标题（必填）" :maxlength="64" style="border-bottom:1px solid #F1F1F3;border-top:1px solid #F1F1F3;font-size: 28rpx;color: #8f8f94;margin-top: 20rpx;" v-model="sendDate.title" class="feedback-input" />
		</view>
		<view class="feedback-body">
			<textarea
				placeholder="请输入物品描述（必填）"
				:maxlength="256"
				style="border-bottom:1px solid #F1F1F3;font-size: 28rpx;color: #8f8f94;"
				v-model="sendDate.content"
				class="feedback-textare"
			/>
		</view>
		<choose :count="count" :visible.sync="clear" @changes="fileChange"></choose>
		<compress ref="compress" :maxwh="maxwh" :quality="quality"></compress>
		<view class="swiper-list">
			<view class="uni-list-cell uni-list-cell-pd feedback-title" style="border-bottom:1px solid #F1F1F3;border-top:1px solid #F1F1F3;">
				<view class="uni-list-cell-db ">图片是否压缩</view>
				<switch :checked="isYasuo" @change="changeIndicatorDots" />
			</view>
		</view>
		<view style="width: 100%;text-align: center;">
			<view v-show="!videoSrc" style="text-align: center;width: 100%;color: #8f8f94;font-size: 14px;" @click="takeVideo()">
				<text class="icon" style="font-size: 120rpx;">&#xe633;</text>
				<br />
				<text>录制10秒视频介绍（可选）</text>
			</view>
			<view v-show="videoSrc">
				<video :src="videoSrc" id="myVideo" autoplay loop show-mute-btn direction="-90" style="width: 700rpx;height: 394rpx;margin: 0 auto;">
					<cover-view @click.stop="deleteVideo()" class="close-view2">
						x
					</cover-view>
				</video>
			</view>
		</view>
		<!-- <view class="feedback-title feedback-star-view">
			<text>插件评分</text>
			<view class="feedback-star-view">
				<text class="feedback-star" v-for="(value, key) in stars" :key="key" :class="key < sendDate.score ? 'active' : ''" @tap="chooseStar(value)"></text>
			</view>
		</view> -->
		<button type="primary" class="feedback-submit" @click="send()">立即发布</button>
		<uni-popup ref="popup" :maskClick="false" :animation="false">
			<view style="width: 525rpx;height: 300rpx;background-color: #f8f8f8;border-radius: 10px;text-align: center;">
				<image src="../../static/loading2.gif" style="width: 280rpx;height: 210rpx;"></image>
				<br />
				<text style="color: #666666;">{{ imgList.length ? uploadindex : 0 }}/{{ fileLength }}&nbsp;&nbsp;&nbsp;{{ progress + '%' }}</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-ui/uni-popup/uni-popup';
import { OutPut } from '@/api/output.js';
import api from '@/api/api.js';
import choose from '@/components/image/choose';
import compress from '@/components/image/compress';
export default {
	components: {
		choose,
		compress,
		uniPopup
	},
	data() {
		return {
			index:0,
			clear: false,
			isYasuo: true,
			maxwh: 1080,
			quality: 1,
			token: '',
			typeList:['电子产品','日常用品','寻求帮助','失物招领','我要吐槽','校园交友'],
			typeList2:['Electronics','Daliyuse','Gethelp','Lostfound','MakeComplain','Friend'],
			fileLength: 0,
			videoSrc: null,
			progress: 0,
			uploadindex: 1,
			account: '',
			stars: [1, 2, 3, 4, 5],
			imgList: [],
			sendDate: {
				content: '',
				title: ''
			}
		};
	},
	onLoad() {
		const app = getApp();
		this.account = app.globalData.account;
		this.token = app.globalData.token;
	},
	onReady() {
		//this.$refs.popup.open();
		this.videoContext = uni.createVideoContext('myVideo', this);
	},
	computed: {
		count() {
			return 6 - this.imgList.length;
		}
	},
	watch: {
		progress(newValue, oldValue) {
			if (newValue < oldValue) {
				this.uploadindex++;
			}
		}
	},
	methods: {
		deleteVideo(){
			this.videoContext.stop();
			this.videoSrc = null;
		},
		bindPickerChange(e) {
			this.index = e.target.value;
			this.sendDate.type = this.typeList2[this.index];
		},
		videoErrorCallback: function(e) {
			console.log('视频错误信息:');
			console.log(e.target.errMsg);
		},
		compressImg(e) {
			console.log(e);
		},
		takeVideo() {
			var self = this;
			uni.chooseVideo({
				count: 1,
				maxDuration: 10,
				sourceType: ['camera'],
				success: function(res) {
					self.videoSrc = res.tempFilePath;
				}
			});
		},
		changeIndicatorDots(e) {
			this.isYasuo = !this.isYasuo;
		},
		openLoading() {
			this.$refs.popup.open();
		},
		fileChange(e) {
			this.imgList = e;
		},
		chooseStar(e) {
			//点击评星
			this.sendDate.score = e;
		},
		checkData(){
			//console.log(this.sendDate)
			if(!this.sendDate.title||!this.sendDate.content){
				uni.showToast({title: '标题和内容不能为空!',position: 'bottom'});
				return false
			}
			if(!this.sendDate.title.length>64){
				uni.showToast({title: '标题过长!',position: 'bottom'});
				return false
			}
			if(!this.sendDate.content.length>256){
				uni.showToast({title: '内容过长!',position: 'bottom'});
				return false
			}
			if(!this.sendDate.type){
				uni.showToast({title: '请选择发布类型!',position: 'bottom'});
				return false
			}
			return true
		},
		send() {
			var _this = this;
			this.sendDate.type=this.typeList2[this.index]
			if(!this.checkData()){
				return
			}
			this.fileLength = 0;
			this.uploadindex = 1;
			uni.showLoading({ title: '处理中...', mask: true });
			function requst(imgs, data) {
				uni.hideLoading();
				if (_this.videoSrc) {
					imgs.push({ uri: _this.videoSrc, name: 'video' });
					_this.videoContext.stop();
					_this.videoSrc = null;
				}
				_this.fileLength = imgs.length;
				//console.log(JSON.stringify(imgs));
				data.token = _this.token;
				if (_this.fileLength > 0) {
					_this.openLoading();
					var uploadTask = uni.uploadFile({
						url: api.OutPut, //仅为示例，并非真实接口地址。
						files: imgs,
						formData: data,
						success: uploadFileRes => {
							if (uploadFileRes.statusCode === 200) {
								uni.showToast({title: '发布成功!',position: 'bottom'});
								_this.clear = true;
								_this.imgList = [];
								_this.sendDate = {
									title: '',
									content: '',
									type: ''
								};
							}
							_this.$refs.popup.close();
						},
						fail: res => {
							_this.$refs.popup.close();
						}
					});
					uploadTask.onProgressUpdate(res => {
						_this.progress = res.progress;
						if (res.progress >= 100) {
						}
					});
				} else {
					uni.showLoading({ title: '发布中...', mask: true });
					OutPut(data)
						.then(response => {
							uni.hideLoading();
							let [error, res] = response;
							console.log(res)
							var msg = res.data.data;
							if (res.data.type == 'error') {
								plus.nativeUI.toast(msg);
							} else if (res.data.type == 'success') {
								_this.sendDate={
									title: '',
									content: '',
									type: ''
								}
								plus.nativeUI.toast('发布成功！');
							}
						})
						.catch(response => {
							plus.nativeUI.toast('服务器异常');
							uni.hideLoading();
						});
				}
			}

			if (this.isYasuo) {
				if (_this.imgList.length == 0) {
					requst([], this.sendDate);
				} else {
					this.$refs.compress.yasuoImg(_this.imgList).then(e => {
						//console.log(JSON.stringify(e))
						let imgs = e.map((value, index) => {
							return {
								name: 'image' + index,
								uri: value.tempFilePath
							};
						});
						requst(imgs, this.sendDate);
					});
				}
			} else {
				if (_this.imgList.length == 0) {
					requst([], this.sendDate);
				} else {
					let imgs = _this.imgList.map((value, index) => {
						return {
							name: 'image' + index,
							uri: value
						};
					});
					requst(imgs, _this.sendDate);
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../common/uni.css';
.page {
	background-color: #FFFFFF;
	width: 100%;
}
.close-view2 {
	text-align: center;
	line-height: 20px;
	height: 24px;
	width: 24px;
	border-radius: 50%;
	background: #ff5053;
	color: #ffffff;
	position: absolute;
	top: 2px;
	right: 2px;
	font-size: 12px;
}
/deep/.uni-popup__wrapper-box {
	border-radius: 10px;
	padding: 0 !important;
	background-color: rgba(255, 255, 255, 0) !important;
}
.input-view {
	font-size: 28upx;
}
.select-icon{
	position: absolute;
	right: 20rpx;
	top:0;
	color: #8f8f94;
	font-size: 32rpx;
	line-height: 78rpx;
}
.uni-inputlable{
	font-size: 28upx;
	border: 1px solid #F1F1F3;
	border-radius: 5px;
	color:#8f8f94 ;
}
.close-view {
	text-align: center;
	line-height: 14px;
	height: 16px;
	width: 16px;
	border-radius: 50%;
	background: #ff5053;
	color: #ffffff;
	position: absolute;
	top: -6px;
	right: -4px;
	font-size: 12px;
}
</style>
