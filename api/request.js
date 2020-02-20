import api from '@/api/api.js';
let baseUrl = api.api
export default {
	config: {
		baseUrl,
		header: api.header,
		data: {},
		method: "GET",
		dataType: "json",
		responseType: "text",
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: { // 请求和返回拦截
		request: request => {
			// console.log(request)
		},
		response: response => {
			if (response.errMsg === 'request:ok') { // 请求成功
				if (response.data.code && response.data.code !== 200) {
					// 请求成功但状态码不是200，提示下错误
					uni.showToast({
						title: response.data.data,
						icon: 'none',
						duration: 2000,
						position: 'bottom'
					});
					if (response.data.code === 6200 || response.data.code === 415 || response.data.code === 401 || response.data.code ===
						6150) {
						// 请求头为空（6200）跳转到登陆页
						// 凭证过期 （6150）
						// 令牌失效，或认证失败 415 401
						setTimeout(function() {
							uni.reLaunch({
								url: '../login/login',
								animationType: 'pop-in',
								animationDuration: 200
							});
						}, 2000);

					}
				}
			} else { // 请求出错
				uni.showToast({
					title: '服务端出错，请重试！',
					icon: 'none',
					duration: 2000,
					position: 'bottom'
				});
			}


		}
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method
		return new Promise((resolve, reject) => {
			let _config = null

			// 请求结果
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				if (statusCode === 200) { //成功
					resolve(response);
				} else {
					reject(response)
				}
			}
			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()
			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}
