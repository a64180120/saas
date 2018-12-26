<template>
    <div id="app" class="sys-app">
        <router-view></router-view>
    </div>
</template>

<script>
import setTheme from "@/util/setTheme"
import Cookie from 'js-cookie'
import Auth from "@/util/auth"


export default {
    created() {
        
    },
    // TODO: 全局状态加载及变更。请根据实际情况改写
    beforeMount(){
        // 首次加载/刷新时判断当前是否在登录状态
        var userinfo=Auth.getUserInfoData();
        if (userinfo) {
            console.log("重新加载缓存数据")
            //重新加载state状态
            this.$store.dispatch('user/relogin')
        }else{
            console.log("退出当前登录")
            this.$store.dispatch('user/logout')
        }
        // 加载默认语言包
        let defLang = Cookie.get('lang') || this.$i18n.locale
        this.$store.dispatch("loadLang", defLang)

    },
    // 初次加载时，可通过接口获取用户的主题信息，或者通过按钮触发，或者直接加载默认主题
    mounted() {
        this.$nextTick(() => {
            setTheme("theme-default")
            this.$store.commit("setThemeColor", "theme-default")

            this.getConfigJson(res=>{
                console.log('2');
                console.log(res)

            });

            //加载token信息
            if(!Auth.getToken()){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.$store.dispatch('user/getToken').then((res) => {
                    loading.close();
                    console.log(res)
                }).catch((error) =>{
                    loading.close();
                    alert('网络不通,请检查服务接口网络！.....')
                })
            }
        })
    }
}
</script>
<style>
    @import "../static/css/main.css";
    /* @import '../src/assets/css/icon/iconfont.css'; */
</style>