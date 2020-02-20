<template>
	<view class="info" :style="{ backgroundImage: 'url(' + bgStyle + ')' }">
		<!-- '' -->
		<view class="bg"></view>
		<view class="content-music">
			<view class="status_bar"></view>
			<view class="top">
				<view class="name">{{ playList[audioPlaySrc].name }}</view>
				<view class="author">{{ playList[audioPlaySrc].author ? playList[audioPlaySrc].author : '' }}</view>
				<view class="bar">
					<view>标准</view>
					<view>音效</view>
					<view>视频</view>
				</view>
			</view>
			<view class="micImg">
				<image :class="playState ? 'zhuan' : ''" :src="playList[audioPlaySrc].img ? playList[audioPlaySrc].img : '../../static/img/music.png'"></image>
				<view class="micWord">
					{{ LrcShow ? LrcShow : '' }}
					<br />
					{{ traLrcShow ? traLrcShow : '' }}
				</view>
			</view>
			<!-- <view class="micWord">{{LrcShow}}</view> -->
			<view class="bot">
				<view class="lineBar">
					<view class="time star">{{ nowmiaoForc }}</view>
					<slider class="line" :value="nowmiao" min="0" :max="allmiao" @change="sliderChange" block-size="15" activeColor="#55A532" />
					<view class="time end">{{ allmiaoForc }}</view>
				</view>
				<view class="btn">
					<view @tap="audioWayFunc">
						<image v-if="audioWay == 0" class="iconbtn" src="../../static/image/icon/xunhuanbofang.png"></image>
						<image v-if="audioWay == 2" class="iconbtn" src="../../static/image/icon/danquxunhuan.png"></image>
						<image v-if="audioWay == 1" class="iconbtn" src="../../static/image/icon/suijibofang.png"></image>
					</view>
					<view class="palybtn">
						<view @tap="upPlay"><image class="iconbtn" src="../../static/image/icon/shangyishou.png"></image></view>
						<view @tap="play">
							<image v-if="!playState" class="iconbtn play" src="../../static/image/icon/kaishi-2.png"></image>
							<image v-if="playState" class="iconbtn play" src="../../static/image/icon/zanting-2.png"></image>
						</view>
						<view @tap="nextPlay"><image class="iconbtn" src="../../static/image/icon/xiayishou.png"></image></view>
					</view>
					<view @click="openList()"><image class="iconbtn" src="../../static/image/icon/yinleliebiao.png"></image></view>
				</view>
				<view class="tool">
					<view @tap="collectFunc">
						<image v-if="!collect" class="iconbtn" src="../../static/image/icon/shoucang.png"></image>
						<image v-if="collect" class="iconbtn" src="../../static/image/icon/shoucang-2.png"></image>
					</view>
					<view @click="downLoad()"><image class="iconbtn" src="../../static/image/icon/xiazai.png"></image></view>
					<view><image class="iconbtn" src="../../static/image/icon/share.png"></image></view>
					<view><image class="iconbtn" src="../../static/image/icon/liuyanjianyi.png"></image></view>
				</view>
			</view>
		</view>
		<uni-popup ref="musicList" type="bottom">
			<view style="height: 600rpx;width: 750rpx;background-color: #FAFAFA;">
				<view style="position:fixed;top:0px;float:inherit;width: 100%;height: 60rpx;background-color: #FFFFFF;z-index: 99;">
					<uni-segmented-control :current="current" :values="items" style-type="text" active-color="#dd524d" @clickItem="onClickItem" />
				</view>
				<view v-show="current === 0" style="margin-top: 60rpx;">
					<uni-list>
						<uni-list-item
							:show-extra-icon="false"
							:showArrow="false"
							v-for="(item, index) in audioList"
							:title="item.name"
							:note="item.author"
							:thumb="item.img"
							:key="index"
							:disabled="index == audioPlaySrc && type == 'disk'"
							@click="audiojump(index, 'disk')"
						/>
					</uni-list>
				</view>
				<view v-show="current === 1" style="margin-top: 60rpx;">
					<uni-list>
						<uni-list-item
							:show-extra-icon="false"
							:showArrow="false"
							v-for="(item, index) in loveList"
							:title="item.name"
							:note="item.author"
							:thumb="item.img"
							:key="index"
							:disabled="index == audioPlaySrc && type == 'love'"
							@click="audiojump(index, 'love')"
						/>
					</uni-list>
				</view>
			</view>
		</uni-popup>
		<l-file ref="lFile" @up-success="upSuccess"></l-file>
	</view>
</template>

<script>
import music from '@/static/js/music.js';
import lFile from '@/components/l-file/l-file';
import uniSegmentedControl from '@/components/uni-ui/uni-segmented-control/uni-segmented-control';
import uniPopup from '@/components/uni-ui/uni-popup/uni-popup';
import uniList from '@/components/uni-ui/uni-list/uni-list';
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item';
var innerAudioContext = uni.createInnerAudioContext();
export default {
	components: { uniPopup, uniSegmentedControl, uniList, uniListItem, lFile },
	data() {
		return {
			account: '',
			token: '',
			current: 0,
			items: ['当前列表', '收藏列表'],
			musicSrc: '',
			nowmiao: 0, //当前时间
			lrctime: 0,
			allmiao: 0, //全部时间
			lineBarWid: 520, //进度条的宽度跟css一只
			playState: 0, //播放状态
			audioCont: '',
			audioList: [],
			lrcindex: 0,
			type: 'disk',
			tralrcindex: 0,
			alldata: [],
			lrcdata: [],
			loveList: [],
			tralrcdata: [],
			audioPlaySrc: null, //当前播放的歌曲index
			audioWay: 0, //播放方式 0顺序播放 1随机播放 2单曲循环
			collect: 0 //是否收藏
		};
	},
	computed: {
		playList() {
			if (this.type == 'disk') {
				return this.audioList;
			} else if (this.type == 'love') {
				return this.loveList;
			}
		},
		width() {
			return 'width:' + (this.nowmiao / this.allmiao) * this.lineBarWid + 'upx';
		},
		playWidth() {
			return 'transform:translate3d(' + (this.nowmiao / this.allmiao) * this.lineBarWid + 'upx,0,0);';
		},
		nowmiaoForc() {
			return this.$pubFuc.secondFormact(this.nowmiao);
		},
		allmiaoForc() {
			return this.$pubFuc.secondFormact(this.allmiao);
		},
		bgStyle() {
			if (this.type == 'disk') {
				if (this.audioList.length != 0 && this.audioPlaySrc < this.audioList.length) {
					return this.audioList[this.audioPlaySrc].img || '../../static/img/music.png';
				} else {
					return '../../static/img/music.png';
				}
			} else if (this.type == 'love') {
				if (this.loveList.length != 0 && this.audioPlaySrc < this.loveList.length) {
					return this.loveList[this.audioPlaySrc].img || '../../static/img/music.png';
				} else {
					return '../../static/img/music.png';
				}
			}
		},
		LrcShow() {
			//console.log(this.lrcindex,this.lrcdata.length)
			if (this.lrcdata.length > 0) {
				if (this.lrcindex <= this.lrcdata.length && this.lrcindex != 0) {
					return this.lrcdata[this.lrcindex - 1].c;
				} else {
					return '......';
				}
			} else {
				return '暂无歌词';
			}
		},
		traLrcShow() {
			//console.log(this.lrcindex,this.lrcdata.length)
			if (this.tralrcdata.length > 0) {
				if (this.tralrcindex <= this.tralrcdata.length && this.tralrcindex != 0) {
					return this.tralrcdata[this.tralrcindex - 1].c;
				} else {
					return '';
				}
			} else {
				return '';
			}
		}
	},
	watch: {
		audioPlaySrc: {
			handler: function(val, oldval) {
				if (this.playList[val].id) {
					this.lrcdata = [];
					this.lrcindex = 0;
					this.tralrcdata = [];
					this.tralrcindex = 0;
					this.collect = 0;
					music.getMusicLrc(this.playList[this.audioPlaySrc].id).then(response => {
						var [error, res] = response;
						//console.log(res.data)
						this.lrcdata = music.createLrcObj(res.data.lrc.lyric);
						if (res.data.tlyric.lyric) {
							this.tralrcdata = music.createLrcObj(res.data.tlyric.lyric);
						}
					});
				}
			},
			deep: true, //对象内部的属性监听，也叫深度监听
			immediate: true
		}
	},
	onLoad: function(option) {
		const app = getApp();
		this.account = app.globalData.account;
		this.token = app.globalData.token;
		this.audioList = [];
		if (innerAudioContext == null) {
			innerAudioContext = uni.createInnerAudioContext();
		}
		if (option.type == 'pubdoc') {
			this.alldata = this.$store.state.filedata.music;
			this.musicSrc = 'http://39.106.78.21/PublicDoc/';
			//console.log(this.alldata)
		}
		if (option.type == 'prvdoc') {
			this.alldata = this.$store.state.prvdisk.music;
			this.musicSrc = 'http://39.106.78.21/PraviteDoc/' + option.disk + '/';
			//console.log(this.alldata)
		}
		var listone = {};
		var that = this;
		const data = {
			keywords: music.getMusicName(option.item),
			limit: 9
		};
		this.getLoveList();
		music
			.getMusicId(data)
			.then(response => {
				var [error, res] = response;
				const data2 = {};
				//console.log(res.data.result);
				const nameBack = music.CheckName(res.data.result.songs, data.keywords);
				if (nameBack) {
					data2.ids = nameBack;
					listone.id = nameBack;
					//console.log(nameBack)
					return music.MusicPic(data2);
				} else {
					data2.ids = res.data.result.songs[0].id;
				}
				//return music.MusicPic(data2);
			})
			.then(response => {
				var [error, res] = response;
				listone.img = res.data.songs[0].al.picUrl + '?param=600y600';
				listone.author = res.data.songs[0].ar[0].name;
				listone.name = res.data.songs[0].name;
				//console.log(listone)
				if (listone.id) {
					return music.CheckMusic(listone.id);
				} else {
					listone.src = this.musicSrc + option.item;
				}
			})
			.then(response => {
				var [error, res] = response;
				if (res.data.success) {
					listone.src = 'https://music.163.com/song/media/outer/url?id=' + listone.id + '.mp3';
				} else {
					listone.src = this.musicSrc + option.item;
				}
				that.audioList.push(listone);
				that.audioPlaySrc = 0;
				that.audioInit();
				that.getPlayList(option.item);
				//console.log(listone)
			})
			.catch(error => {
				//console.log(listone)
				listone.src = this.musicSrc + option.item;
				listone.img = null;
				listone.author = '';
				listone.name = option.item;
				that.audioList.push(listone);
				that.audioPlaySrc = 0;
				that.audioInit();
				that.getPlayList(option.item);
			});
		//this.getPlayList(option.item)
		//this.audioInit()
	},
	onReady() {
		var that = this;
		plus.io.resolveLocalFileSystemURL(
			'/storage/emulated/0/',
			function(fileEntry1) {
				fileEntry1.getDirectory(
					'Ishare',
					{ create: true, exclusive: false },
					function(dir) {
						//console.log('Directory Entry Name: ' + dir.name);
					},
					function() {
						//console.log(e.message);
					}
				);
			},
			function(e) {
				console.log('Resolve file URL failed: ' + e.message);
			}
		);
		innerAudioContext.onPlay(() => {
			that.allmiao = Math.floor(innerAudioContext.duration);
			//console.log('总时间：'+this.allmiao+'-------------' )
			that.playFunc();
		});
		innerAudioContext.onPause(() => {
			that.pauseFunc();
		});
		innerAudioContext.onTimeUpdate(e => {
			var time = innerAudioContext.currentTime;
			that.nowmiao = Math.floor(time);
			that.lrctime = time;
			if (that.lrcindex == that.lrcdata.length && that.lrcdata.length != 0) {
				//console.log('jieweila')
				that.lrcindex = that.lrcdata.length - 1;
			}
			if (that.lrcdata.length > 0 && that.lrcindex < that.lrcdata.length) {
				if (parseFloat(that.lrcdata[that.lrcindex].t) <= time && that.lrcdata.length - 1 != that.lrcindex) {
					//lineHigh();//高亮当前行
					that.lrcindex++;
				}
			}
			if (that.tralrcindex == that.tralrcdata.length && that.tralrcdata.length != 0) {
				//console.log('jieweila')
				that.tralrcindex = that.tralrcdata.length - 1;
			}
			if (that.tralrcdata.length > 0 && that.tralrcindex < that.tralrcdata.length) {
				if (parseFloat(that.tralrcdata[that.tralrcindex].t) <= time && that.tralrcdata.length - 1 != that.tralrcindex) {
					//lineHigh();//高亮当前行
					that.tralrcindex++;
				}
			}
			//console.log('当前播放时间'+that.nowmiao)
		});
		innerAudioContext.onEnded(() => {
			that.lrctime = 0;
			that.lrcdata = [];
			that.lrcindex = 0;
			that.nextPlay();
		});
	},
	methods: {
		downLoad() {
			let url = this.playList[this.audioPlaySrc].src;
			this.$refs.lFile.download(url).then(path => {
				let last = path.split('.').pop();
				let filename = '';
				if (this.playList[this.audioPlaySrc].author) {
					filename = this.playList[this.audioPlaySrc].name + '-' + this.playList[this.audioPlaySrc].author + '.' + last;
				} else {
					filename = this.playList[this.audioPlaySrc].name + '.' + last;
				}
				plus.io.resolveLocalFileSystemURL(
					'/storage/emulated/0/Ishare/',
					function(fileEntry1) {
						plus.io.resolveLocalFileSystemURL(
							path,
							function(fileEntry) {
								fileEntry.moveTo(
									fileEntry1,
									filename,
									function(entry) {
										plus.nativeUI.toast('文件下载成功：' + entry.fullPath);
									},
									function(e) {
										plus.nativeUI.toast('已有该文件');
									}
								);
							},
							function(e) {
								plus.nativeUI.toast('文件保存异常！');
							}
						);
					},
					function(e) {
						plus.nativeUI.toast('目录打开异常！');
					}
				);
			});
		},
		onClickItem(e) {
			if (this.current !== e) {
				this.current = e;
			}
		},
		openList() {
			this.$refs.musicList.open();
		},
		getPlayList(item) {
			var index = this.alldata.indexOf(item);
			var data = this.alldata;
			// data.splice(index,1)
			// console.log(data)
			// console.log(this.alldata)
			for (let i = 0; i < data.length; i++) {
				if (data[i] != item) {
					this.getItem(data[i]);
				}
			}
			// if(index>=0){
			// 	for(let i=0;i<index;i++)
			// 	{
			// 		this.getItem(this.alldata[i])
			// 	}
			// }
			// console.log(JSON.stringify(this.audioList))
		},
		getItem(item) {
			var listone = {};
			var that = this;
			const data = {
				keywords: music.getMusicName(item),
				limit: 10
			};
			//许嵩 你若成风
			music
				.getMusicId(data)
				.then(response => {
					var [error, res] = response;
					const data2 = {};
					const nameBack = music.CheckName(res.data.result.songs, data.keywords);
					if (nameBack) {
						data2.ids = nameBack;
						listone.id = nameBack;
						return music.MusicPic(data2);
					} else {
						data2.ids = res.data.result.songs[0].id;
					}
					//return music.MusicPic(data2);
				})
				.then(response => {
					var [error, res] = response;
					listone.img = res.data.songs[0].al.picUrl + '?param=600y600';
					listone.author = res.data.songs[0].ar[0].name;
					listone.name = res.data.songs[0].name;
					//console.log(listone)
					if (listone.id) {
						return music.CheckMusic(listone.id);
					} else {
						listone.src = this.musicSrc + item;
					}
				})
				.then(response => {
					var [error, res] = response;
					if (res.data.success) {
						listone.src = 'https://music.163.com/song/media/outer/url?id=' + listone.id + '.mp3';
					} else {
						listone.src = this.musicSrc + item;
					}
					//console.log(listone)
					that.audioList.push(listone);
				})
				.catch(error => {
					listone.src = this.musicSrc + item;
					listone.img = null;
					listone.author = '';
					listone.name = item;
					//console.log(listone)
					that.audioList.push(listone);
				});
		},
		audioInit() {
			let src = this.playList[this.audioPlaySrc].src;
			if (innerAudioContext == null) {
				innerAudioContext = uni.createInnerAudioContext();
			}
			if (!innerAudioContext.paused) {
				innerAudioContext.stop();
				//销毁====================
			}
			innerAudioContext.src = src;
			innerAudioContext.play();
			const data = {
				token: this.token,
				type: 'getstatus',
				songid: this.playList[this.audioPlaySrc].id
			};
			music.SongsCollect(data).then(response => {
				var [error, res] = response;
				if (res.data.type == 'success') {
					this.collect = 1;
				} else {
					this.collect = 0;
				}
			});
		},
		audiojump(e, type) {
			if (type != this.type) {
				if (!innerAudioContext.paused) {
					innerAudioContext.pause();
					//销毁====================
				}
				if (e != this.audioPlaySrc) {
					this.lrcdata = [];
					this.lrcindex = 0;
					this.nowmiao = 0;
					this.audioPlaySrc = e;
				}
				this.type = type;
				this.audioInit();
			} else {
				if (e != this.audioPlaySrc) {
					this.lrcdata = [];
					this.lrcindex = 0;
					this.nowmiao = 0;
					this.audioPlaySrc = e;
					this.audioInit();
				}
			}
		},
		playFunc() {
			this.playState = 1;
		},
		pauseFunc() {
			this.playState = 0;
		},
		sliderChange(e) {
			this.nowmiao = e.detail.value;
			for (let i = 0; i < this.lrcdata.length; i++) {
				if (this.lrcdata[i].t >= this.nowmiao) {
					this.lrcindex = i;
					break;
				}
			}
			for (let i = 0; i < this.tralrcdata.length; i++) {
				if (this.tralrcdata[i].t >= this.nowmiao) {
					this.tralrcindex = i;
					break;
				}
			}
			innerAudioContext.seek(this.nowmiao);
		},
		play() {
			if (this.playState == 0) {
				//暂停
				innerAudioContext.play();
			} else {
				//播放
				innerAudioContext.pause();
			}
		},
		nextPlay() {
			if (this.audioWay == 1) {
				//随机
				this.audioPlaySrc = Math.floor(Math.random() * 10) % this.playList.length;
			} else if (this.audioWay == 0) {
				//顺序
				if (this.audioPlaySrc >= this.playList.length - 1) {
					this.audioPlaySrc = 0;
				} else {
					this.audioPlaySrc = this.audioPlaySrc + 1;
				}
			} //单曲循环
			this.lrcdata = [];
			this.lrcindex = 0;
			this.nowmiao = 0;
			this.audioInit();
		},
		getLoveList() {
			const data = {
				token: this.token,
				type: 'get'
			};
			//console.log(data)
			music
				.SongsCollect(data)
				.then(response => {
					var [error, res] = response;
					//console.log(res);
					if (res.data.type == 'success') {
						this.loveList = res.data.data;
					} else {
						plus.nativeUI.toast(res.data.data);
					}
				})
				.catch(error => {
					console.log(error);
				});
		},
		upPlay() {
			if (this.audioWay == 1) {
				//随机
				this.audioPlaySrc = Math.floor(Math.random() * 10) % this.playList.length;
			} else if (this.audioWay == 0) {
				//顺序
				if (this.audioPlaySrc < 1) {
					this.audioPlaySrc = this.playList.length - 1;
				} else {
					this.audioPlaySrc = this.audioPlaySrc - 1;
				}
			} //单曲循环
			this.lrcdata = [];
			this.lrcindex = 0;
			this.nowmiao = 0;
			this.audioInit();
		},
		audioWayFunc() {
			if (this.audioWay > 1) {
				this.audioWay = 0;
			} else {
				this.audioWay = this.audioWay + 1;
			}
		},
		collectFunc() {
			if (this.collect == 0) {
				const data1 = this.playList[this.audioPlaySrc];
				if (!data1.id) {
					plus.nativeUI.toast('暂不支持非网易云音乐资源收藏');
					return;
				}
				let str = JSON.stringify(data1);
				const data = {
					token: this.token,
					type: 'add',
					songs: str
				};
				music.SongsCollect(data).then(response => {
					var [error, res] = response;
					if (res.data.type == 'success') {
						this.collect = 1;
						if (res.data.data == '收藏成功') {
							if (this.loveList.indexOf(data1) == -1) {
								this.loveList.push(data1);
							}
						}
					} else {
						plus.nativeUI.toast(res.data.data);
					}
				});
			} else if (this.collect == 1) {
				const data1 = this.playList[this.audioPlaySrc];
				const data = {
					token: this.token,
					type: 'delete',
					songid: data1.id
				};
				music.SongsCollect(data).then(response => {
					var [error, res] = response;
					plus.nativeUI.toast(res.data.data);
					if (res.data.type == 'success') {
						this.collect = 0;
					}
				});
			}
		}
	},
	destroyed() {
		innerAudioContext.destroy();
		innerAudioContext = null;
		this.lrctime = 0;
		this.lrcdata = [];
		this.lrcindex = 0;
	}
};
</script>

<style lang="scss" scoped>
@import '../../static/css/common';
/deep/.uni-popup__wrapper-box {
	border-radius: 10px;
	padding: 0px 0 !important;
}
.info {
	position: fixed;
	right: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #fafafa;
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
	//filter: blur(40upx);
	.bg {
		position: fixed;
		z-index: 0;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		filter: blur(10px);
		background: inherit;
		//background-color: rgba(0,0,0,0.7);
	}
	.content-music {
		position: fixed;
		z-index: 1;
		right: 0;
		left: 0;
		height: 100%;
		width: 100%;
		color: #fffdef;
		background-color: rgba(0, 0, 0, 0.2);

		.top {
			margin-top: 20upx;
			width: 100%;
			text-align: center;
			.name {
				font-size: 46upx;
			}
			.author {
				font-size: 34upx;
				line-height: 60upx;
			}
			.bar {
				width: 330upx;
				display: none;
				justify-content: space-between;
				//display: flex;
				margin: 20upx auto;
				view {
					width: 100upx;
					height: 40upx;
					border: solid 1upx #fffdef;
					border-radius: 2upx;
					text-align: center;
				}
			}
		}
		.micImg {
			margin: 25upx auto;
			margin-top: 80rpx;
			image {
				display: block;
				margin: 0 auto;
				width: 600upx;
				height: 600upx;
				border: solid 16upx rgba(0, 0, 0, 0.15);
				border-radius: 50%;
				&.zhuan {
					-webkit-transform: rotate(360deg);
					animation: rotation 15s linear infinite;
				}
			}
		}
		.micWord {
			margin-top: 20px;
			text-align: center;
		}
		.bot {
			position: fixed;
			bottom: 40upx;
			left: 0;
			width: 100%;
			padding: 0 26upx;
			box-sizing: border-box;
			.lineBar {
				display: flex;
				padding: 20upx 0;
				justify-content: space-between;
				.line {
					margin: 0;
					width: 520upx;
				}
			}
			.iconbtn {
				display: block;
				width: 50upx;
				height: 50upx;
				margin: 0 auto;
				&:active {
					background-color: rgba(120, 10, 50, 0.8);
					border-radius: 50%;
					box-shadow: 0px 0px 10px #666666;
				}
			}
			.btn {
				display: flex;
				justify-content: space-between;
				padding: 40upx 15upx;
				.palybtn {
					display: flex;
					width: 500upx;
					margin-top: -15upx;
					view {
						flex: 1;
						align-items: center;
					}
					.iconbtn {
						width: 80upx;
						height: 80upx;
						&.play {
							margin-top: -20upx;
							width: 120upx;
							height: 120upx;
						}
					}
				}
			}
			.tool {
				display: flex;
				view {
					flex: 1;
					text-align: center;
				}
			}
		}
	}
}
</style>
