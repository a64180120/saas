<template>
  <el-submenu popper-append-to-body
              v-if="item.child && item.child.length"
              :index="navIndex">
    <!-- 创建父级菜单 -->
    <template slot="title">
      <i v-if="item.icon"
         :class="item.icon"></i>
      <span slot="title">{{ item.name }}</span>
    </template>
    <!-- 创建子菜单 -->
    <nav-bar-item v-for="(subItem,i) in item.child"
                  :key="navIndex+'-'+i"
                  :navIndex="navIndex+'-'+i"
                  :item="subItem"></nav-bar-item>
  </el-submenu>

  <el-menu-item :class="{active:item.path==$route.path}"
                v-else
                :index="item.name"
                :route="{path: item.path||''}">
    <i v-if="item.icon"
       :class="item.icon"></i>
    <span slot="title">{{ item.name }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'NavBarItem',
  props: ['item', 'navIndex'],

}
</script>
<style scoped lang="scss">
.active {
  background: #e4e7ed !important;
  color: #00b7ee !important;
  .nav_saas_01 {
    background: url(../../assets/images/L-saas_03.png) 80% 80%;
  }
  .nav_saas_02 {
    background: url(../../assets/images/L-saas_06.png) 80% 80%;
  }
  .nav_saas_03 {
    background: url(../../assets/images/L-saas_08.png) 80% 80%;
  }
  .nav_saas_04 {
    background: url(../../assets/images/L-saas_10.png) 80% 80%;
  }
  .nav_saas_05 {
    background: url(../../assets/images/L-saas_12.png) 80% 80%;
  }
  .nav_saas_06 {
    background: url(../../assets/images/L-saas_14.png) 80% 80%;
  }
  .nav_saas_07 {
    background: url(../../assets/images/L-saas_16.png) 80% 80%;
  }
  .nav_saas_08 {
    background: url(../../assets/images/L-saas_18.png) 80% 80%;
  }
  .nav_saas_09 {
    background: url(../../assets/images/L-saas_20.png) 80% 80%;
  }
  .nav_saas_10 {
    background: url(../../assets/images/L-saas_22.png) 80% 80%;
  }
}
.nav_saas_01 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_03.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_03.png) 80% 80%;
  // }
}
.nav_saas_02 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_06.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_06.png) 80% 80%;
  // }
}
.nav_saas_03 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_08.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_08.png) 80% 80%;
  // }
}
.nav_saas_04 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_10.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_10.png) 80% 80%;
  // }
}
.nav_saas_05 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_12.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_12.png) 80% 80%;
  // }
}
.nav_saas_06 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_14.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_14.png) 80% 80%;
  // }
}
.nav_saas_07 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_16.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_16.png) 80% 80%;
  // }
}
.nav_saas_08 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_18.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_18.png) 80% 80%;
  // }
}
.nav_saas_09 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_20.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_20.png) 80% 80%;
  // }
}
.nav_saas_10 {
  width: 28px;
  height: 30px;
  display: inline-block;
  background: url(../../assets/images/saas_22.png) 80% 80%;
  // &:hover {
  //   background: url(../../assets/images/L-saas_22.png) 80% 80%;
  // }
}
</style>
