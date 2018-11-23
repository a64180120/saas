import Vue from 'vue'
import Vuex from 'vuex'
import vuexModules from './modules'  //组件 state

import state from './state'
import mutations from './mutations'  //
import actions from './actions'
import createPersistedState from "vuex-persistedstate"
import Cookies from "js-cookie";
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

//把VUEX中的所有数据存到
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
});

export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: vuexModules,
    plugins: [vuexLocal.plugin] 
})