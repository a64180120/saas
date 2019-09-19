/**
 * axios全局配置
 * TODO: 拦截器全局配置，根据实际情况修改
 */
import axios from "axios";
import store from "../store";
import router from "../router";
import { Message,MessageBox } from "element-ui";
import Auth from "@/util/auth";
import httpConfig from '@/util/ajaxConfig'
import qs from 'qs'



var getTokenLock = false,
    CancelToken = axios.CancelToken,
    requestList = [];

/**
 * Token校验
 * @param {function} cancel - 中断函数
 * @param {function} callback -  回调
 * @description 校验Token是否过期，如果Token过期则根据配置采用不同方法获取新Token
 *              自动获取Token：过期时自动调用获取Token接口。注意：当有任一请求在获取Token时，其余请求将顺延，直至新Token获取完毕
 *              跳转授权Token：过期时中断当前所有请求并跳转到对应页面获取Token。注意：跳转页面授权最佳实现应在授权页面点击触发
 */
function checkToken(cancel, callback) {
    var token_Cookies=Auth.getToken();
    if (!token_Cookies) {

        // 如果当前有请求正在获取Token
        if (getTokenLock) {
            setTimeout(function() {
                checkToken(cancel, callback);
            }, 500);
        } else {
            getTokenLock = true;
            store.dispatch("user/getToken").then(() => {
                console.log("已获取新token");
                callback();
                getTokenLock = false;
            }).catch((error)=>{
                console.log(error);
                getTokenLock = false;
            });
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


//let base=httpConfig.getAxiosBaseConfig();

// 超时设置
const service = axios.create({
    baseURL: httpConfig.getAxiosBaseConfig().baseURL,
    // 请求超时时间
    timeout: 20000
    // transformRequest:[function transformRequest(data, headers) {      
    //     /* 把类似content-type这种改成Content-Type */
    //     let keys = Object.keys(headers);
    //     let normalizedName = 'Content-Type';
    //     keys.forEach(name => {
    //         if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
    //             headers[normalizedName] = headers[name];
    //             delete headers[name];
    //         }
    //     });
    // }]
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

        //let config_header = { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" };
        //var new_header = Object.assign({},config_header, baseheader);  //合并对象

        //默认区域数据库
        var dbbase=store.state.user.dbname;
        //defultdbname：true 是，转换数据库 未默认数据库
        if(config.method.toUpperCase()==="GET"){
            // 

            if(config.params===undefined){
                config.params={};
            }
            if(config.params.defultdbname===true){
                dbbase=store.state.user.defultdbname;
                delete config.params.defultdbname;
            }
            config.params.nowTimeRandom = new Date().getTime();
        }
        if(config.method.toUpperCase()==="POST"){
            if(config.data ===undefined){
                config.data={};
            }
            if(config.data.defultdbname===true){
                dbbase=store.state.user.defultdbname;
                delete config.data.defultdbname;
            }

            config.data.nowTimeRandom=new Date().getTime();
             //POST传参序列化
            config.data = qs.stringify(config.data);
        }

        //console.log(config.url+":"+dbbase);
        let baseheader=httpConfig.getTestHeaderConfig(dbbase);
        config.headers = baseheader;

        
       
        // if (config.method === "post") {
        //     config.data = qs.stringify(config.data);
        // }

        //Token校验
        // checkToken(cancel, function(){
        //     var token=Auth.getToken();
        //     console.log(token);
        //     //config.headers.Authorization = `${store.state.user.token}`
        // })
        // ;
        //添加请求的url
        //stopRepeatRequest(config.baseURL+config.url, cancel)

        return config;
    },
    err => {
        Message.error({message: '请求超时!'});
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

        //return Promise.resolve(JSON.parse(res.replace(/\n/g,"\\n").replace(/\r/g,"\\r")));

        if(typeof(res)=="object" && Object.prototype.toString.call(res).toLowerCase()=="[object object]" && !res.length){
          
            return Promise.reject(res);
  
          }else{
  
            var jsonStr=res.replace(/\n/g,"\\n").replace(/\r/g,"\\r");
            return Promise.resolve(JSON.parse(jsonStr));
            
          }

    },
    error => {
        if (axios.isCancel(error)) {
            console.log(error);
            return Promise.reject("Ajax Abort: 该请求在axios拦截器中被中断");
        } else if (error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '请求错误'
                    break;
                case 401:
                    router.push("error/401");
                case 403:
                    router.push("error/403");
                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`
                    break
                case 500:
                    error.message = '服务器内部错误'
                    break
                case 501:
                    error.message = '服务未实现'
                    break
                case 502:
                    error.message = '网关错误'
                    break
                case 503:
                    error.message = '服务不可用'
                    break
                case 504:
                    error.message = '网关超时'
                    break
                case 505:
                    error.message = 'HTTP版本不受支持'
                    break
                default:
                    Message({message: `服务器错误！错误代码：${error.response.status}`,type: "error" });
            }

            const obj = error.response.data
            //return Promise.reject(JSON.parse(error.response.data));

            //return Promise.reject(JSON.parse(res.replace(/\n/g,"\\n").replace(/\r/g,"\\r")));

            if(typeof(obj)=="object" && Object.prototype.toString.call(obj).toLowerCase()=="[object object]" && !obj.length){
              
              return Promise.reject(obj);
    
            }else{
    
              const res = obj.replace(/\n/g,"\\n").replace(/\r/g,"\\r")
              return Promise.reject(JSON.parse(res));
    
            }

        }
    }
);

export default service;
