<template>
    <div>
        <div class="navtitle navCss">
            <el-button type="success" round size="small"  @click="Navingclick()">导航</el-button>
        </div>
        <div class="sys-footer">
            <transition name="move" mode="out-in" appear>
                <nav-bar v-show="barshow" :isCollapse="collapsevule"></nav-bar>
            </transition>
        </div>
         
    </div>
    
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NavBar from './NavBar'

export default {
    data() {
        return {
            collapsevule:this.isCollapse,
            barshow:false
        }
    },
    props: ["isCollapse"],
    computed: {
        ...mapState({
            username: state => state.user.name,
            lang: state => state.lang
        })
    },
    components:{
        NavBar
    },
    methods: {
        Navingclick(){
            //console.log('123456')
            var old=this.barshow;
            this.barshow=!old;
        }
    }
}
</script>
<style lang='scss' scoped>
.sys-footer{
    display: flex;
    position: absolute;   
    border-color: #ccc;
    background: transparent;
    width:88%;
    height: 50px;
    left: 4%;    
    //border-bottom: 1px solid #00B8EE;
    z-index: 20;
    bottom: 70px;
    >.side-nav.top{
        padding-left: 100px;
        background: rgba(171, 234, 232, 0.8);
        box-shadow: 0 1px 8px #b3acac;
        margin:0;
        width:100%;
        >.el-menu--horizontal.el-menu{
            >li.el-menu-item{
                width:14.28%;
            }
            >li.el-submenu{
               width:14.28%; 
            }
        }
    }
    
}
.navtitle{
    display: flex;
    position: absolute;
    background: #fff;
    width: 60px;
    height: 60px;
    overflow: hidden;
    background: none;
    left:4%;
    z-index: 21;
    bottom: 70px;
    >button{       
        padding:0 35px 80px 0;
        color:#333;
        font-size:20px;
        font-weight: 800;
        position: relative;  
        height:50px;
        line-height:50px;
        top:6px;
        left:-28px;
        border-radius:50%;
        text-align: right;
    }
}
</style>
<style lang="scss">
.sys-footer{
    .side-nav.top > .el-menu > .el-menu-item,
    .side-nav.top > .el-menu > .el-submenu > .el-submenu__title{
        font-size:15px;
        color:#666;
    }
    .el-menu{
        border:0;
    }
    .sys-footer .side-nav.top .el-menu--horizontal > .el-submenu:focus .el-submenu__title,
    .el-menu--horizontal > .el-submenu .el-submenu__title:hover,
    .side-nav.top > .el-menu > .el-submenu:hover .el-submenu__title,
    .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
    .side-nav.top > .el-menu > .el-menu-item:hover {
        background-color:#00b7ee;
        color:#fff;
    }
     .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb3::before {
        background: url(../../assets/images/finance/SAAS_tb3-2.png);
        background-size: cover;

    }
     .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb4::before {
         background: url(../../assets/images/finance/SAAS_tb4-2.png);
        background-size: cover;
    }
    .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb5::before {
         background: url(../../assets/images/finance/SAAS_tb5-2.png);
        background-size: cover;
    }
   .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb6::before {
         background: url(../../assets/images/finance/SAAS_tb8-2.png);
        background-size: cover;
    }
     .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb7::before {
         background: url(../../assets/images/finance/SAAS_tb7-2.png);
        background-size: cover;
    }
     .el-menu--horizontal > .el-submenu:hover  .el-icon-lx-SAAS_tb8::before {
         background: url(../../assets/images/finance/SAAS_tb6-2.png);
        background-size: cover;
    }
    .el-menu--horizontal > .el-submenu .el-submenu__title,
    .el-menu--horizontal > .el-menu-item {
        height:50px;
        line-height:50px;
        padding:0 15px;
    }
    >.side-nav.top>.el-menu--horizontal.el-menu{
            >li.el-menu-item{
                width:14.28%;
                text-align:center;
            }
            >li.el-submenu{
               width:14.28%; 
               text-align:center;
            }
        }
    
}
.navCss>button.el-button--success>span{
        position:relative;
        left:30px;
        top:5px;
    }
</style>
