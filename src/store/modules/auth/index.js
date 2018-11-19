import Cookies from 'js-cookie'
import axios from '@/util/ajax'
import Auth from '@/util/auth'

//状态
const state = {
    token: '',
    appKey:'',
    appSecret:'',
    navList: []
}

//计算获取取新数据
const getters={

}

//操作state(同步)
const mutations = {
    setNavList: (state, data) => {
        state.navList = data
    },

    setToken: (state, data) => {
        if(data){
            Auth.setToken(data)
            Auth.setLoginStatus()
        } else {
            Auth.removeToken()
            Auth.removeLoginStatus()
        }
        state.token = data.token
        state.appKey = data.appKey
        state.appSecret = data.appSecret
    }
}

//执行一些方法(异步)
const actions = {
    //admin管理员用户登录
    adminloginByPhone({ commit }, userInfo) {
        //debugger;
        return new Promise((resolve) => {

           var params=new URLSearchParams();
           params.append('UserID',userInfo.UserID);
           params.append('UserPwd',userInfo.UserPwd)

            axios({
                url: '/SysAdminUser/PostLogin',
                method: 'post',
                data:params
            }).then(res => {
                // if(res.state){
                //     commit('setToken', '123')
                //     //commit('user/setName', res.name, { root: true })
                // }
                resolve(res)
            })

        });
    },
    // 业务用户登录
    loginByPhone({ commit }, userInfo) {
        return new Promise((resolve) => {

            var params=new URLSearchParams();
            params.append('uname',userInfo.name);
            params.append('orgid',userInfo.orgid);
            params.append('password',userInfo.password);

            axios({
                url: '/SysUser/PostLogin',
                method: 'post',
                data: params
            }).then(res => {
                if(res.Status==="Success"){
                    var object={ 
                        token:res.Status.Data.Token,
                        appKey:res.Status.Data.AppKey,
                        appSecret:res.Status.Data.AppSecret,
                    };

                    commit('setToken', object)
                    commit('user/setName', res.name, { root: true })
                }
                resolve(res)
            })
        });
    },

    // 登出
    logout({commit}) {
        return new Promise((resolve) => {
            commit('setToken', '')
            commit('user/setName', '', { root: true })
            commit('tagNav/removeTagNav', '', {root: true})
            resolve()
        })
    },

    // 重新获取用户信息及Token
    // TODO: 这里不需要提供用户名和密码，实际中请根据接口自行修改
    relogin({dispatch, commit, state}){
        return new Promise((resolve) => {
            // 根据Token进行重新登录
            let token = Cookies.get('token'),
                userName = Cookies.get('userName')

            // 重新登录时校验Token是否存在，若不存在则获取
            if(!token){
                dispatch("getNewToken").then(() => {
                    commit('setToken', state.token)
                })
            } else {
                commit('setToken', token)
            }
            // 刷新/关闭浏览器再进入时获取用户名
            commit('user/setName', decodeURIComponent(userName), { root: true })
            resolve()
        })
    },

    // 获取新Token
    getNewToken({commit, state}){
        return new Promise((resolve) => {
            axios({
                url: '/getToken',
                method: 'get',
                param: {
                    token: state.token
                }
            }).then((res) =>{
                commit("setToken", res.token)
                resolve()
            })
        })
    },

    // 获取该用户的菜单列表
    getNavList({commit}){
        return new Promise((resolve) =>{
            axios({
                url: '/user/navlist',
                methods: 'post',
                data: {}
            }).then((res) => {
                commit("setNavList", res)
                resolve(res)
            })
        })
    },

    // 将菜单列表扁平化形成权限列表
    getPermissionList({state}){
        return new Promise((resolve) =>{
            let permissionList = []
            // 将菜单数据扁平化为一级
            function flatNavList(arr){
                for(let v of arr){
                    if(v.child && v.child.length){
                        flatNavList(v.child)
                    } else{
                        permissionList.push(v)
                    }
                }
            }
            flatNavList(state.navList)
            resolve(permissionList)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}