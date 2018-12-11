import md5 from 'js-md5'
let Base64 = require("js-base64").Base64;

const ajaxMode = {
  //网站api的地址
    // url:"http://10.0.13.52:8028",
    //   url:"http://10.0.20.46:8028",
     url:"http://10.0.15.3:8028",
  dbname:"NG0001",

  getAxiosConfig:function(){
    var appKey = "D31B7F91-3068-4A49-91EE-F3E13AE5C48C",
        appSecret = "103CB639-840C-4E4F-8812-220ECE3C4E4D",
        url = this.url,
        reqTimeStamp = Date.parse(new Date());
    var sign = md5((url + reqTimeStamp + appKey + appSecret).toLowerCase());
    var items = [sign, url, reqTimeStamp, appKey],
        appinfo_Object = {
            DbName: this.dbname,
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

    var baseconfig= {
        baseURL: this.url+"/api/GCW",
        // 请求超时时间
        timeout: 5000
    };

    var headerconfig={
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'Accept': "application/json; charset=utf-8",
        'AppInfo': appInfo,
        'Sign':items[0]+','+items[1]+','+items[2]+','+items[3]
    };

    return {header:headerconfig,base:baseconfig,url:url};
  }
}

export default ajaxMode.getAxiosConfig()
