import Cookies from 'js-cookie'
import axios from '@/util/ajax'
import Auth from '@/util/auth'

//状态
const state = {
    token: Auth.getToken(),
    appKey:'',
    appSecret:'',
    userid:'',
    orgid:'',
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
            state.token = data.token
            state.appKey = data.appKey
            state.appSecret = data.appSecret
        } else {
            Auth.removeToken()

        }

    },
    setUserInfo: (state, data) => {
        if(data){
            Auth.setUserInfoData(data);
            Auth.setLoginStatus();

            state.userid = data.userInfo.PhId;
            state.orgid = data.orgInfo.PhId;

        }else{
            Auth.removeUserInfoData();
            Auth.removeLoginStatus();
        }

    }
}

//执行一些方法(异步)
const actions = {
    // 获取Token
    getToken({ commit, state },parameters) {
        return new Promise((resolve, reject) => {
            var params=new URLSearchParams();

            axios({
                url: '/SysUser/GetToken',
                method: 'get',
                data: params
            }).then(res => {

                let resultData = JSON.parse(res);

                if(resultData.Status!=="error"){
                    var object={
                        token:resultData.Token,
                        appKey:resultData.AppKey,
                        appSecret:resultData.AppSecret,
                    };
                    //用户信息缓存
                    commit('setToken', object)
                }

                resolve(res)
            })
        })
    },

    // 业务用户登录
    loginByPhone({ commit }, userInfo) {
        return new Promise((resolve) => {

            var params=new URLSearchParams();
            params.append('uname_login',userInfo.name);
            params.append('orgid',userInfo.orgid);
            params.append('password',userInfo.password);

            axios({
                url: '/SysUser/PostLogin',
                method: 'post',
                data: params
            }).then(res => {
                let resultData = JSON.parse(res);
                if(resultData.Status==="success"){


                    var user=resultData.Data;
                    //用户信息缓存
                    commit('setUserInfo', user)
                }
                resolve(resultData)
            })
        });
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            var params=new URLSearchParams();
            params.append('uid',state.userid);
            params.append('orgid',state.orgid);

            axios({
                url: '/SysUser/GetUserInfo',
                method: 'get',
                data: params
            }).then(res => {
                if(res.Status==="Success"){
                    //用户信息缓存
                    commit('setUserInfo', res.Data)
                }
                resolve(res)
            })
        })
    },

    // 退出
    logout({commit}) {
        return new Promise((resolve) => {
            commit('setToken', '')
            commit('setUserInfo', '')
            commit('tagNav/delAllTagNav')
            resolve()
        })
    },

    // 重新获取用户信息及Token
    // TODO: 这里不需要提供用户名和密码，实际中请根据接口自行修改
    relogin({dispatch, commit, state}){
        return new Promise((resolve) => {
            // 根据Token进行重新登录
            let token = Auth.getToken(),
                userName = '';

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
                url: '/SysUser/GetToken',
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
    getNavList({commit,state}){
        return new Promise((resolve) =>{
            var params=new URLSearchParams()
            params.append('uid',state.userid)
            params.append('orgid',state.orgid)

            axios({
                url: '/SysUser/GetSysMenuList',
                methods: 'get',
                data: params
            }).then((res) => {
                let resultData = JSON.parse(res);
                commit("setNavList", resultData)
                resolve(resultData)
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
