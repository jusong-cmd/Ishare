<template>
	<view class="m-input-view">
		<input :focus="focus_" :type="inputType" :value="value" @input="onInput" class="m-input-input" :placeholder="placeholder"
		 :password="type==='password'&&!showPassword" @focus="onFocus" @blur="onBlur" />
		<!-- 优先显示密码可见按钮 -->
		<view v-if="clearable_&&!displayable_&&value.length" class="m-input-icon">
			<text color="#666666"  @click="clear" class="icon iconview"> &#xe62a;</text>
		</view>
		<view v-if="displayable_" class="m-input-icon">
			<text :style="{color:showPassword?'#666666':'#cccccc'}"  @click="display" class="icon iconview"> &#xe622;</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			/**
			 * 输入类型
			 */
			type: String,
			/**
			 * 值
			 */
			value: String,
			/**
			 * 占位符
			 */
			placeholder: String,
			/**
			 * 是否显示清除按钮
			 */
			clearable: {
				type: [Boolean, String],
				default: false
			},
			/**
			 * 是否显示密码可见按钮
			 */
			displayable: {
				type: [Boolean, String],
				default: false
			},
			/**
			 * 自动获取焦点
			 */
			focus: {
				type: [Boolean, String],
				default: false
			}
		},
		model: {
			prop: 'value',
			event: 'input'
		},
		data() {
			return {
				/**
				 * 显示密码明文
				 */
				showPassword: false,
				/**
				 * 是否获取焦点
				 */
				isFocus: false
			}
		},
		computed: {
			inputType() {
				const type = this.type
				return type === 'password' ? 'text' : type
			},
			clearable_() {
				return String(this.clearable) !== 'false'
			},
			displayable_() {
				return String(this.displayable) !== 'false'
			},
			focus_() {
				return String(this.focus) !== 'false'
			}
		},
		methods: {
			clear() {
				this.$emit('input', '')
			},
			display() {
				this.showPassword = !this.showPassword
			},
			onFocus() {
				this.isFocus = true
			},
			onBlur() {
				this.$nextTick(() => {
					this.isFocus = false
				})
			},
			onInput(e) {
				this.$emit('input', e.target.value)
			}
		}
	}
</script>

<style>
	.m-input-view {
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		/* width: 100%; */
		flex: 1;
		padding: 0 10px;
	}
	.iconview{
		width: 20px;
		font-size: 20px;
		line-height: 20px;
		color: #666666;
	}
	.m-input-input {
		flex: 1;
		width: 100%;
		min-height: 100%;
		line-height: inherit;
		background-color: rgba(0, 0, 0, 0);
	}

	.m-input-icon {
		width: 20px;
		font-size: 20px;
		line-height: 20px;
		color: #666666;
	}
</style>
