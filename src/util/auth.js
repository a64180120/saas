import Cookies from 'js-cookie'
import { setStore, getStore, removeStore } from '@/util/storage'

const authToken = {
    // 当Token超时后采取何种策略
    // jumpAuthPage  每次请求时判断Token是否超时，若超时则跳转到登录页面
    // getToken  每次请求时判断Token是否超时，若超时则获取新Token (推荐)
    tokenTimeoutMethod: 'getToken',
    // 在Cookie中记录缓存的key
    //loginKey: 'isLogin',
    //用户缓存信息
    userinfo:'user',
    //token 缓存的key
    TokenKey:'token',
    //菜单权限
    menuKey:'menus',

    zwcnfig:'zwcnfig',

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

    /*******************Token************************** */
    // 获取Token
    getToken: function() {

        //return this.getCookies(this.TokenKey)
        return  getStore({ name: this.TokenKey, type: 'session' })
    },

    // 设置Token
    setToken: function(token){

        //Cookies.remove(this.TokenKey)
        //this.setCookies(this.TokenKey,token);
        if(token){ removeStore({ name: this.TokenKey });}
        setStore({ name: this.TokenKey,content: token,type: 'session' })
    },

    // 移除Token
    removeToken: function(){
        //Cookies.remove(this.TokenKey)
        removeStore({ name: this.TokenKey })
    },

     /*******************UserInfo************************** */

    // 获取用户缓存信息
    getUserInfoData: function() {

        //return this.getCookies(this.userinfo)
        return  getStore({ name: this.userinfo,type: 'session' })
    },

    // 设置用户缓存信息
    setUserInfoData: function(data){

        //this.setCookies(this.userinfo,data);
        if(data){ removeStore({ name: this.userinfo });}
        setStore({ name: this.userinfo,content: data,type: 'session' })
    },

    // 移除用户缓存信息 和 移除登录状态
    removeUserInfoData: function(){
        //Cookies.remove(this.userinfo);
        removeStore({ name: this.userinfo })
    },

    /*******************Menu************************** */
    // 当前是菜单
    getMenuStatus: function(){
        //return this.getCookies(this.menuKey)
        return  getStore({ name: this.menuKey,type: 'session' })
    },

    // 设置菜单缓存
    setMenuStatus: function(data){
        //this.setCookies(this.menuKey,data);
        if(data){ removeStore({ name: this.menuKey });}
        setStore({
            name: this.menuKey,
            content: data,
            type: 'session'
        })
    },
    // 移除菜单缓存
    removeMenuStatus: function(){
        //Cookies.remove(this.menuKey)
        removeStore({
            name: this.menuKey
        })
    },

    /*******************PConfig************************** */

    // 获取财务配置信息
    getPConfigStatus: function(){
        return  getStore({ name: this.zwcnfig ,type: 'session' })
    },
    // 设置当前账务配置信息
    setPConfigStatus: function(data){
        if(data){ removeStore({ name: this.zwcnfig });}
        setStore({ name: this.zwcnfig, content: data, type:'session'})
    },
    // 移除当前账务配置信息
    removePConfigStatus: function(){
        removeStore({ name: this.zwcnfig })
    },

    /*******************webapi url************************** */
    // 获取本地的url，缓存到session中
    getBaseUrl: function(){
        //return this.getCookies('web_baseurl')
        return  getStore({ name: 'web_baseurl' })
    },
    //
    setBaseUrl: function(data){
        //this.setCookies('web_baseurl',data);
        if(data){ removeStore({ name: 'web_baseurl' });}
        setStore({ name: 'web_baseurl', content: data})
    },
    //
    removeBaseUrl: function(){
        //Cookies.remove('web_baseurl')
        removeStore({ name: 'web_baseurl'})
    }

}

export default authToken
