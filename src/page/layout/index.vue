<template>
    <div class="wrapper">
        <template>
            <!-- v-once只渲染元素和组件一次 头部 -->
            <header-bar v-on:collapseByValue="collapseChange" v-once> 
                <p slot="logo"><router-link to="/index">工会sass云财务系统</router-link></p>
            </header-bar>
            <!-- 左侧菜单 -->
            <nav-bar :isCollapse="collapsevule"></nav-bar>
        </template>
        <!-- <div class="sys-content">
            <tag-nav></tag-nav>
            <keep-alive :include="tagNavList">
                <router-view></router-view>
            </keep-alive>
        </div> -->
        <div class="content-box" :class="{'content-collapse':collapsevule}">
            <tag-nav></tag-nav>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagNavList">
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

export default {
    computed: {
        collapse(){
            return this.$store.state.isCollapse
        },
        tagNavList(){
            return this.$store.state.tagNav.cachedPageName
        }
    },
    data () {
      return {
        collapsevule: this.collapse
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