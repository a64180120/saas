import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Message } from "element-ui";
import Auth from '@/util/auth'
import store from "../store";
import staticRoute from "./staticRoute";
import whiteList from "./whiteList";
import httpConfig from '@/util/ajaxConfig';
import httpajax from "axios";
import { mapState, mapActions } from 'vuex'
//import Cookies from "js-cookie";

//后台数据库获取的路由信息
var permissionList = [];
var iserror=false;

function initRoute(router,menu) {
    return new Promise(resolve => {
        if (permissionList.length == 0) {
            store.dispatch("user/getPermissionList",menu).then(res => {
                permissionList = res;
                res.forEach(function(v) {
                    var path=v.path||'';
                    let routeItem = router.match(path);
                    if (routeItem) {
                        routeItem.meta.permission = v.permission? v.permission: [];
                        routeItem.meta.name = v.name;
                    }
                });
                resolve();
            });
        } else {
            resolve();
        }
    });
}

//获取token信息
function checkToken(callback) {

    var token_Cookies=Auth.getToken();
    if (!token_Cookies || token_Cookies.Status=='error') {
        store.commit('updateLoadingStatus', { isLoading: true })
        //如果当前有请求正在获取Token
        store.dispatch("user/getToken").then(() => {
            iserror=false;
            store.commit('updateLoadingStatus', { isLoading: false })
            callback();
        }).catch((error)=>{
            iserror=true;
            store.commit('updateLoadingStatus', { isLoading: false })
            callback();

        });

    } else {
        iserror=false;
        callback();
    }
}

NProgress.configure({ showSpinner: false });

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    //mode: "history",
    routes: staticRoute
});

// 路由跳转前验证(全局守卫)
router.beforeEach((to, from, next) => {

    // 开启进度条
    NProgress.start();
    // 判断用户是否处于登录状态
    let userinfo=Auth.getUserInfoData(),
        menuInfo = Auth.getMenuStatus(),
        token_Cookies=Auth.getToken();

        if(menuInfo !== null && typeof menuInfo === 'object'){
            if(menuInfo.Status=='error'){
                menuInfo=undefined;
            }
        }

        if(userinfo !== null && typeof userinfo === 'object'){
            if(userinfo.Status=='error'){
                userinfo=undefined;
            }
        }

    if(to.path === "/error"){
        next();
    }
    if(to.path === "/budgetcount"){
        store.commit('updateRouterToBudgetcount',true)
        NProgress.done();
        return;
    }
    if(to.path === "/reportcount"){
        store.commit('updateRouterToReportcount',true)
        NProgress.done();
        return;
    }
    checkToken(function(){

        if(iserror){
            next({ path: "/error", replace: true });
        }
        // if (userinfo && menuInfo && token_Cookies) {
        if (userinfo  && token_Cookies) {
            // 如果当前处于登录状态，并且跳转地址为login，则自动跳回系统首页
            // 这种情况出现在手动修改地址栏地址时
            if (to.path === "/login") {
                let base = httpConfig.getAxiosBaseConfig();
                let headconfig = httpConfig.getTestHeaderConfig(Auth.getToken().dbname);
                httpajax.create(base)({
                    method: 'get',
                    url: '/SysRole/GetDefaultPageByRoles',
                    params: {
                        userId:Auth.getUserInfoData().userInfo.PhId,
                        orgId:Auth.getUserInfoData().orgInfo.PhId
                    },
                    headers: headconfig
                }).then(res => {
                    let data = JSON.parse(res.data);
                    if (data.UrlAddress == null || data.UrlAddress == '') {
                        next({ path: "/error", replace: true });
                    } else {
                        next({ path: data.UrlAddress, replace: true });
                    }
                }).catch(err => {
                    console.log(err);
                })
                NProgress.done(); // 结束Progress
                //next({ path: "/home", replace: true });
            } else if (to.path.indexOf("/error") >= 0) {
                // 防止因重定向到error页面造成beforeEach死循环
                next();
            } else {
                initRoute(router,menuInfo).then(() => {
                    let isPermission = true;
                    if (to.meta.requireAuth) {
                        if (to.meta.type == "page") {
                            permissionList.forEach(v => {
                                // 判断跳转的页面是否在权限列表中
                                if (v.path == to.fullPath) {
                                    isPermission = true;
                                }
                            });
                        } else if (to.meta.type == "button") {
                            isPermission = true;
                        }
                    } else {
                        //不需要权限判断，直接打开
                        isPermission = true;
                    }

                    // 没有权限时跳转到401页面
                    if (!isPermission) {
                        next({ path: "/error/401", replace: true });
                    } else {
                        next();
                    }
                });
            }
        } else {
            // 如果是免登陆的页面则直接进入，否则跳转到登录页面
            if (whiteList.indexOf(to.path) >= 0) {
                next();
            } else {
                next({ path: "/login", replace: true });
                // 如果store中有token，同时Cookie中没有登录状态
                // if (store.state.user.token) {
                //     Message({
                //         message: "登录超时，请重新登录"
                //     });
                // }
                NProgress.done();
            }
        }

    });

});
router.afterEach(() => {

    NProgress.done(); // 结束Progress

});

export default router;
