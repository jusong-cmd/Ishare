<template>
	<view>
		<l-file ref="lFile" @up-success="upSuccess"></l-file>
		<button @click="onUpload()">点我上传</button>
	</view>
</template>

<script>
import lFile from '@/components/l-file/l-file';
export default {
	components: { lFile },
	data() {
		return {};
	},
	onShow() {
		this.onUpload()
	},
	methods: {
		upSuccess(e) {},
		onUpload() {
			this.$refs.lFile.upload({
				// #ifdef APP-PLUS
				currentWebview: this.$mp.page.$getAppWebview(),
				// #endif
				url: 'https://www.example.com/upload', //测试地址，记得更换
				name: 'file',
				// header: {'Content-Type':'类型','Authorization':'token'},
				//...其他参数
			});
		},
	}
};
</script>

<style lang="scss"></style>
