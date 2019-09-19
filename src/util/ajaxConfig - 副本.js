
import md5 from 'js-md5'
import Auth from "@/util/auth";
let Base64 = require("js-base64").Base64;

const AxiosHeader = {
    //网站api的地址
     // baseurl:"http://10.0.45.46:8028",

    //baseurl:"http://10.0.20.46:8028",
    //baseurl:"http://10.0.45.51:8028",
   baseurl:"http://10.0.13.52:8028",
    //baseurl:"http://10.0.26.183/custom",
    //baseurl:"http://192.168.20.226/custom",
    //baseurl:"http://192.168.21.246/Custom",   //baseurl:process.env.API_ROOT||'',
    // baseurl:window.global.baseUrl,
    //数据库
    //dbname:'NG0004',

    userkey:'admin',

    /**
     * 登录获取 ajax headers的appinfo信息
     * @param {*} object
     * object.orgid 组织id
     * object.userid 用户id
     * object.accoun 用户账号
     * object.appKey  appKey
     * object.appSecret  appSecret
     */
    getAppInfoLogin:function(object,dbbase){
        var token=Auth.getToken();

        var appinfo_Object = {
                DbName: dbbase||token.dbname,
                OrgId: object.orgid,
                OrgName: "",
                OCode: "",
                UserId: object.userid,
                UserKey: "",
                UserName: "",
                TokenKey: "",
                AppKey: token.appKey,
                AppSecret: token.appSecret,
                DbServerName: "",
                SessionKey: "",
                UName: ""
            },
            appInfo = Base64.encode(JSON.stringify(appinfo_Object));

        return appInfo;
    },
    /**
     * 获取 ajax headers的Sign信息
     */
    getSign:function(dbbase){
        var token=Auth.getToken();
        var appKey = token.appKey,
            appSecret = token.appSecret,
            url = this.baseurl,
            reqTimeStamp = Date.parse(new Date()),
            sign = md5((url + reqTimeStamp + appKey + appSecret).toLowerCase());

        var items = [sign, url, reqTimeStamp, appKey,dbbase];

        return items[0]+','+items[1]+','+items[2]+','+items[3]+','+items[4];
    },
    /**
     * 获取 ajax headers的AppInfo信息
     */
    getAppInfo:function(dbbase){
        var info=Auth.getUserInfoData();
        var obejct={
            orgid:info.orgInfo.PhId,
            userid:info.userInfo.PhId,
            accoun:info.userInfo.Account
        }

        return this.getAppInfoLogin(obejct,dbbase);
    },
    /**
     * 获取测试头的信息
     */
    getTestHeaderConfig:function(dbbase){
        var appKey = "D31B7F91-3068-4A49-91EE-F3E13AE5C48C",
            appSecret = "103CB639-840C-4E4F-8812-220ECE3C4E4D",
            url = this.baseurl,
            reqTimeStamp = Date.parse(new Date());
        var token=Auth.getToken();
        var sign = md5((url + reqTimeStamp + appKey + appSecret).toLowerCase());
        var items = [sign, url, reqTimeStamp, appKey,dbbase],
            appinfo_Object = {
                DbName: dbbase||token.dbname,
                OrgId: "547181121000001",
                OrgName: "",
                OCode: "",
                UserId: "631181115000001",
                UserKey: "",
                UserName: "",
                TokenKey: "",
                AppKey: appKey,
                AppSecret: appSecret,
                DbServerName: "",
                SessionKey: "",
                UName: ""
            },
            appInfo = Base64.encode(JSON.stringify(appinfo_Object));

        var config={
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            'Accept': "application/json;",
            'AppInfo': appInfo,
            'Sign':items[0]+','+items[1]+','+items[2]+','+items[3]+','+items[4]
        };

        return config;
    },
    /**
     * 获取头部信息
     */
    getHeaderConfig:function(dbbase){
        var config={
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            'Accept': "application/json;",
            'AppInfo': this.getAppInfo(dbbase),
            'Sign':this.getSign(dbbase)
        };

        return config;
    },
    /**
     * 获取Axios基本配置信息
     */
    getAxiosBaseConfig:function(){
        var config= {
            baseURL: this.baseurl +"/api/GCW",
            // 请求超时时间
            timeout: 10000
        };

        return config;
    },
    /**
     * 获取Axios基本配置信息,不存在时间控制
     */
    getAxiosBaseConfigUncontrol:function(){
        var config= {
            baseURL: this.baseurl+"/api/GCW"
        };
        return config;
    }
}

export default AxiosHeader
