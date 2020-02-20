//var api = 'http://1904007754.tpddns.cn:9501'//生产环境
var api = 'http://www.jusong.top' //开发环境
var socapi = 'ws://www.jusong.top:2346' //开发环境
var music = 'http://47.94.227.4:3000'
export default {

	// 登录------------------------------------
	header: {
		'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
	},
	header2: {
		'content-type': 'application/json; charset=UTF-8'
	},
	socketheader: {
		'content-type': 'application/json'
	},
	apploginimage: 'http://1904007754.tpddns.cn:9501/appimage/',
	editpw: api + '/new/editpw.php',
	login: api + '/new/login.php',
	QQlogin: api + '/new/QQLogin.php',
	getQQInfo: api + '/new/getQQInfo.php',
	register: api + '/new/register.php',
	sendemail: api + '/new/sendemail.php',
	sendSms: api + '/new/sendSms.php',
	getUserInfo:api + '/new/getOneUserInfo.php',
	sendHeader:api + '/new/uploadOneHeader.php',
	// 云盘------------------------------------
	upLoad:api + '/new/upLoad.php',
	getComDisk: api + '/new/getComDisk.php',
	getPraviteDisk: api + '/new/getPrivateDisk.php',
	deletePraDisk: api + '/new/deletPrivateDisk.php',
	deletePrvDoc: api + '/new/deletePrvDiskFile.php',
	AdminDelDoc: api + '/new/deleteDoc.php',
	getDiskStatus: api + '/new/getDiskStatus.php',
	setDiskPassWord: api + '/new/setPrivateDiskPw.php',
	getPrvDiskFile: api + '/new/getPrivateDiskFile.php',
	reNameFile: api + '/new/reNamePrivateDisk.php',
	applyDisk: api + '/new/applyDisk.php',
	moveFile: api + '/new/moveFile.php',
	copyFile: api + '/new/copyFile.php',
	socapi: socapi,
	chatvoice: 'http://1904007754.tpddns.cn:9501/new/chatvoice.php',
	// 音乐---------------------------------------
	serchMusic: music + '/search',
	getSongUrl: music + '/song/url',
	loginMusic: music + '/login/cellphone',
	loginRefresh: music + '/login/refresh',
	checkLogin: music + '/login/status',
	logout: music + '/logout',
	pic: music + '/song/detail',
	checkmusic: music + '/check/music',
	lrc: music + '/lyric',
	songsCollect:api + '/new/getOneCollectSongs.php',
	// 发布------------------------------------
	OutPut:api + '/new/outPut.php',
	// 页面拉取数据------------------------------------
	getPage:api + '/new/getPageData.php',
	getPageDetail:api + '/new/getDetailsByID.php',
	getComment:api + '/new/getCommentByID.php',
	sendComment:api + '/new/sendCommentByID.php',
	sendStudentImg:api + '/new/sendStudentImg.php',
	getBindStatus:api + '/new/getBindStatus.php',
	getBindSms:api + '/new/sendBindSms.php',
	bindQQorPhone:api + '/new/bindQQorPhone.php',
}
