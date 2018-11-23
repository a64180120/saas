import Vue from 'vue'
import Vuex from 'vuex'
import vuexModules from './modules'  //组件 state

import state from './state'
import mutations from './mutations'  //
import actions from './actions'

import createPersistedState  from 'vuex-persistedstate'

Vue.use(Vuex)


export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: vuexModules,
    plugins: [createPersistedState({ 
        storage: window.sessionStorage 
    })] 
})