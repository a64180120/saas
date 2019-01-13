<template>
    <div class="wrapper">
        <template>
            <!-- v-once只渲染元素和组件一次 头部 -->
            <header-bar v-on:collapseByValue="collapseChange" v-once>
                <p slot="logo">
                    <router-link to="/index" class="header-title" style="width: 100%;height: 78%;left: 10px;display: block;">
                        <img style="height: 45px;margin-top: 5px;" src="../../assets/images/logo2.png">
                    </router-link>
                </p>
            </header-bar>
            <!-- 左侧菜单 -->
            <!-- <nav-bar :isCollapse="collapsevule"></nav-bar> -->
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
        <template>
            <bottom-bar :isCollapse="collapsevule" v-once>

            </bottom-bar>
        </template>
        <!--15天提示弹窗-->
        <!--timerShowType?'block':'none'-->
        <!--此处代码用于开启15天弹窗提示-->
        <!--<div :style="{'display':timerShowType?'block':'none','position':'fixed','z-index':'9999'}">
            <countdownpop></countdownpop>
        </div>-->
    </div>
</template>

<script>
import HeaderBar from './HeaderBar'
import NavBar from './NavBar'
import TagNav from './TagNav'
import BottomBar from './BottomBar'
import countdownpop from "../../components/countDownPop";
import { mapState, mapGetters } from "vuex";
import Auth from "@/util/auth"

export default {
    computed: {
        layout(){
            return this.$store.state.navbarPosition
        },
        collapse(){
            return this.$store.state.isCollapse
        },
        tagNavList(){
            return this.$store.state.tagNav.cachedPageName
        },
        excludeList(){
            return this.$store.state.tagNav.excludeName
        },
        ...mapState({
            EmpowerInfo: state => state.user.EmpowerInfo
        })
    },
    data () {
      return {
          collapsevule: this.collapse,
          timerShowType:false
      }
    },
    created() {
        // console.log('home')
        // var config = Auth.getPConfigStatus();
    },
    mounted(){
        //判断是否要展示15天弹窗
        if(!this.EmpowerInfo){
            this.timerShowType=true;
        }
        //加载菜单
        //this.getMenuList();
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
        TagNav,
        BottomBar,
        countdownpop  //15天提示弹窗
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

