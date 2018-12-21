<template>
    <div class="wrapper">
        <template>
            <!-- v-once只渲染元素和组件一次 头部 -->
            <header-bar v-on:collapseByValue="collapseChange" v-once> 
                <p slot="logo"><router-link to="/index" class="header-title">工会财务管理云平台</router-link></p>
            </header-bar>
            <!-- 左侧菜单 -->
            <nav-bar :isCollapse="collapsevule"></nav-bar>
        </template>
        <div class="content-box" :class="{'content-collapse':collapsevule}">
            <tag-nav></tag-nav>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagNavList" :exclude="excludeList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderBar from './HeaderBar'
import NavBar from './NavBar'
import TagNav from './TagNav'
import Auth from "@/util/auth"

export default {
    computed: {
        collapse(){
            return this.$store.state.isCollapse
        },
        tagNavList(){
            return this.$store.state.tagNav.cachedPageName
        },
        excludeList(){
            return this.$store.state.tagNav.excludeName
        }
    },
    data () {
      return {
        collapsevule: this.collapse
      }
    },
    created() {
        var config=Auth.getPConfigStatus();
        if (!config) {
            var para={
                userid:this.$store.state.user.userid,
                orgid:this.$store.state.user.orgid,
                year:''
            }
            this.$store.dispatch('config/getBusinessConfig',para).then((res)=>{
                console.log(res);
            })
        }
    },
    methods: {
      collapseChange: function (childValue) {
        // childValue就是子组件传过来的值
        this.collapsevule = childValue
      }
    },
    components:{
        HeaderBar,
        NavBar,
        TagNav
    }
}
</script>
