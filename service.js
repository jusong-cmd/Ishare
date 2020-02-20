// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';
const TOKEN_KEY = 'TOKEN_KEY';

const getUsers = function () {
    let ret = '';
    ret = uni.getStorageSync(USERS_KEY);
    if (!ret) {
        ret = '{}';
    }
    return JSON.parse(ret);
}
const getToken = function () {
    let ret = '';
    ret = uni.getStorageSync(TOKEN_KEY);
    if (!ret) {
        ret = '{}';
    }
    return JSON.parse(ret);
}
const addToken = function (userInfo) {
    let users = getToken();
    users.account= userInfo.account,
	users.token=userInfo.token
    uni.setStorageSync(TOKEN_KEY, JSON.stringify(users));
}
const setFinger = function (userInfo) {
    let users = getToken();
    users.finger= userInfo.finger,
	users.diskpw=userInfo.diskpw
    uni.setStorageSync(TOKEN_KEY, JSON.stringify(users));
}
const deletFinger = function () {
    let users = getToken();
    delete users.finger
	delete users.diskpw
    uni.setStorageSync(TOKEN_KEY, JSON.stringify(users));
}
const deletUser = function () {
    let users = {};
    uni.setStorageSync(USERS_KEY, JSON.stringify(users));
}
const addUser = function (userInfo) {
    let users = getUsers();
		users.type=userInfo.type||'phone',
        users.account=userInfo.account,
        users.password=userInfo.password,
		users.loginauto=userInfo.loginauto||false,
    uni.setStorageSync(USERS_KEY, JSON.stringify(users));
}

export default {
    getUsers,
    addUser,
	addToken,
	getToken,
	setFinger,
	deletFinger,
	deletUser
}
