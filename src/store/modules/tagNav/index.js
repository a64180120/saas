const state = {
    /**
     * 是否要缓存Tag页面，默认缓存, 
     * 在路由的meta中标识noCache=true 表示不缓存当前页面
     *  */
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
        state.openedPageList.push({
            name: data.name,
            path: data.path,
            title: data.title || 'no-name'
        });
        if(state.cachePage){
            if(state.cachedPageName.includes(data.name)){
                //console.error(`${data.name} 组件出现命名重复，请检查组件中的name字段。当前组件所在的路由地址为：${data.path}`)
                return
            }
            //data.noCache 加载tag是表示不缓存当前页面
            if (!data.noCache) {
                state.cachedPageName.push(data.name)
            }
        }
    },
    removeTagNav(state, data){
        for(let [i, v] of state.openedPageList.entries()){
            if(v.path === data.path){
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
              console.log(v.path)
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
    addTagNavViews({ commit }, data) {
        commit('addTagNav', data)
    },
    removeTagNavViews({ commit, state }, data) {
        return new Promise((resolve) => {
            commit('removeTagNav', data)
            resolve([...state.openedPageList])
        })
    },
    delOthersTagNavViews({ commit, state }, data) {
        return new Promise((resolve) => {
            commit('delOthersTagNav', data)
            resolve([...state.openedPageList])
        })
    },
    delAllTagNavViews({ commit, state }) {
        return new Promise((resolve) => {
            commit('tagNav/delAllTagNav', '', {root: true})
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