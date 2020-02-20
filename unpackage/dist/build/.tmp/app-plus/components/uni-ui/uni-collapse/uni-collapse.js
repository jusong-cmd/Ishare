(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/uni-ui/uni-collapse/uni-collapse"],{"2d4d":function(n,t,e){"use strict";var u=function(){var n=this,t=n.$createElement;n._self._c},a=[];e.d(t,"a",function(){return u}),e.d(t,"b",function(){return a})},"2da0":function(n,t,e){"use strict";var u=e("b601"),a=e.n(u);a.a},"3ad0":function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u={name:"UniCollapse",props:{accordion:{type:[Boolean,String],default:!1}},data:function(){return{}},provide:function(){return{collapse:this}},created:function(){this.childrens=[]},methods:{onChange:function(){var n=[];this.childrens.forEach(function(t,e){t.isOpen&&n.push(t.nameSync)}),this.$emit("change",n)}}};t.default=u},"43fd":function(n,t,e){"use strict";e.r(t);var u=e("3ad0"),a=e.n(u);for(var i in u)"default"!==i&&function(n){e.d(t,n,function(){return u[n]})}(i);t["default"]=a.a},b601:function(n,t,e){},bb76:function(n,t,e){"use strict";e.r(t);var u=e("2d4d"),a=e("43fd");for(var i in a)"default"!==i&&function(n){e.d(t,n,function(){return a[n]})}(i);e("2da0");var o=e("2877"),r=Object(o["a"])(a["default"],u["a"],u["b"],!1,null,null,null);t["default"]=r.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/uni-ui/uni-collapse/uni-collapse-create-component',
    {
        'components/uni-ui/uni-collapse/uni-collapse-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('6e42')['createComponent'](__webpack_require__("bb76"))
        })
    },
    [['components/uni-ui/uni-collapse/uni-collapse-create-component']]
]);
