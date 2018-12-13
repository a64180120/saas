const state = {
    // 是否要缓存页面，默认不缓存
    cachePage: true,
    // 已经打开的页面
    openedPageList: [],
    // 缓存的页面
    cachedPageName: []
}

const mutations = {
    turnCachePage(state,data){//改变路由是否缓存12-13*****
        state.cachePage=data;
    },
    addTagNav(state, data){
        if (state.openedPageList.some(v => v.path === data.path)) return
        if(state.cachedPageName.includes(data.name)){
            console.error(`${data.name} 组件出现命名重复，请检查组件中的name字段。当前组件所在的路由地址为：${data.path}`)
            return
        }
        state.openedPageList.push(data)
        if(state.cachePage){
            state.cachedPageName.push(data.name)
        }
    },
    removeTagNav(state, data){
        if(data){
            for(let [i, v] of state.openedPageList.entries()){
                if(v.path === data.path){
                    state.openedPageList.splice(i, 1)
                }
            }
            
            if(state.cachePage){
                let index = state.cachedPageName.indexOf(data.name)
                if(index >= 0){
                    state.cachedPageName.splice(index, 1)
                }
            }
        } else{
            state.openedPageList = []
            state.cachedPageName = []
        }
    },
    delVisitedTagNav: (state, data) => {
        for (let [i, v] of state.openedPageList.entries()) {
          if (v.path === data.path) {
            state.openedPageList.splice(i, 1)
            break
          }
        }
        if(state.cachePage){
            let index = state.cachedPageName.indexOf(data.name)
            if(index >= 0){
                state.cachedPageName.splice(index, 1)
            }
        }
    },
    delOthersTagNav: (state, data) => {
        for (let [i, v] of state.openedPageList.entries()) {
          if (v.path === data.path) {
            state.openedPageList = state.openedPageList.slice(i, i + 1)
            break
          }
        }
        if(state.cachePage){
            for (let i of state.cachedPageName) {
                if (i === data.name) {
                    const index = state.cachedPageName.indexOf(i)
                    state.cachedPageName = state.cachedPageName.slice(index, i + 1)
                    break
                }
            }
        }
    },
    //删除页面 TagNav缓存
    delAllTagNav: (state,data) => {
        state.openedPageList = []
        state.cachedPageName = []
    }
}

const actions={
    addVisitedViews({ commit }, view) {
        commit('addTagNav', view)
    },
    delVisitedViews({ commit, state }, view) {
        return new Promise((resolve) => {
            commit('delVisitedTagNav', view)
            resolve([...state.openedPageList])
        })
    },
    delOthersViews({ commit, state }, view) {
        return new Promise((resolve) => {
            commit('delOthersTagNav', view)
            resolve([...state.openedPageList])
        })
    },
    delAllViews({ commit, state }) {
        return new Promise((resolve) => {
            commit('delAllTagNav')
            resolve([...state.openedPageList])
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}