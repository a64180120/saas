<template>

    <div class="sidebar">
        <!-- 
            unique-opened 是否只保持一个子菜单的展开
            default-active 当前激活菜单的 index
            mode 模式horizontal,vertical
            router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
            collapse 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
            background-color 菜单的背景色（仅支持 hex 格式）
            text-color 菜单的文字颜色（仅支持 hex 格式）
            active-text-color 当前激活菜单的文字颜色（仅支持 hex 格式）
            menu-trigger 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)
            博客： https://blog.csdn.net/sps900608/article/details/79458958
        -->
        
        <el-menu 
        class="sidebar-el-menu" 
        router ref="navbar" 
        :default-active="defActive" 
        menu-trigger="click" 
        @select="selectMenu"
        :collapse="isCollapse"
        unique-opened>
            <nav-bar-item v-for="(item, n) in navList" :item="item" :navIndex="String(n)" :key="n"></nav-bar-item>
        </el-menu>
    </div>
</template>

<script>
import { mapState } from "vuex";
import NavBarItem from "./NavBarItem";

export default {
  data() {
    return {
      //isCollapse: false
    };
  },
  props: ["isCollapse"],
  computed: {
    ...mapState({
      navList: state => state.auth.navList
    }),
    defActive() {
      return this.$route.path;
    },
    isDark() {
      return this.$store.state.theme.indexOf("dark") >= 0 ? "dark" : "light";
    }
  },
  watch: {
    // 当通过TagNav来激活页面时也执行一次selectMenu
    $route() {
      let path = this.$route.path;
      let indexPath = this.$refs.navbar.items[path].indexPath;
      this.selectMenu(path, indexPath);
    }
  },
  methods: {
    // eslint-disable-next-line
    selectMenu(index, indexPath) {
      /**
       * 在选择父级菜单时自动关闭其下所有子菜单
       * 选择时获取点击菜单的父级index，并计算得到该index在已打开菜单中的索引值，
       * 关闭位于当前打开菜单中该索引值之后的全部菜单
       */
      let openedMenus = this.$refs.navbar.openedMenus;
      let openMenuList;
      // 如果点击的是二级菜单，则获取其后已经打开的菜单
      if (indexPath.length > 1) {
        let parentPath = indexPath[indexPath.length - 2];
        openMenuList = openedMenus.slice(openedMenus.indexOf(parentPath) + 1);
      } else {
        openMenuList = openedMenus;
      }

      // 关闭菜单
      openMenuList = openMenuList.reverse();
      openMenuList.forEach(ele => {
        this.$refs.navbar.closeMenu(ele);
      });
    }
  },
  components: { NavBarItem }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>