<template>
	<view>
		<view class="feedback-body feedback-uploader">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class=""></view>
					<view class="uni-uploader-info" style="width: 100%;">
						<view style="color: #8f8f94;font-size: 28rpx;float: left;">选择展示图片（可选）</view>
						<view style="color: #8f8f94;font-size: 28rpx;float: right;">{{ imgList.length }}/6</view>
					</view>
				</view>
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<block v-for="(image, index) in imgList" :key="index">
							<view class="uni-uploader__file" style="position: relative;">
								<image mode="aspectFill" class="uni-uploader__img" :src="image" @click.stop="previewImage(index)"></image>
								<view v-if="index" class="set-capital" style="background: #0A98D5;" @tap.stop="setCapital(index)">设为主图</view>
								<view v-else class="set-capital">主图</view>
								<view class="close-view" @click.stop="close(index)">x</view>
							</view>
						</block>
						<view class="uni-uploader__input-box" v-show="countall > 0"><view class="uni-uploader__input" @tap="chooseImg"></view></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script type="text/javascript">
import compressImage from '@/common/util.js';
const device = uni.getSystemInfoSync();
export default {
	name: 'image-choose',
	props: {
		quality: {
			//质量
			type: Number,
			default: 1
		},
		count: {
			//最多数量
			type: Number,
			default: 5
		},
		changes: {
			//监听变化
			type: Function,
			default: null
		},
		visible: {
			type: Boolean,
			default: false,
			required: true
		}
	},
	computed: {
		countall() {
			return this.count;
		}
	},
	watch: {
		visible(newValue, oldValue) {
			if (newValue) {
				this.imgList2 = [];
				this.imgList = [];
				this.$emit('update:visible', false);
			}
		}
	},
	data() {
		return {
			imgList2: [],
			imgList: []
		};
	},
	methods: {
		async compressImageHandler(src) {
			return await compressImage(src, device.platform);
		},
		chooseImg() {
			uni.chooseImage({
				count: this.countall,
				sizeType: ['original'],
				success: async res => {
					var imgs = res.tempFilePaths || [];
					let tempPathList = [];
					let tempPathList2 = [];
					for (let i = 0; i < imgs.length; i++) {
						let str = '读取第' + (i + 1) + '个';
						uni.showLoading({ title: str, mask: true });
						let src = await this.compressImageHandler(imgs[i]);
						tempPathList.push(src);
						tempPathList2.push(src);
					}
					this.imgList = this.imgList.concat(tempPathList);
					this.imgList2 = this.imgList2.concat(tempPathList2);
					this.$emit('changes', this.imgList2);
					uni.hideLoading();
				}
			});
		},
		close(e) {
			this.imgList.splice(e, 1);
			this.imgList2.splice(e, 1);
			this.$emit('changes', this.imgList2);
		},
		previewImage(index) {
			//预览图片
			uni.previewImage({
				urls: this.imgList,
				current: this.imgList[index],
				indicator: 'default'
			});
		},
		setCapital(i, name) {
			var imgList = this.imgList;
			this.imgList[0] = imgList.splice(i, 1, imgList[0])[0];
			var imgList2 = this.imgList2;
			this.imgList2[0] = imgList2.splice(i, 1, imgList2[0])[0];
			this.$emit('changes', this.imgList2);
		}
	}
};
</script>
<style scoped>
	@import '../../common/uni.css';
.set-capital {
	text-align: center;
	line-height: 30px;
	height: 30px;
	padding: 0 5px;
	right: 0;
	/* width: 30px; */
	background: #1aad19;
	color: #ffffff;
	position: absolute;
	bottom: 0px;
	font-size: 12px;
}

.close-view {
	text-align: center;
	line-height: 22px;
	height: 24px;
	width: 24px;
	border-radius: 50%;
	background: #ff5053;
	color: #ffffff;
	position: absolute;
	top: -6px;
	right: -4px;
	font-size: 12px;
}
</style>
