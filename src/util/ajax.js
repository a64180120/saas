/**
 * axios全局配置
 * TODO: 拦截器全局配置，根据实际情况修改
 */
import axios from "axios";
import store from "../store";
import router from "../router";
import { Message,MessageBox } from "element-ui";
import Auth from "@/util/auth";
import md5 from "js-md5";
import qs from 'qs'

let Base64 = require("js-base64").Base64;

var getTokenLock = false,
    CancelToken = axios.CancelToken,
    requestList = [];

var appKey = "D31B7F91-3068-4A49-91EE-F3E13AE5C48C",
    appSecret = "103CB639-840C-4E4F-8812-220ECE3C4E4D",
    url = "http://10.0.20.46:8028",
    reqTimeStamp = Date.parse(new Date());
var sign = md5((url + reqTimeStamp + appKey + appSecret).toLowerCase());
var items = [sign, url, reqTimeStamp, appKey],
    appinfo_Object = {
        DbName: "NG0001",
        OrgId: "521180820000002",
        OrgName: "",
        OCode: "",
        UserId: "521180820000001",
        UserKey: "0001",
        UserName: "",
        TokenKey: "",
        AppKey: appKey,
        AppSecret: appSecret,
        DbServerName: "",
        SessionKey: "",
        UName: ""
    },
    appInfo = Base64.encode(JSON.stringify(appinfo_Object));

/**
 * Token校验
 * @param {function} cancel - 中断函数
 * @param {function} callback -  回调
 * @description 校验Token是否过期，如果Token过期则根据配置采用不同方法获取新Token
 *              自动获取Token：过期时自动调用获取Token接口。注意：当有任一请求在获取Token时，其余请求将顺延，直至新Token获取完毕
 *              跳转授权Token：过期时中断当前所有请求并跳转到对应页面获取Token。注意：跳转页面授权最佳实现应在授权页面点击触发
 */
function checkToken(cancel, callback) {
    if (!Auth.getToken()) {
        // 自动获取Token
        if (Auth.tokenTimeoutMethod == "getNewToken") {
            // 如果当前有请求正在获取Token
            if (getTokenLock) {
                setTimeout(function() {
                    checkToken(cancel, callback);
                }, 500);
            } else {
                getTokenLock = true;
                store.dispatch("user/getNewToken").then(() => {
                    console.log("已获取新token");
                    callback();
                    getTokenLock = false;
                });
            }
        }
        // 跳转授权Token
        if (
            Auth.tokenTimeoutMethod == "jumpAuthPage" &&
            Auth.getLoginStatus()
        ) {
            if (router.currentRoute.path != "/auth") {
                // BUG: 无法保证一定会中断所有请求
                cancel();
                router.push("/auth");
            }
        }
    } else {
        callback();
    }
}

/**
 * 阻止短时间内的重复请求
 * @param {string} url - 当前请求地址
 * @param {function} c - 中断请求函数
 * @description 每个请求发起前先判断当前请求是否存在于RequestList中，
 *              如果存在则取消该次请求，如果不存在则加入RequestList中，
 *              当请求完成后500ms时，清除RequestList中对应的该请求。
 */
function stopRepeatRequest(url, cancelfunction) {
    for (let i = 0; i < requestList.length; i++) {
        if (requestList[i] == url) {
            cancelfunction();
            return;
        }
    }
    requestList.push(url);
}

// 超时设置
const service = axios.create({
    baseURL: "http://10.0.20.46:8028/api/GCW",
    //baseURL:'http://10.0.45.51:8028/api/GCW',
    // 请求超时时间
    timeout: 5000
});

// baseURL
// axios.defaults.baseURL = 'http://10.0.45.51:8028/api/GCW';
// http request 请求拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
service.interceptors.request.use(
    config => {
        let cancel;
        config.cancelToken = new CancelToken(function executor(req) {
            cancel = req;
        });

        //POST传参序列化
        if (config.method === "post") {
            config.data = qs.stringify(config.data);
        }

        config.headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8 ",
            Accept: "application/json; charset=utf-8",
            AppInfo: appInfo,
            Sign: items
        };
        //Token校验
        // checkToken(cancel, function(){
        //     Auth.setLoginStatus()
        //     config.headers.Authorization = `${store.state.user.token}`
        // })
        //添加请求的url
        //stopRepeatRequest(config.url, cancel)
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

// http response 响应拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use(
    response => {
        const res = response.data
        // for( let i = 0; i < requestList.length; i++){
        //     //删除requestList里面请求的url
        //     if(requestList[i] == response.config.url){
        //         // 注意，不能保证500ms必定执行，详情请了解JS的异步机制
        //         setTimeout(function(){
        //             requestList.splice(i,1)
        //         }, 500)
        //         break
        //     }
        // }

        return Promise.resolve(JSON.parse(response.data));
    },
    error => {
        if (axios.isCancel(error)) {
            console.log(error);
            return Promise.reject("Ajax Abort: 该请求在axios拦截器中被中断");
        } else if (error.response) {
            switch (error.response.status) {
                case 401:
                    router.push("error/401");
                case 403:
                    router.push("error/403");
                default:
                    Message({
                        message: `服务器错误！错误代码：${
                            error.response.status
                        }`,
                        type: "error"
                    });
            }
            return Promise.reject(error.response.data);
        }
    }
);

export default service;
