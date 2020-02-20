<template>
	<view class="output-view">
		<uni-popup :ref="outPutid" type="bottom" @change="closeDia2()">
			<view class="outer-box">
				<view class="inbox-view">
					
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-ui/uni-popup/uni-popup';
	export default {
		components: { uniPopup },
		props: {
			outPutid: {
				type: String,
				default: 'OutPut'
			}
		},
		data() {
			return {
				popupStatus:false
			};
		},
		methods: {
			closeDia2(val) {
				this.popupStatus = val.show;
			},
		},
		computed: {
			visible() {
				if(this.$store.state.showOutput&&this.popupStatus==false){
					this.$refs[this.outPutid].open();
				}else if(!this.$store.state.showOutput&&this.popupStatus){
					this.$refs[this.outPutid].close();
				}
				return this.$store.state.showOutput;
			}
		},
	}
</script>

<style lang="less" scoped>
	.outer-box{
		width: 750rpx;
		height: 100px;
		overflow: hidden;
		position: relative;
		.inbox-view{
			position: absolute;
			width: 1400rpx;
			height: 600px;
			left: -325rpx;
			border-radius: 50%;
			background-color: pink;
			bottom: -500px;
		}
	}
</style>
