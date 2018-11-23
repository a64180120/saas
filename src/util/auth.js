import Cookies from 'js-cookie'

const authToken = {
    // 当Token超时后采取何种策略
    // jumpAuthPage  每次请求时判断Token是否超时，若超时则跳转到登录页面
    // getNewToken  每次请求时判断Token是否超时，若超时则获取新Token (推荐)
    tokenTimeoutMethod: 'getNewToken',
    
    // 在Cookie中记录缓存的key
    loginKey: 'isLogin',
    //用户缓存信息
    userinfo:'user',
    //token 缓存的key
    TokenKey:'token',

    getCookies:function(key){
        let item=Cookies.get(key);
        // 这点要判断是字符串还是对象
        let result = /^[{\[].*[}\]]$/g.test(item)
        if (result) {
            return JSON.parse(item)
        } else {
            return item
        }
    },

    setCookies:function(key,data){
        var maxAge = new Date(new Date().getTime() + 60 * 60 * 1000)
        
        // 这点要判断是字符串还是对象
        if (typeof data == "string") {
            Cookies.set(key, data, { expires: maxAge })
        } else {
            let item = JSON.stringify(data)
            Cookies.set(key, item, { expires: maxAge })
        }
    },

    // 获取Token
    getToken: function() {

        return this.getCookies(this.TokenKey)
    },

    // 设置Token
    setToken: function(token){

        this.setCookies(this.TokenKey,token);
    },

    // 移除Token
    removeToken: function(){
        Cookies.remove(this.TokenKey)
    },

    // 当前是否是登录状态
    getLoginStatus: function(){
        return this.getCookies(this.loginKey)
    },

    // 设置登录状态
    setLoginStatus: function(){

        this.setCookies(this.loginKey,'true');
    },
    // 移除登录状态
    removeLoginStatus: function(){
        Cookies.remove(this.loginKey)
    },

    // 获取用户缓存信息
    getUserInfoData: function() {

        return this.getCookies(this.userinfo)
    },

    // 设置用户缓存信息
    setUserInfoData: function(data){

        this.setCookies(this.userinfo,data);
    },

    // 移除用户缓存信息 和 移除登录状态
    removeUserInfoData: function(){
        Cookies.remove(this.userinfo);
        Cookies.remove(this.loginKey);
    }
}

export default authToken