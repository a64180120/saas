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
    setNavList: (state, data) => {
        state.navList = data;
    },

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
    setUserInfo: (state, data) => {
        if (data) {
            Auth.setUserInfoData(data);
            Auth.setLoginStatus();

            state.userid = data.userInfo.PhId;
            state.orgid = data.orgInfo.PhId;
            state.username=data.userInfo.RealName;
        } else {
            Auth.removeUserInfoData();
            Auth.removeLoginStatus();
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
                let resultData = JSON.parse(res);

                if (resultData.Status !== "error") {
                    var object = {
                        token: resultData.Token,
                        appKey: resultData.AppKey,
                        appSecret: resultData.AppSecret
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
                let resultData = JSON.parse(res);
                if (resultData.Status === "success") {
                    var user = resultData.Data;
                    //用户信息缓存
                    commit("setUserInfo", user);
                }
                resolve(resultData);
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
            commit("setToken", "");
            commit("setUserInfo", "");
            commit('tagNav/removeTagNav', '', {root: true})
            resolve();
        });
    },

    // 重新获取用户信息及Token
    // TODO: 这里不需要提供用户名和密码，实际中请根据接口自行修改
    relogin({ dispatch, commit, state }) {
        return new Promise(resolve => {
            // 根据Token进行重新登录
            let tokenInfo = Auth.getToken(), userInfo = Auth.getUserInfoData();

            // 重新登录时校验Token是否存在，若不存在则获取
            if (!tokenInfo && !userInfo) {
                dispatch("getNewToken").then(() => {
                    //commit("setToken", state.token);
                });

                dispatch("loginByPhone").then(() => {
                    //commit("setToken", state.token);
                });

            } else {
                //设置用户 state ,重新加载用户缓存
                commit("setToken", tokenInfo);
                commit("setUserInfo", userInfo);
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
                let resultData = JSON.parse(res);
                commit("setNavList", resultData);
                resolve(resultData);
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
