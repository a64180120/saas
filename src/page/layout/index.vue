<template>
  <div class="wrapper ">
    <template>
      <!-- v-once只渲染元素和组件一次 头部 -->
      <!--有v-once异步加载的数据无法渲染-->
      <header-bar v-on:collapseByValue="collapseChange">
        <p slot="logo">
          <router-link to="/index"
                       class="header-title"
                       style="width: 100%;height: 78%;left: 10px;display: block;">
            <img style="height: 45px;margin-top: 5px;"
                 :src="platform.logo">
            <span>{{platform.platformname}}</span>
            <span v-if="AreaName">({{AreaName}}) </span>
          </router-link>
        </p>
      </header-bar>

    </template>
    <!-- <template>
      <bottom-bar v-drag
                  :isCollapse="collapsevule"
                  v-once>

      </bottom-bar>
    </template> -->
    <div class="content-box"
         :class="navClass">
      <tag-nav></tag-nav>
      <div class="content">
        <transition name="move"
                    mode="out-in">
          <keep-alive :include="tagNavList"
                      :exclude="excludeList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
    <!-- 左侧菜单 -->
    <nav-bar @showDragPosition="showDragPosition"
             @navPosition="navPosition"
             :isCollapse="collapsevule"></nav-bar>
    <!--15天提示弹窗-->
    <!--timerShowType?'block':'none'-->
    <!--此处代码用于开启15天弹窗提示-->
    <div :style="{'display':timerShowType?'block':'none','position':'fixed','z-index':'9999999999999'}">
      <countdownpop></countdownpop>
    </div>
    <budgetcount v-show="Budgetcount"></budgetcount>
      <reportdialog v-show="Reportcount"></reportdialog>
    <!-- 拖拽示意位置 -->
    <div v-show="position"
         :class="position"></div>
  </div>
</template>

<script>
import HeaderBar from './HeaderBar'
import NavBar from './NavBar'
import TagNav from './TagNav'
// import BottomBar from './BottomBar'
import countdownpop from "../../components/countDownPop";
import budgetcount from "../../components/Budgetcount";
import reportcount from '../reportCount'
import { mapState, mapGetters } from "vuex";
import Auth from "@/util/auth"
import config from '@/util/ajaxConfig'
import { getOtherSetting } from '@/api/home'
import Reportdialog from "../reportCount/reportdialog";

export default {
  computed: {
    layout () {
      return this.$store.state.navbarPosition
    },
    collapse () {
      return this.$store.state.isCollapse
    },
    tagNavList () {
      return this.$store.state.tagNav.cachedPageName
    },
    excludeList () {
      return this.$store.state.tagNav.excludeName
    },
    picUrl: function () {
      return config.baseurl;
    },
    ...mapState({
      EmpowerInfo: state => state.user.EmpowerInfo,
      orgNature: state => state.user.orgNature,
      userid: state => state.user.userid,
      Budgetcount: state => state.routerToBudgetcount,
        Reportcount: state => state.routerToReportcount
    }),
    AreaName () {
      var dbIbfo = Auth.getDBBase();
      if (dbIbfo) {
        return dbIbfo.areaname;
      } else {
        return "";
      }
    }
  },
  data () {
    return {
      collapsevule: this.collapse,
      timerShowType: false,
      platform: { logo: '' },//logo信息
      position: '',//拖拽示意位置
      navClass: 'top',//导航位置
    }
  },
  created () {
    // console.log('home')
    // var config = Auth.getPConfigStatus();
    this.otherSetting();
  },
  mounted () {
    //判断是否要展示15天弹窗
    if (this.orgNature == 1 || this.userid == '631181115000001') {
      this.timerShowType = false;
    } else {
      this.timerShowType = true;
    }
    //加载菜单
    //this.getMenuList();
  },
  methods: {
    showDragPosition (data) {  //显示拖拽框

      if (data) {
        this.position = 'nav' + data;
      } else {
        this.position = ""
      }

    },
    navPosition (data) { //改变导航位置
      this.navClass = data;
    },
    collapseChange: function (childValue) {
      // childValue就是子组件传过来的值
      this.collapsevule = childValue
    },
    //获取其他设置数据
    otherSetting () {
      var vm = this;
      var params = {
        value: "platform"
      }
      getOtherSetting(vm, params).then(
        (res) => {
          if (res.Status == 'error') {
            this.$message({ showClose: true, message: "设置信息获取错误", type: "error" });
          } else {
            this.platform.logo = this.picUrl + res.platform.logo;
            this.platform.platformname = res.platform.platformname;
          }
        }

      )
    },
  },
  components: {
      Reportdialog,
    HeaderBar,
    NavBar,
    TagNav,
    // BottomBar,
    countdownpop,  //15天提示弹窗
    budgetcount,//预算汇总弹窗
  }
}
</script>
<style lang="scss">
.header-title {
  position: relative;
  color: #444 !important;
  left: -100px;
}
//拖拽示意图
.navright,
.navtop,
.navbottom,
.navleft {
  content: "";
  position: fixed;
  position: -ms-page;
  z-index: 99;
  background: rgba(232, 243, 239, 0.8);
  border: 2px dotted #00b7ee;
}
.navleft {
  left: 0;
  width: 15%;
  top: 15%;
  bottom: 15%;
}
.navright {
  width: 15%;
  top: 15%;
  bottom: 15%;
  right: 0;
}
.navtop {
  top: 0;
  height: 15%;
  left: 15%;
  right: 15%;
}
.navbottom {
  height: 15%;
  left: 15%;
  right: 15%;
  bottom: 0;
}
.top {
  top: 130px;
  padding-bottom: 0;
}
.bottom .content {
  padding-bottom: 50px;
}
.right {
  right: 163px;
  padding-bottom: 0;
}
.left {
  left: 163px;
  padding-bottom: 0;
}
</style>

