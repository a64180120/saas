import Vue from 'vue'
import Vuex from 'vuex'
import vuexModules from './modules'  //组件 state

import state from './state'
import mutations from './mutations'  //
import actions from './actions'
import createPersistedState from 'vuex-persistedstate'
import Cookies from "js-cookie";

Vue.use(Vuex)

export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: vuexModules,
    //把VUEX中的所有数据存到
    plugins: [
        createPersistedState({
        //   storage: {
        //     getItem: key => Cookies.get(key),
        //     setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
        //     removeItem: key => Cookies.remove(key)
        //   }
        storage: window.sessionStorage
        // reducer(val) {
        //     return {
        //     // 只储存state中的user
        //     user: val.user
        //   }
        // }
        })
    ]
})