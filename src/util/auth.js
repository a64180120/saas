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

    // 获取Token
    getToken: function() {
        return Cookies.get(this.TokenKey)
    },

    // 设置Token
    setToken: function(token){
        // TODO: 设置token，并填写有效期
        var maxAge = new Date(new Date().getTime() + 30 * 1000)
        Cookies.set(this.TokenKey, token, {
            expires: maxAge
        })
    },

    // 移除Token
    removeToken: function(){
        Cookies.remove(this.TokenKey)
    },

    // 当前是否是登录状态
    getLoginStatus: function(){
        return Cookies.get(this.loginKey)
    },

    // 设置登录状态
    setLoginStatus: function(){
        // TODO: 设置超时登录时间，在该时间范围内没有任何请求操作则自动删除
        console.log("登录状态最长时间更新")
        var maxAge = new Date(new Date().getTime() + 30 * 60 * 1000)
        Cookies.set(this.loginKey, 'true', {
            expires: maxAge
        })
    },
    // 移除登录状态
    removeLoginStatus: function(){
        Cookies.remove(this.loginKey)
    },

    // 获取用户缓存信息
    getUserInfoData: function() {
        return Cookies.get(this.userinfo)
    },

    // 设置用户缓存信息
    setUserInfoData: function(data){
        var maxAge = new Date(new Date().getTime() + 30 * 60 * 1000)
        Cookies.set(this.userinfo, data, {
            expires: maxAge
        })
    },

    // 移除用户缓存信息 和 移除登录状态
    removeUserInfoData: function(){
        Cookies.remove(this.userinfo);
        Cookies.remove(this.loginKey);
    }
}

export default authToken