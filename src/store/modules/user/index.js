import Cookies from "js-cookie";
import axios from "@/util/ajax";
import Auth from "@/util/auth";


//状态
const state = {
    token: "",
    appKey: "",
    appSecret: "",
    //用户ID
    userid: "",
    //组织ID
    orgid: "",
    //左侧菜单权限
    navList: [],
    // 用户名
    username: ''    
};

//计算获取取新数据
const getters = {

};

//操作state(同步)
const mutations = {
    //菜单
    setNavList: (state, data) => {
        if (data) {
            state.navList = data;
            Auth.setMenuStatus(data);
        }else{
            Auth.removeMenuStatus();
        }
    },
    //token
    setToken: (state, data) => {
        if (data) {
            Auth.setToken(data);
            state.token = data.token;
            state.appKey = data.appKey;
            state.appSecret = data.appSecret;
        } else {
            Auth.removeToken();
        }
    },
    //用户信息 包括 userInfo orgInfo 
    setUserInfo: (state, data) => {
        if (data) {
            data.isLogin=true;
            Auth.setUserInfoData(data);

            state.userid = data.userInfo.PhId;
            state.orgid = data.orgInfo.PhId;
            state.username=data.userInfo.RealName;
        } else {
            Auth.removeUserInfoData();
        }
    }
};

//执行一些方法(异步)
const actions = {
    // 获取Token
    getToken({ commit, state }, parameters) {
        return new Promise((resolve, reject) => {
            
            axios({
                url: "/SysUser/GetToken",
                method: "get",
                params: {
                    token: ''
                }
            }).then(res => {
                if (res.Status !== "error") {
                    var object = {
                        token: res.Token,
                        appKey: res.AppKey,
                        appSecret: res.AppSecret
                    };
                    //用户信息缓存
                    commit("setToken", object);
                }

                resolve(res);
            });
        });
    },

    // 业务用户登录
    loginByPhone({ commit }, userInfo) {
        return new Promise(resolve => {

            axios({
                url: "/SysUser/PostLogin",
                method: "post",
                data: {
                    uname_login:userInfo.name,
                    orgid:userInfo.orgid,
                    password:userInfo.password
                }
            }).then(res => {

                if (res.Status === "success") {
                    var user = res.Data;
                    //用户信息缓存
                    commit("setUserInfo", user);
                }
                resolve(res);
            });
        });
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            axios({
                url: "/SysUser/GetUserInfo",
                method: "get",
                params: {
                    uid:state.userid,
                    orgid:state.orgid
                }
            }).then(res => {
                if (res.Status === "success") {
                    //用户信息缓存
                    commit("setUserInfo", res.Data);
                }
                resolve(res);
            });
        });
    },

    // 退出
    logout({ commit }) {

        return new Promise(resolve => {
            //清除缓存
            commit("setToken", "");  //token 
            commit("setUserInfo", ""); //用户信息
            commit('setNavList',''); //菜单
            commit('tagNav/removeTagNav', '', {root: true})
            resolve();
        });
    },

    // 重新获取用户信息及Token
    // TODO: 这里不需要提供用户名和密码，实际中请根据接口自行修改
    relogin({ dispatch, commit, state }) {
        return new Promise(resolve => {
            // 根据Token进行重新登录
            let tokenInfo = Auth.getToken(), 
            userInfo = Auth.getUserInfoData(),
            menuInfo = Auth.getMenuStatus();

            // 重新登录时校验Token是否存在，若不存在则获取
            if (!tokenInfo && !userInfo) {
                //token
                dispatch("getNewToken").then(() => {
                    //commit("setToken", state.token);
                });
                //用户
                dispatch("loginByPhone").then(() => {

                });

                //菜单
                dispatch("getNavList").then(() => {

                });

            } else {
                //设置用户 state ,重新加载用户缓存
                commit("setToken", tokenInfo);
                commit("setUserInfo", userInfo);
                if(menuInfo){
                    commit("setNavList", menuInfo);
                }
            }
            resolve();
        });
    },

    // 获取新Token
    getNewToken({ commit, state }) {
        return new Promise(resolve => {
            axios({
                url: "/SysUser/GetToken",
                method: "get",
                param: {
                    token: state.token
                }
            }).then(res => {
                commit("setToken", res.token);
                resolve();
            });
        });
    },

    // 获取该用户的菜单列表
    getNavList({ commit, state }) {
        return new Promise(resolve => {
            axios({
                url: "/SysUser/GetSysMenuList",
                methods: "get",
                params: {
                    uid:state.userid,
                    orgid:state.orgid
                }
            }).then(res => {

                commit("setNavList", res);
                resolve(res);
            });
        });
    },

    // 将菜单列表扁平化形成权限列表
    getPermissionList({ state }) {
        return new Promise(resolve => {
            let permissionList = [];
            // 将菜单数据扁平化为一级
            function flatNavList(arr) {
                for (let v of arr) {
                    if (v.child && v.child.length) {
                        flatNavList(v.child);
                    } else {
                        permissionList.push(v);
                    }
                }
            }
            flatNavList(state.navList);
            resolve(permissionList);
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
