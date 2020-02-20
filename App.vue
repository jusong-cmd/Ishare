<script>
//import BackgroundImage1 from '@/static/img/login.jpg';
export default {
	globalData: {
		//BackgroundImageList: BackgroundImage1,
		text: 'text',
		account: '',
		token: '',
		Socket: null,
		SocketOpend: false,
		SocketMsg: null,
		SocketTimer: null,
		showOutput: false,
		userid:null
	},
	onLaunch: function() {
		uni.onTabBarMidButtonTap(() => {
			// if (this.$store.state.showOutput) {
			// 	this.$store.commit('OutPut', false);
			// } else {
			// 	this.$store.commit('OutPut', true);
			// }
			uni.navigateTo({
				url: '/pages/output/output',
				animationType: 'pop-in',
				animationDuration: 200
			});
		});
	},
	onShow: function() {
		//console.log('App Show');
	},
	onHide: function() {
		//console.log('App Hide');
	}
};
</script>
<style lang="scss">
</style>
<style>
@font-face {
	font-family: 'iconfont'; /* project id 1387774 */
	src: url('https://at.alicdn.com/t/font_1387774_k6u46036u2g.ttf') format('truetype');
}
.icon {
	font-size: 24upx;
	font-family: iconfont;
}
/* #ifndef APP-PLUS-NVUE */
page {
	min-height: 100%;
	display: flex;
	font-size: 16px;
}
m-input {
	width: 100%;
	display: flex;
	flex: 1;
} 
.content {
	display: flex;
	flex: 1;
	width: 100%;
	max-width: 100%;
	flex-direction: column;
	background-color: #fafafa;
	padding: 0px;
	overflow: hidden;
}
.status_bar {
	height: var(--status-bar-height);
	min-height: 20px;
	width: 100%;
	z-index: 99;
}
.input-group {
	margin-top: 12%;
	position: relative;
}

.input-group::before {
	position: absolute;
	right: 0;
	top: 0;
	left: 0;
	height: 0px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.input-group::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 0px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.input-row {
	display: flex;
	flex-direction: row;
	position: relative;
	font-size: 18px;
	line-height: 40px;
}

.input-row .title {
	width: 72px;
	padding-left: 15px;
}

.input-row.border::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 8px;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.btn-row {
	margin-top: 30px;
}

button.primary {
	background-color: #0faeff;
}
/* #endif */
</style>
