(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/musiclogin"],{"0f94":function(t,n,e){"use strict";var a=function(){var t=this,n=t.$createElement;t._self._c},o=[];e.d(n,"a",function(){return a}),e.d(n,"b",function(){return o})},1662:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=o(e("8c5a"));function o(t){return t&&t.__esModule?t:{default:t}}function u(t,n){return c(t)||r(t,n)||i()}function i(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function r(t,n){var e=[],a=!0,o=!1,u=void 0;try{for(var i,r=t[Symbol.iterator]();!(a=(i=r.next()).done);a=!0)if(e.push(i.value),n&&e.length===n)break}catch(c){o=!0,u=c}finally{try{a||null==r["return"]||r["return"]()}finally{if(o)throw u}}return e}function c(t){if(Array.isArray(t))return t}var s=function(){return e.e("components/m-input").then(e.bind(null,"41ec"))},f={components:{mInput:s},data:function(){return{account:"",password:"",needlogin:!1}},created:function(){this.checkLogin()},methods:{musicLogin:function(){var t=this,n={phone:this.account,password:this.password};a.default.MusicLogin(n).then(function(n){var e=u(n,2),a=(e[0],e[1]);200==a.data.code?(t.needlogin=!1,plus.nativeUI.toast("会员登录成功")):plus.nativeUI.toast("会员登录失败")}).catch(function(t){plus.nativeUI.toast("服务器异常")})},LoginOut:function(){var t=this;a.default.LoginOut().then(function(n){var e=u(n,2),a=(e[0],e[1]);200==a.data.code?(t.needlogin=!0,plus.nativeUI.toast("会员退出成功")):plus.nativeUI.toast("会员退出失败")}).catch(function(t){plus.nativeUI.toast("服务器异常")})},checkLogin:function(){var t=this;a.default.CheckLogin().then(function(n){var e=u(n,2),a=(e[0],e[1]);301==a.statusCode?(t.needlogin=!0,plus.nativeUI.toast("会员需要登录")):a.data.code&&200==a.data.code&&(t.needlogin=!1,plus.nativeUI.toast("会员已登录"))}).catch(function(t){plus.nativeUI.toast("服务器异常")})}}};n.default=f},"472b":function(t,n,e){"use strict";var a=e("6298"),o=e.n(a);o.a},6298:function(t,n,e){},"66fb":function(t,n,e){"use strict";e.r(n);var a=e("0f94"),o=e("e3a4");for(var u in o)"default"!==u&&function(t){e.d(n,t,function(){return o[t]})}(u);e("472b");var i=e("2877"),r=Object(i["a"])(o["default"],a["a"],a["b"],!1,null,"1a396ac1",null);n["default"]=r.exports},e3a4:function(t,n,e){"use strict";e.r(n);var a=e("1662"),o=e.n(a);for(var u in a)"default"!==u&&function(t){e.d(n,t,function(){return a[t]})}(u);n["default"]=o.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/musiclogin-create-component',
    {
        'components/musiclogin-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('6e42')['createComponent'](__webpack_require__("66fb"))
        })
    },
    [['components/musiclogin-create-component']]
]);
