import api from '../../api/api.js';
const getMusicId = function(data) {
	return uni.request({
		url: api.serchMusic, //仅为示例，并非真实接口地址。
		data: data
	});
}
const MusicLogin = function(data) {
	return uni.request({
		url: api.loginMusic, //仅为示例，并非真实接口地址。
		data: data
	});
}
const MusicPic = function(data) {
	return uni.request({
		url: api.pic, //仅为示例，并非真实接口地址。
		data: data
	});
}
const CheckMusic = function(data) {
	return uni.request({
		url: api.checkmusic, //仅为示例，并非真实接口地址。
		data: {
			id: data,
		}
	});
}
const getMusicLrc = function(data) {
	return uni.request({
		url: api.lrc, //仅为示例，并非真实接口地址。
		data: {
			id: data,
		}
	});
}
const CheckLogin = function() {
	return uni.request({
		url: api.checkLogin, //仅为示例
	});
}
const LoginRefresh = function() {
	return uni.request({
		url: api.loginRefresh, //仅为示例
	});
}
const LoginOut = function() {
	return uni.request({
		url: api.logout, //仅为示例
	});
}
const getMusicName = function(item) {
	var pattern = new RegExp("[\u4E00-\u9FA5]+");
	var str = "中文字符"
	if (pattern.test(str)) {
		//alert('该字符串是中文');
	}
	var strarr = item.split(".")
	var str = null
	if (strarr.length > 2) {
		strarr.pop()
		str = strarr.join('.')
	} else {
		str = item.split(".")[0]
	}
	str = str.replace(/\[mqms2\]/g, "")
	var str2 = str.split("-")
	for (let i = 0; i < str2.length; i++) {
		str2[i] = str2[i].trim()
	}
	//str=str.replace(/\s+/g,"");
	//console.log(JSON.stringify(str2))
	if (str2.length > 1) {
		return str2[1] + ' ' + str2[0]
	} else {
		return str2[0]
	}
}
const CheckName = function(item, name) {
	//console.log(name)
	var str2 = name
	if (str2.indexOf("!") != -1 || str2.indexOf("?") != -1 || str2.indexOf("！") != -1 || str2.indexOf("？") != -1) {
		str2 = str2.replace(/\s+/g, "")
		str2 = str2.replace(/\?/g, "")
		str2 = str2.replace(/\!/g, "")
		str2 = str2.replace(/\！/g, "")
		str2 = str2.replace(/\？/g, "")
	}
	for (let i = 0; i < item.length; i++) {
		var str = item[i].name
		var str3 = item[i].name
		if (str.indexOf("!") != -1 || str.indexOf("?") != -1 || str.indexOf("！") != -1 || str.indexOf("？") != -1) {
			str = str.replace(/\s+/g, "")
			str = str.replace(/\?/g, "")
			str = str.replace(/\!/g, "")
			str = str.replace(/\！/g, "")
			str = str.replace(/\？/g, "")
		}
		if (str + ' ' + (item[i].artists)[0].name == str2 || str + (item[i].artists)[0].name == str2 || (item[i].artists)[0]
			.name + ' ' + str == str2 || (item[i].artists)[0].name + str == str2) {
			return item[i].id
		}
		if (item[i].name + ' ' + (item[i].artists)[0].name == name || (item[i].artists)[0].name + ' ' + item[i].name == name) {
			return item[i].id
		}
		if ((item[i].name + ' ' + (item[i].artists)[0].name).toLowerCase() == name.toLowerCase() || ((item[i].artists)[0].name +
				' ' + item[i].name).toLowerCase() == name.toLowerCase()) {
			return item[i].id
		}
		str3=str3.replace(/\([^\)]*\)/g,"")
		let str4=name.replace(/\([^\)]*\)/g,"")
		if (str3 + ' ' + (item[i].artists)[0].name == str4 || str + (item[i].artists)[0].name == str4 || (item[i].artists)[0]
			.name + ' ' + str3 == str4 || (item[i].artists)[0].name + str3 == str4) {
			return item[i].id
		}
		let str5=item[i].name.replace(/\//g, "");
		str4=str4.replace(/\s+/g,"");
		//console.log(str4,str5)
		if (str4.indexOf((item[i].artists)[0].name) != -1&&str4.indexOf(str5) != -1) {
			return item[i].id
		}
	}
	return false
}
const getMusicSrc = function(data) {
	var str = ''
	for (let i = 0; i < data.length; i++) {
		str = str + data[i] + ','
	}
	return uni.request({
		url: api.getSongUrl, //仅为示例，并非真实接口地址。
		data: {
			id: data,
		}
	});
}
const createLrcObj = function(lrc) {
	if (lrc.length == 0) return;
	var oLRC = {
		ti: "", //歌曲名
		ar: "", //演唱者
		al: "", //专辑名
		by: "", //歌词制作人
		offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
		ms: [] //歌词数组{t:时间,c:歌词}
	};
	var lrcs = lrc.split('\n'); //用回车拆分成数组
	for (var i in lrcs) { //遍历歌词数组
		lrcs[i] = lrcs[i].trim() //去除前后空格
		var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]")); //取[]间的内容
		var s = t.split(":"); //分离:前后文字
		if (isNaN(parseInt(s[0]))) { //不是数值
			for (var i in oLRC) {
				if (i != "ms" && i == s[0].toLowerCase()) {
					oLRC[i] = s[1];
				}
			}
		} else { //是数值
			var arr = lrcs[i].match(/\[(\d+:.+?)\]/g); //提取时间字段，可能有多个
			var start = 0;
			for (var k in arr) {
				start += arr[k].length; //计算歌词位置
			}
			var content = lrcs[i].substring(start); //获取歌词内容
			for (var k in arr) {
				var t = arr[k].substring(1, arr[k].length - 1); //取[]间的内容
				var s = t.split(":"); //分离:前后文字
				oLRC.ms.push({ //对象{t:时间,c:歌词}加入ms数组
					t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
					c: content
				});
			}
		}
	}
	oLRC.ms.sort(function(a, b) { //按时间顺序排序
		return a.t - b.t;
	});
	// for(var i in oLRC){ //查看解析结果
	//     console.log(i,":",oLRC[i]);
	// }
	return oLRC.ms
}
const SongsCollect = function(data) {
	return uni.request({
		url: api.songsCollect,
		data: data,
		method: 'POST',
		header: api.header
	});
}
export default {
	SongsCollect,
	getMusicId,
	getMusicSrc,
	getMusicName,
	MusicLogin,
	CheckLogin,
	LoginRefresh,
	LoginOut,
	MusicPic,
	CheckMusic,
	getMusicLrc,
	createLrcObj,
	CheckName
}
