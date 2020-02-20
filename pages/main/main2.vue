<template>
	<view class="content" :style="{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover' }" @touchstart="starttouch" @touchend="endtouch">
		<scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
			<view v-for="(tab, index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
				<text class="uni-tab-item-title" :class="tabIndex == index ? 'uni-tab-item-title-active' : ''">{{ tab.name }}</text>
			</view>
		</scroll-view>
		<view class="line-h"></view>
		<swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="ontabchange">
			<swiper-item class="swiper-item" v-for="(tab, index1) in newsList" :key="index1">
				<list class="scroll-v list" enableBackToTop="true" scroll-y loadmoreoffset="15" @loadmore="loadMore(index1)">
					<refresh class="refresh" @refresh="onrefresh(index1)" @pullingdown="onpullingdown" :display="tab.refreshing ? 'show' : 'hide'">
						<div class="refresh-view">
							<image
								class="refresh-icon"
								:src="refreshIcon"
								:style="{ width: tab.refreshing || pulling ? 0 : '30px' }"
								:class="{ 'refresh-icon-active': tab.refreshFlag }"
							></image>
							<loading-indicator class="loading-icon" animating="true" v-if="tab.refreshing"></loading-indicator>
							<text class="loading-text">{{ tab.refreshText }}</text>
						</div>
					</refresh>
					<cell v-for="(newsitem, index2) in tab.data" :key="newsitem.id">
						<media-item :options="newsitem" @close="close(index1, index2)" @click="goDetail(newsitem)"></media-item>
					</cell>
					<cell class="loading-more" v-if="tab.isLoading || tab.data.length > 4">
						<text class="loading-more-text">{{ tab.loadingText }}</text>
					</cell>
				</list>
			</swiper-item>
		</swiper>
		<uni-drawer :visible="drawer" @close="close()">
			<!-- <view class="status_bar"></view> -->
			<view style="padding:0rpx;"><view class="uni-title">抽屉式导航</view></view>
		</uni-drawer>
		<!-- <div style="width: 100%; height: 300px;" id="chart"></div> -->
		<!-- <button @click="JumptoChat()">聊天室</button>
		<button @click="JumptoOutput()">发布</button>
		<button @click="qqLogin()">清除登录</button>
		<navigator url="../upload/upload">上传文件</navigator>
		<button @click="getqqLogin()">获取QQ信息</button>
		<button @click="open()">私人云盘</button> -->
		<uni-popup ref="popup" @change="closeDia2()" class="finger-view"><openfinger :token="token" @diaShow="closeDia()" v-if="popupStatus"></openfinger></uni-popup>
		<!-- <outPut class="output-view"></outPut> -->
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import uniPopup from '@/components/uni-ui/uni-popup/uni-popup';
import openfinger from '@/components/openfinger';
import service from '@/service.js';
import socket from '@/static/js/socket.js';
import uniDrawer from '@/components/uni-ui/uni-drawer/uni-drawer.vue';
import indexBackgroundImage from '@/static/img/login.jpg';
import { mapState } from 'vuex';
import api from '@/api/api.js';
var Socket; // 缓存每页最多
const MAX_CACHE_DATA = 100;
// 缓存页签数量
const MAX_CACHE_PAGE = 3;

const newsData = {
	data0: {
		datetime: '40分钟前',
		article_type: 0,
		title: 'uni-app行业峰会频频亮相，开发者反响热烈!',
		source: 'DCloud',
		comment_count: 639
	},
	data1: {
		datetime: '一天前',
		article_type: 1,
		title: 'DCloud完成B2轮融资，uni-app震撼发布!',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90',
		source: 'DCloud',
		comment_count: 11395
	},
	data2: {
		datetime: '一天前',
		article_type: 2,
		title: '中国技术界小奇迹：HBuilder开发者突破200万',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg?imageView2/3/w/200/h/100/q/90',
		source: 'DCloud',
		comment_count: 11395
	},
	data3: {
		article_type: 3,
		image_list: [
			{
				url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90',
				width: 563,
				height: 316
			},
			{
				url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg?imageView2/3/w/200/h/100/q/90',
				width: 641,
				height: 360
			},
			{
				url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90',
				width: 640,
				height: 360
			}
		],
		datetime: '5分钟前',
		title: 'uni-app 支持使用 npm 安装第三方包，生态更趋丰富',
		source: 'DCloud',
		comment_count: 11
	},
	data4: {
		datetime: '2小时前',
		article_type: 4,
		title: 'uni-app 支持原生小程序自定义组件，更开放、更自由',
		image_url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90',
		source: 'DCloud',
		comment_count: 69
	}
};
// var echarts = require('@/static/js/echarts.min.js');
export default {
	components: { uniDrawer, uniNavBar, uniPopup, openfinger },
	data() {
		return {
			drawer: false,
			token: '',
			cacheTab: [],
			tabIndex: 0,
			showOutput: true,
			popupStatus: false,
			account: '',
			TouchX: null,
			BackgroundImage: indexBackgroundImage,
			backButtonPress: 0,
			newsList: [],
			tabBars: [
				{
					name: '关注',
					id: 'guanzhu'
				},
				{
					name: '推荐',
					id: 'tuijian'
				},
				{
					name: '体育',
					id: 'tiyu'
				},
				{
					name: '热点',
					id: 'redian'
				}
			],
			scrollInto: '',
			showTips: false,
			navigateFlag: false,
			pulling: false,
		};
	},
	onNavigationBarButtonTap(val) {
		if (val.index == 0) {
			this.drawer = !this.drawer;
		}
	},
	onBackPress(options) {
		if (this.drawer) {
			this.drawer = false;
			return true;
		}
		this.backButtonPress++;
		let _this = this;
		if (this.backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出应用');
		}
		setTimeout(function() {
			_this.backButtonPress = 0;
		}, 1000);
		return true;
	},
	// computed: {
	// 	showOutput() {
	// 		return getApp().globalData.showOutput
	// 	}
	// },
	onLoad: function(option) {},
	onUnload() {
		console.log('hahahah');
	},
	methods: {
		getList(index) {
			let activeTab = this.newsList[index];
			let list = [];
			for (let i = 1; i <= 10; i++) {
				let item = Object.assign({}, newsData['data' + Math.floor(Math.random() * 5)]);
				item.id = this.newGuid();
				list.push(item);
			}
			activeTab.data = activeTab.data.concat(list);
		},
		goDetail(e) {
			if (this.navigateFlag) {
				return;
			}
			this.navigateFlag = true;
			uni.navigateTo({
				url: './detail/detail?title=' + e.title
			});
			setTimeout(() => {
				this.navigateFlag = false;
			}, 200);
		},
		close(index1, index2) {
			uni.showModal({
				content: '是否删除本条信息？',
				success: res => {
					if (res.confirm) {
						this.newsList[index1].data.splice(index2, 1);
					}
				}
			});
		},
		loadMore(e) {
			setTimeout(() => {
				this.getList(this.tabIndex);
			}, 500);
		},
		ontabtap(e) {
			let index = e.target.dataset.current || e.currentTarget.dataset.current;
			this.switchTab(index);
		},
		ontabchange(e) {
			let index = e.target.current || e.detail.current;
			this.switchTab(index);
		},
		switchTab(index) {
			if (this.newsList[index].data.length === 0) {
				this.getList(index);
			}

			if (this.tabIndex === index) {
				return;
			}

			// 缓存 tabId
			if (this.newsList[this.tabIndex].data.length > MAX_CACHE_DATA) {
				let isExist = this.cacheTab.indexOf(this.tabIndex);
				if (isExist < 0) {
					this.cacheTab.push(this.tabIndex);
					//console.log("cache index:: " + this.tabIndex);
				}
			}

			this.tabIndex = index;
			this.scrollInto = this.tabBars[index].id;

			// 释放 tabId
			if (this.cacheTab.length > MAX_CACHE_PAGE) {
				let cacheIndex = this.cacheTab[0];
				this.clearTabData(cacheIndex);
				this.cacheTab.splice(0, 1);
				//console.log("remove cache index:: " + cacheIndex);
			}
		},
		clearTabData(e) {
			this.newsList[e].data.length = 0;
			this.newsList[e].loadingText = '加载更多...';
		},
		refreshData() {},
		onrefresh(e) {
			var tab = this.newsList[this.tabIndex];
			if (!tab.refreshFlag) {
				return;
			}
			tab.refreshing = true;
			tab.refreshText = '正在刷新...';

			setTimeout(() => {
				this.refreshData();
				this.pulling = true;
				tab.refreshing = false;
				tab.refreshFlag = false;
				tab.refreshText = '已刷新';
				setTimeout(() => {
					// TODO fix ios和Android 动画时间相反问题
					this.pulling = false;
				}, 500);
			}, 2000);
		},
		onpullingdown(e) {
			var tab = this.newsList[this.tabIndex];
			if (tab.refreshing || this.pulling) {
				return;
			}
			if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
				tab.refreshFlag = true;
				tab.refreshText = '释放立即刷新';
			} else {
				tab.refreshFlag = false;
				tab.refreshText = '下拉可以刷新';
			}
		},
		newGuid() {
			let s4 = function() {
				return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
			};
			return (s4() + s4() + '-' + s4() + '-4' + s4().substr(0, 3) + '-' + s4() + '-' + s4() + s4() + s4()).toUpperCase();
		},
		starttouch(e) {
			this.TouchX = e.touches[0].pageX;
		},
		close() {
			this.drawer = false;
		},
		closeDia(val) {
			this.$refs.popup.close();
			setTimeout(() => {
				this.popupStatus = false;
			}, 320);
		},
		closeDia2(val) {
			if (val.show == false) {
				setTimeout(() => {
					this.popupStatus = false;
				}, 320);
			} else {
				this.popupStatus = val.show;
			}
		},
		endtouch(e) {
			if (e.changedTouches[0].pageX - this.TouchX >= 50 && !this.popupStatus) {
				this.drawer = true;
				//console.log('打开抽屉')
			}
			this.TouchX = 0;
		},
		open() {
			// 需要在 popup 组件，指定 ref 为 popup
			this.popupStatus = true;
			this.$refs.popup.open();
		},
		JumptoComDisk() {
			uni.navigateTo({
				url: '../comdisk/comdisk',
				animationType: 'pop-in',
				animationDuration: 200
			});
		},
		JumptoOutput() {
			uni.navigateTo({
				url: '../output/output',
				animationType: 'pop-in',
				animationDuration: 200
			});
		},
		qqLogin() {
			service.deletFinger();
			service.deletUser();
		},
		getqqLogin() {
			uni.getUserInfo({
				provider: 'qq',
				success: function(infoRes) {
					console.log(infoRes);
				}
			});
		},
		JumptoChat() {
			uni.navigateTo({
				url: '../chat/HM-chat',
				animationType: 'pop-in',
				animationDuration: 200
			});
		}
	},
	onShow() {
		uni.hideLoading();
		const app = getApp();
		this.account = app.globalData.account;
		this.token = app.globalData.token;
	}
};
</script>

<style lang="less" scoped>
// /deep/.uni-drawer__mask {
// 	width: 0%;
// }
.finger-view {
	/deep/.uni-popup__wrapper-box {
		border-radius: 10px;
		padding: 20px 0 !important;
	}
	/deep/.uni-drawer__content {
		background-color: #fafafa;
	}
}
.output-view {
	/deep/.uni-popup__wrapper-box {
		border-radius: 0 !important;
		background-color: rgba(255, 255, 255, 0) !important;
		padding: 0 !important;
	}
	/deep/.uni-drawer__content {
		background-color: rgba(255, 255, 255, 0);
	}
}
.main-body {
	position: relative;
}
.hello {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.title {
	color: #8f8f94;
	margin-top: 25px;
}

.ul {
	font-size: 15px;
	color: #8f8f94;
	margin-top: 25px;
}
page {
	width: 100%;
	min-height: 100%;
	display: flex;
}

.tabs {
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	background-color: #ffffff;
}

.scroll-h {
	width: 750upx;
	height: 80upx;
	flex-direction: row;
	white-space: nowrap;
	/* flex-wrap: nowrap; */
	/* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */
}

.line-h {
	height: 1upx;
	background-color: #cccccc;
}

.uni-tab-item {
	display: inline-block;
	flex-wrap: nowrap;
	padding-left: 34upx;
	padding-right: 34upx;
}

.uni-tab-item-title {
	color: #555;
	font-size: 30upx;
	height: 80upx;
	line-height: 80upx;
	flex-wrap: nowrap;
	white-space: nowrap;
}

.uni-tab-item-title-active {
	color: #007aff;
}

.swiper-box {
	flex: 1;
}

.swiper-item {
	flex: 1;
	flex-direction: row;
}

.scroll-v {
	flex: 1;
	width: 750upx;
}

.update-tips {
	position: absolute;
	left: 0;
	top: 41px;
	right: 0;
	padding-top: 5px;
	padding-bottom: 5px;
	background-color: #fddd9b;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.update-tips-text {
	font-size: 14px;
	color: #ffffff;
}

.refresh {
	width: 750upx;
	height: 64px;
	justify-content: center;
}

.refresh-view {
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: center;
}

.refresh-icon {
	width: 30px;
	height: 30px;
	transition-duration: 0.5s;
	transition-property: transform;
	transform: rotate(0deg);
	transform-origin: 15px 15px;
}

.refresh-icon-active {
	transform: rotate(180deg);
}

.loading-icon {
	width: 20px;
	height: 20px;
	margin-right: 5px;
	color: #999999;
}

.loading-text {
	margin-left: 2px;
	font-size: 16px;
	color: #999999;
}

.loading-more {
	align-items: center;
	justify-content: center;
	padding-top: 10px;
	padding-bottom: 10px;
	text-align: center;
}

.loading-more-text {
	font-size: 28upx;
	color: #999;
}
.ul > view {
	line-height: 25px;
}
</style>
