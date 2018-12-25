<template>
    <div class="wrapper">
        <template>
            <!-- v-once只渲染元素和组件一次 头部 -->
            <header-bar v-on:collapseByValue="collapseChange" v-once> 
                <p slot="logo"><router-link to="/index" class="header-title">工会云财务</router-link></p>
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
        // console.log('home')
        // var config = Auth.getPConfigStatus();
        // console.log(config)
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
<style >
.header-title{
    position:relative;
    color:#444 !important;
    left:-100px;
}
</style>

