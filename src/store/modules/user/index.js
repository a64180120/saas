import Cookies from "js-cookie";
import axios from "@/util/ajax";
import Auth from "@/util/auth";
import httpajax from "axios";
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import qs from 'qs'
import { uuid } from "@/util/validate";


//状态
const state = {
    token: "",
    appKey: "",
    appSecret: "",
    //用户ID
    userid: "",
    //组织ID
    orgid: "",
    //组织代码
    orgcode:'',
    //组织名称
    orgName:'',
    //左侧菜单权限
    navList: [],
    // 用户名
    username: '',
    //EmpowerInfo 判断是否是试用用户
    EmpowerInfo:'',
    //登录的ID
    sessionId:'',
    //该用户可用的邀请码
    invitationCode:'',
    //开始记账时间
    startYear:''
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
        } else {
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
            state.sessionId=data.sessionId;
        } else {
            Auth.removeToken();
        }
    },
    //用户信息 包括 userInfo orgInfo
    setUserInfo: (state, data) => {

        if (data && typeof data === 'object') {
            data.isLogin=true;
            Auth.setUserInfoData(data);

            state.userid = data.userInfo.PhId;
            state.orgid = data.orgInfo.PhId;
            state.orgcode = data.orgInfo.EnCode;
            state.orgName = data.orgInfo.OrgName;
            state.startYear = data.orgInfo.StartYear;
            state.username=data.userInfo.RealName;
            state.EmpowerInfo=data.orgInfo.EmpowerInfo;
            state.invitationCode=data.orgInfo.InvitationCode;
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
            console.log('window.global:'+window.global.baseUrl)
            let base=httpConfig.getAxiosBaseConfig();
            let url=httpConfig.baseurl;
            
            httpajax.create({
                baseURL: base.baseURL
            }).get('/SysToken/GetToken',{
                params: {
                    token: 'g6c'
                },
                headers:{
                    'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                    'Accept': "application/json; charset=utf-8"
                }
            }).then(res => {
                if (res.status === 200) {
                    var response=JSON.parse(res.data);
                    var object = {
                        token: response.Token,
                        appKey: response.AppKey,
                        appSecret: response.AppSecret,
                        sessionId:uuid()
                    };
                    //用户信息缓存
                    commit("setToken", object);
                }else{
                    alert('网络不通:'+ url +',请检查服务接口网络！.....')
                }

                resolve(res);

        　　}).catch((error) =>{
                console.log(error)
                //错误
                reject(error);
            });
        });
    },

    // 业务用户登录
    loginByPhone({ commit,dispatch }, userInfo) {
        return new Promise((resolve, reject) => {

            let base=httpConfig.getAxiosBaseConfig();
            //测试的Header
            let headconfig=httpConfig.getTestHeaderConfig();
            var token=Auth.getToken();

            var data={
                uname_login:userInfo.name,
                orgid:userInfo.orgid,
                password:userInfo.password,
                sessionId:token.sessionId||''
            };

            //重新登录，清除所有缓存
            //Auth.removeMenuStatus();
            //Auth.removeUserInfoData();

            httpajax.create(base)({
                url: "/SysUser/PostLogin",
                method: "post",
                data: qs.stringify(data),
                headers:headconfig
            }).then(res => {
                var response=JSON.parse(res.data);
                if (response.Status === "success") {
                    var user = response.Data;
                    commit("setUserInfo", user);

                    //加载菜单信息
                    var param={
                        userid:user.userInfo.PhId,
                        orgid:user.orgInfo.PhId
                    };
                    dispatch('getNavList', param).then((navList) => {
                        var data= navList||[];
                        //数据序列化
                        commit("setNavList", data);
                        resolve(response);
                    })
                }else{
                    resolve(response);
                }
               
            }).catch(error =>{
                console.log(error)
                reject(error)
            });
        });
    },
    // 验证码信息
    GetVerifycode({ commit, state },params) {
        return new Promise((resolve, reject) => {
            let base=httpConfig.getAxiosBaseConfig();

            httpajax.create({
                baseURL: base.baseURL
            }).get('/SysToken/GetSecurityCode',{
                params: params
                // headers:{
                //     'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                //     'Accept': "application/json; charset=utf-8"
                // }
            }).then(res => {

                resolve(res);

        　　}).catch((error) =>{
                console.log(error)
                //错误
                reject(error);
            });
        });
    },
    // 获取当前用户的组织信息
    GetOrgByUser({ commit, state }, parameters) {
        return new Promise((resolve, reject) => {
            let base=httpConfig.getAxiosBaseConfig();
            //测试的Header
            let headconfig=httpConfig.getTestHeaderConfig();

            httpajax.create(base)({
                url: "/SysUser/PostOrgByUNameOrUPhone",
                method: "post",
                data: qs.stringify(parameters),
                headers:headconfig
            }).then(res => {
                var response=JSON.parse(res.data);
                resolve(response);
            }).catch(error =>{
                console.log(error)
                reject(error)
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
                console.log('用户缓存信息');
                console.log(res)
                if (res.Status === "success") {
                    //用户信息缓存
                    commit("setUserInfo", res.Data);
                }
                resolve(res);
            }).catch(error =>{
                console.log(error)
                reject(error)
            });
        });
    },

    // 退出
    logout({ commit }) {

        return new Promise(resolve => {
            //清除缓存
            //commit("setToken", "");  //token
            commit("setUserInfo", ""); //用户信息
            commit('setNavList',''); //菜单
            //若需要在全局命名空间内分发 action 或提交 mutation，将 { root: true } 作为第三参数传给 dispatch 或 commit 即可
            commit('tagNav/delAllTagNav', '', {root: true})

            //清除配置文件
            commit('Pconfig/setPConfig', '', {root: true})

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
            menuInfo = Auth.getMenuStatus(),
            config = Auth.getPConfigStatus();

            // 重新登录时校验Token是否存在，若不存在则获取

            //token
            if(tokenInfo){
                //设置用户 state ,重新加载用户缓存
                commit("setToken", tokenInfo);
            }
            //用户
            if(userInfo){
                //设置用户 state ,重新加载用户缓存
                commit("setUserInfo", userInfo);
            }
            //菜单
            if(menuInfo){
                //设置用户 state ,重新加载用户缓存
                commit("setNavList", menuInfo);
            }

            //配置信息
            if(config){
                //设置用户 state ,重新加载用户缓存
                commit("Pconfig/setPConfig", config,{root: true});
            }
            resolve();
        });
    },

    // 获取该用户的菜单列表
    getNavList({ commit, state },data) {
        return new Promise((resolve, reject) => {
            //let base=httpConfig.getAxiosBaseConfig();
            //测试的Header
            //let headconfig=httpConfig.getTestHeaderConfig();

            axios({
                url: "/SysMenu/GetMenuList",
                methods: "get",
                params: {
                    uid:data.userid ||state.userid,
                    orgid:data.orgid ||state.orgid
                }
            }).then(res => {
                //var response=JSON.parse(res.data);
                resolve(res);
            }).catch(error =>{
                console.log(error)
                reject(error)
            });
        });
    },

    // 将菜单列表扁平化形成权限列表
    getPermissionList({ commit,state },data) {
        return new Promise(resolve => {
            let permissionList = [];
            // 将菜单数据扁平化为一级
            function flatNavList(arr) {
                for (let v of arr) {
                    if (v.child && v.child.length) {
                        flatNavList(v.child);
                    } else {
                        if(v.path){
                            permissionList.push(v);
                        }
                    }
                }
            }

            flatNavList(data);
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
