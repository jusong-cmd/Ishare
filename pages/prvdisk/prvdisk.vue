<template>
	<view class="content">
		<!-- <view class="status_bar"></view> -->
		<!-- <view class="notice"><uni-notice-bar show-close="true" show-icon="true" text="禁止上传任何不符合社会主义核心价值观的文件"></uni-notice-bar></view> -->
		<view class="comdisk-view">
			<uni-collapse accordion="true">
				<uni-collapse-item title="音乐" :show-animation="true" thumb="../../static/img/music.png">
					<view style="padding: 0rpx 30rpx 20rpx 30rpx;">
						<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
							<uni-swipe-action v-if="filedata.music.length > 0">
								<uni-swipe-action-item v-for="(item, index) in filedata.music" :key="index" :options="options" @click="Option(item, $event)">
									<uni-list-item :title="item" :show-arrow="false" @click="playIt(item, 'music')"></uni-list-item>
								</uni-swipe-action-item>
							</uni-swipe-action>
							<text v-if="filedata.music.length == 0" class="my-text">暂无数据</text>
						</scroll-view>
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="视频" :show-animation="true" thumb="../../static/img/video.png">
					<view style="padding: 0rpx 30rpx 20rpx 30rpx;">
						<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
							<uni-swipe-action v-if="filedata.video.length > 0">
								<uni-swipe-action-item v-for="(item, index) in filedata.video" :key="index" :options="options" @click="Option(item, $event)">
									<uni-list-item :title="item" :show-arrow="false" @click="playIt(item, 'video')"></uni-list-item>
								</uni-swipe-action-item>
							</uni-swipe-action>
							<text v-if="filedata.video.length == 0" class="my-text">暂无数据</text>
						</scroll-view>
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="图片" :show-animation="true" thumb="../../static/img/photo.png">
					<view style="padding: 0rpx 30rpx 20rpx 30rpx;">
						<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
							<uni-swipe-action v-if="filedata.photo.length > 0">
								<uni-swipe-action-item v-for="(item, index) in filedata.photo" :key="index" :options="options" @click="Option(item, $event)">
									<uni-list-item :title="item" :show-arrow="false" @click="playIt(item, 'photo')"></uni-list-item>
								</uni-swipe-action-item>
							</uni-swipe-action>
							<text v-if="filedata.photo.length == 0" class="my-text">暂无数据</text>
						</scroll-view>
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="文档" :show-animation="true" thumb="../../static/img/doc.png">
					<view style="padding: 0rpx 30rpx 20rpx 30rpx;">
						<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
							<uni-swipe-action v-if="filedata.doc.length > 0">
								<uni-swipe-action-item v-for="(item, index) in filedata.doc" :key="index" :options="options" @click="Option(item, $event)">
									<uni-list-item :title="item" :show-arrow="false" @click="playIt(item, 'doc')"></uni-list-item>
								</uni-swipe-action-item>
							</uni-swipe-action>
							<text v-if="filedata.doc.length == 0" class="my-text">暂无数据</text>
						</scroll-view>
					</view>
				</uni-collapse-item>
				<!-- <uni-collapse-item v-if="filedata.role=='admin'" title="音乐会员管理" :show-animation="true" thumb="../../static/img/admin.png">
					<view style="padding: 0rpx 30rpx 20rpx 30rpx;">
						<musiclogin></musiclogin>
					</view>
				</uni-collapse-item> -->
			</uni-collapse>
		</view>
		<uni-popup ref="popup" @change="closeDia2()">test</uni-popup>
		<uni-popup ref="popuptip" :mask-click="false">
			<view class="uni-tip">
					<text class="uni-tip-title">警告</text>
					<view v-show="type == 'delete'" class="uni-tip-content">确定从个人云盘删除文件<br>{{ checkitem }}</view>
					<view v-show="type == 'move'" class="uni-tip-content">确定移动该文件至公共云盘么？同时会删除个人云盘内的该文件<br>{{ checkitem }}</view>
					<view v-show="type == 'copy'" class="uni-tip-content">确定复制该文件至公共云盘么？不会删除个人云盘内的该文件<br>{{ checkitem }}</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click="Opreation('cancel')">取消</text>
						<text class="uni-tip-button" @click="Opreation('sure')">确定</text>
					</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import service from '@/service.js';
import socket from '@/static/js/socket.js';
import music from '@/static/js/music.js';
import disk from '@/static/js/disk.js';
import uniPopup from '@/components/uni-ui/uni-popup/uni-popup';
import { uniCollapse } from '@/components/uni-ui/uni-collapse/uni-collapse';
import { uniNoticeBar } from '@/components/uni-ui/uni-notice-bar/uni-notice-bar';
import { uniCollapseItem } from '@/components/uni-ui/uni-collapse-item/uni-collapse-item';
import uniList from '@/components/uni-ui/uni-list/uni-list';
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item';
import uniSwipeAction from '@/components/uni-ui/uni-swipe-action/uni-swipe-action';
import uniSwipeActionItem from '@/components/uni-ui/uni-swipe-action-item/uni-swipe-action-item';
import indexBackgroundImage from '@/static/img/login.jpg';
import { mapState } from 'vuex';
import api from '@/api/api.js';
var Socket;
export default {
	components: { uniPopup, uniCollapse, uniCollapseItem, uniNoticeBar, uniList, uniListItem, uniSwipeAction, uniSwipeActionItem },
	data() {
		return {
			options: [
				{
					text: '复制',
					style: {
						backgroundColor: 'green'
					}
				},
				{
					text: '移动',
					style: {
						backgroundColor: 'orange'
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: 'red'
					}
				}
			],
			drawer: false,
			popupStatus: false,
			token: '',
			account: '',
			checkitem: null,
			type: null,
			BackgroundImage: indexBackgroundImage,
			backButtonPress: 0,
			filedata: {
				music: [],
				video: [],
				photo: [],
				doc: [],
				role: ''
			}
		};
	},
	onNavigationBarButtonTap(val) {
		if (val.index == 0) {
			this.$refs.popup.open();
		}
		//console.log(val)
	},
	// onBackPress(options) {
	// 	this.backButtonPress++;
	// 	let _this = this;
	// 	if (this.backButtonPress > 1) {
	// 		plus.runtime.quit();
	// 	} else {
	// 		plus.nativeUI.toast('再按一次退出应用');
	// 	}
	// 	setTimeout(function() {
	// 		_this.backButtonPress = 0;
	// 	}, 1000);
	// 	return true;
	// },
	computed: mapState(['diskrouter', 'hasLogin', 'userName']),
	onLoad: function(option) {
		const app = getApp();
		this.account = app.globalData.account;
		this.token = app.globalData.token;
		//console.log(this.diskrouter)
		//console.log(option.name); //打印出上个页面传递的参数。
	},
	methods: {
		Opreation(type) {
			if (type == 'sure') {
				if (this.type == 'delete') {
					this.deleteIt(this.checkitem);
				} else if (this.type == 'move') {
					this.moveIt(this.checkitem)
				} else if (this.type == 'copy') {
					this.copyIt(this.checkitem)
				}
			}
			this.$refs.popuptip.close();
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
		JumptoChat() {
			uni.navigateTo({
				url: '../chat/HM-chat',
				animationType: 'fade-in',
				animationDuration: 200
			});
		},
		playIt(item, type) {
			if (type == 'music') {
				//plus.nativeUI.toast('准备播放'+item);
				uni.navigateTo({
					url: '../info/index?item=' + item + '&type=prvdoc' + '&disk=' + this.diskrouter,
					animationType: 'fade-in',
					animationDuration: 200
				});
			}
		},
		Option(item, e) {
			this.checkitem = item;
			if (e.content.text == '删除') {
				this.type = 'delete';
			} else if (e.content.text == '移动') {
				this.type = 'move';
			} else if (e.content.text == '复制') {
				this.type = 'copy';
			}
			this.$refs.popuptip.open();
		},
		deleteIt(item) {
			const data = {
				token: this.token,
				filename: item,
				diskrouter: this.diskrouter
			};
			disk.deletPrvDiskFile(data)
				.then(response => {
					let [error, res] = response;
					var msg = res.data.data;
					if (res.data.type == 'error') {
						plus.nativeUI.toast(msg);
					} else if (res.data.type == 'success') {
						plus.nativeUI.toast('文件删除成功');
						this.getList();
					}
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
				});
		},
		moveIt(item) {
			const data = {
				token: this.token,
				filename: item,
				type: 'topub'
			};
			disk.moveFile(data)
				.then(response => {
					let [error, res] = response;
					var msg = res.data.data;
					//console.log(res)
					if (res.data.type == 'error') {
						plus.nativeUI.toast(msg);
					} else if (res.data.type == 'success') {
						plus.nativeUI.toast(msg);
						this.getList();
					}
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
				});
		},
		copyIt(item) {
			const data = {
				token: this.token,
				filename: item,
				type: 'topub'
			};
			disk.copyFile(data)
				.then(response => {
					let [error, res] = response;
					var msg = res.data.data;
					//console.log(res)
					if (res.data.type == 'error') {
						plus.nativeUI.toast(msg);
					} else if (res.data.type == 'success') {
						plus.nativeUI.toast(msg);
						this.getList();
					}
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
				});
		},
		getList() {
			const data = {
				token: this.token,
				diskrouter: this.diskrouter
			};
			disk.getPrvDiskFile(data)
				.then(response => {
					let [error, res] = response;
					var msg = res.data.data;
					if (res.data.type == 'error') {
						plus.nativeUI.toast(msg);
					} else if (res.data.type == 'success') {
						this.filedata = msg;
						this.filedata.role = res.data.role;
						this.$store.commit('PrvDisk', this.filedata);
					}
					//console.log(res)
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
				});
		},
		exitout() {
			const data = {
				token: this.token
			};
			disk.reNameFile(data)
				.then(response => {
					let [error, res] = response;
					//console.log(res)
				})
				.catch(response => {
					plus.nativeUI.toast('服务器异常');
				});
		}
	},
	onShow() {
		this.getList();
	},
	onUnload() {
		this.exitout();
	}
};
</script>

<style lang="less" scoped>
/deep/.uni-collapse-cell {
	border-radius: 20px;
	border-bottom: none;
}
/deep/.uni-collapse {
	border-radius: 20px;
	border: none;
}
.notice {
	width: 100%;
	max-width: 100%;
}
/deep/.uni-popup__wrapper-box {
	border-radius: 10px;
	padding: 10px 0 !important;
	//background-color: rgba(255, 255, 255, 0.8) !important;
}
.uni-tip {
	display: flex;
	flex-direction: column;
	padding: 0px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
}

.uni-tip-title {
	padding: 0px 15px;
	text-align: center;
	font-weight: bold;
	font-size: 16px;
	color: #666;
	margin-bottom: 10px;
}

.uni-tip-content {
	text-align: center;
	padding: 0px 15px;
	font-size: 12px;
	color: #666;
}

.uni-tip-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 20px;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #3b4144;
}
.scroll-Y {
	width: 100%;
	height: auto;
	max-height: 280px;
}
.comdisk-view {
	padding: 0 5%;
}
.my-text {
	display: inline-block;
	width: 100%;
	text-align: center;
	color: #666666;
	font-weight: bold;
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

.ul > view {
	line-height: 25px;
}
</style>
