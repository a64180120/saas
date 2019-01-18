<template>
    <div id="app" class="sys-app">
        <router-view></router-view>
        <loading v-show="isLoading"></loading>
    </div>
</template>

<script>
import setTheme from "@/util/setTheme"
import Cookie from 'js-cookie'
import Auth from "@/util/auth"
import { mapState } from 'vuex'
import loading from '@/components/loading'


export default {
    data() {
        return {
            islogout:false,
            interval:''
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading
        }),
        userid:function(){
            return this.$store.state.user.userid
        }
    },
    watch: {
        "islogout":{
            handler: function (val, oldVal) {
               if(val!==oldVal){
                    this.$alert('当前用户在别处登录', '提示', {
                        confirmButtonText: '退出',
                        callback: action => {
                            clearInterval(this.interval);//停止
                            this.$store.dispatch('user/logout');
                            this.$router.push("/login");

                        }
                    });
               }
            },
            deep: true
        },
        "isLoading":{
            handler:function (val, oldVal){
                if(val!==oldVal){
                    console.log(val)
                }
            },
            deep: true
        }
    },
    components: {
      loading
    },
    created() { },
    // TODO: 全局状态加载及变更。请根据实际情况改写
    beforeMount(){
        // 首次加载/刷新时判断当前是否在登录状态
        var userinfo=Auth.getUserInfoData(),
            menuInfo = Auth.getMenuStatus();

        if (userinfo && menuInfo && userinfo.Status !=='error' && menuInfo.Status !=='error') {
            console.log("重新加载缓存数据")
            //重新加载state状态
            this.$store.dispatch('user/relogin')
        }else{
            console.log("退出当前登录")
            this.$store.dispatch('user/logout')
        }
        // 加载默认语言包
        //let defLang = Cookie.get('lang') || this.$i18n.locale
        //this.$store.dispatch("loadLang", defLang)

    },
    // 初次加载时，可通过接口获取用户的主题信息，或者通过按钮触发，或者直接加载默认主题
    mounted() {
        this.$nextTick(() => {
            setTheme("theme-default")
            this.$store.commit("setThemeColor", "theme-default")

            // this.getConfigJson(res=>{
            //     console.log(Auth.getBaseUrl())

            // });

            //加载token信息
            // if(!Auth.getToken()){
            //     console.log('获取token信息');
            //     const loading = this.$loading({
            //         lock: true,
            //         text: 'Loading',
            //         spinner: 'el-icon-loading',
            //         background: 'rgba(0, 0, 0, 0.7)'
            //     });
            //     this.$store.dispatch('user/getToken').then((res) => {
            //         loading.close();
            //         console.log(res)
            //     }).catch((error) =>{
            //         loading.close();
            //         alert('网络不通,请检查服务接口网络！.....')
            //     })
            // }

        })
        //测试可以注释这条
        //this.getloginState();
    },
    methods: {
        //循环判断，当前用户的登录状态
        getloginState(){
            var me=this;
            this.interval = window.setInterval(() => {
                setTimeout(() => {
                    var user=Auth.getUserInfoData(),
                        token=Auth.getToken();
                    if(user && token){
                        console.log(user.userInfo.PhId);
                        console.log(token.sessionId);
                        //let userid=user.userInfo.PhId

                        me.$axios.get('/SysUser/GetLoginState',{params:{
                            uid:this.userid,
                            sessionid:token.sessionId
                        }})
                        .then(res=>{
                            console.log(res)
                            if(res.Status==='success'){
                                if(res.data==="true"){
                                    me.islogout=true
                                }
                            }

                        })
                        .catch(err=>{
                            console.log(err)
                        })
                    }
                }, 0)
            }, 40000)
        }
    }
}
</script>
<style>
    @import "../static/css/main.css";
    /* @import '../src/assets/css/icon/iconfont.css'; */
</style>
