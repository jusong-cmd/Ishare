import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        forcedLogin: false,
        hasLogin: false,
        userName: "",
		showOutput: false,
		filedata: {
			music: [],
			video: [],
			photo: [],
			doc: [],
			role: ''
		},
		prvdisk: {
			music: [],
			video: [],
			photo: [],
			doc: [],
			role: ''
		},
		diskrouter:null
    },
    mutations: {
        login(state, userName) {
            state.userName = userName || '新用户';
            state.hasLogin = true;
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
        },
		FileVal(state, data) {
		    state.filedata = data
		},
		OutPut(state, data) {
		    state.showOutput = data
		},
		DiskRouter(state, data) {
		    state.diskrouter = data
		},
		PrvDisk(state, data) {
		    state.prvdisk = data
		},
    }
})

export default store
