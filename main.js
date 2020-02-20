import Vue from 'vue'
import App from './App'
import store from './store'
import PubFuc from'./publicjs/common'
// import outPut from '@/components/output/OutPut.vue'
App.mpType = 'app'
//挂载
// Vue.component('outPut',outPut)
Vue.prototype.$pubFuc = PubFuc
Vue.config.productionTip = false

Vue.prototype.$store = store

const app = new Vue({
    store,
    ...App
})
app.$mount()
