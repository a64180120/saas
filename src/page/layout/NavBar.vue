<template>

  <div @mousedown="dragBegin($event)"
       style="left:0;top:60px;"
       :class="position"
       class="side-nav">
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
    <div v-if="reset"
         style="text-align:center;line-height:56px;color:#fff;">导航</div>
    <el-menu router
             v-else
             ref="navbarlist"
             :mode="navMode"
             :default-active="defActive"
             text-color="#fff"
             :popper-class="popperClass"
             :collapse="isCollapse"
             menu-trigger="hover"
             @select="selectMenu"
             unique-opened>

      <nav-bar-item v-for="(item, n) in navList"
                    :item="item"
                    :navIndex="String(n)"
                    :key="n"></nav-bar-item>
    </el-menu>
    <div v-show="navBgShow"
         class="full-screen-navBg"
         @click.self="closeAll"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavBarItem from "./NavBarItem";

export default {
  data () {
    return {
      //isCollapse: false
      navBgShow: false,
      position: 'top',
      reset: false
    };
  },
  mounted () {
    let nav = document.querySelector('.side-nav');
    this.dragBegin(nav)
  },
  props: ["isCollapse"],
  computed: {
    ...mapState({
      navList: state => state.user.navList
    }),
    defActive () {
      return this.$route.path;
    },
    popperClass () {
      return this.position + '_navpopper'
    },
    isDark () {
      return this.$store.state.theme;
    },
    navMode () {
      let vl = (this.position === 'left' || this.position === 'right') ? 'vertical' : 'horizontal'

      return vl
    }
  },
  watch: {
    // 当通过TagNav来激活页面时也执行一次selectMenu
    $route () {
      //  ;
      // let path = this.$route.path;
      // let indexPath = this.$refs.navbarlist.items[path].indexPath;
      // this.selectMenu(path, indexPath);
    }
  },
  methods: {
    // eslint-disable-next-line
    dragBegin (odiv) {
      let vm = this;
      odiv.onmousedown = (e) => {
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        let disY = e.clientY - odiv.offsetTop;
        let oldClientX = e.clientX;
        let oldClientY = e.clientY;
        let oldLeft = odiv.style.left;
        let oldTop = odiv.style.top;
        let count = 0;
        document.onmousemove = (e) => {
          window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();//防止选中文字
          if (Math.abs(e.clientX - oldClientX) > 20 || Math.abs(e.clientY - oldClientY) > 20) { //防止误触
            count++;

            if (count === 1) {
              count++;
              odiv.style.width = '68px'
              odiv.style.height = '56px'
              disX = 50
              disY = 50

              odiv.style.borderRadius = '50%';
            }
            odiv.style.zIndex = '999'
            odiv.style.overflow = 'hidden'
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;
            let top = e.clientY - disY;

            vm.reset = true
            //绑定元素位置到positionX和positionY上面
            // this.positionX = top;
            // this.positionY = left;

            //移动当前元素
            odiv.style.left = left + 'px';
            odiv.style.top = top + 'px';


            if (e.clientX <= window.innerWidth / 2 && e.clientY <= window.innerHeight / 2 && e.clientX <= e.clientY) {
              this.$emit('showDragPosition', 'left')
            } else if (e.clientX <= window.innerWidth / 2 && e.clientY <= window.innerHeight / 2 && e.clientX > e.clientY) {
              this.$emit('showDragPosition', 'top')
            } else if (e.clientX <= window.innerWidth / 2 && e.clientY > window.innerHeight / 2 && e.clientX / window.innerWidth > (1 - e.clientY / window.innerHeight)) {
              this.$emit('showDragPosition', 'bottom')
            } else if (e.clientX <= window.innerWidth / 2 && e.clientY > window.innerHeight / 2 && e.clientX / window.innerWidth <= (1 - e.clientY / window.innerHeight)) {
              this.$emit('showDragPosition', 'left')
            } else if (e.clientX > window.innerWidth / 2 && e.clientY > window.innerHeight / 2 && (1 - e.clientX / window.innerWidth) <= (1 - e.clientY / window.innerHeight)) {
              this.$emit('showDragPosition', 'right')
            } else if (e.clientX > window.innerWidth / 2 && e.clientY > window.innerHeight / 2 && (1 - e.clientX / window.innerWidth) > (1 - e.clientY / window.innerHeight)) {
              this.$emit('showDragPosition', 'bottom')
            }
            else if (e.clientX > window.innerWidth / 2 && e.clientY <= window.innerHeight / 2 && (1 - e.clientX / window.innerWidth) > e.clientY / window.innerHeight) {
              this.$emit('showDragPosition', 'top')
            }
            else if (e.clientX > window.innerWidth / 2 && e.clientY <= window.innerHeight / 2 && (1 - e.clientX / window.innerWidth) <= e.clientY / window.innerHeight) {
              this.$emit('showDragPosition', 'right')
            }
          }
        };
        document.onmouseup = (e) => {

          this.$emit('showDragPosition', '')
          vm.reset = false;
          count = 0;
          odiv.style.borderRadius = '';
          odiv.style.overflow = ''
          odiv.style.width = ''
          odiv.style.height = ''
          odiv.style.zIndex = ''

          if (Math.abs(e.clientX - oldClientX) < 20 && Math.abs(e.clientY - oldClientY) < 20) { //防止点击边缘一下就变换位置
            odiv.style.left = oldLeft;
            odiv.style.top = oldTop;
            document.onmousemove = null;
            document.onmouseup = null;
            return;
          }

          if (e.clientX / window.innerWidth < 0.15 && e.clientY / window.innerHeight > 0.15 && e.clientY / window.innerHeight < 0.85) {

            vm.position = "left"
            odiv.style.top = "70px";
            odiv.style.left = "10px";
            odiv.style.right = "";
            odiv.style.bottom = "10px";
            this.$emit('navPosition', 'left')

          } else if (e.clientX / window.innerWidth > 0.85 && e.clientY / window.innerHeight > 0.15 && e.clientY / window.innerHeight < 0.85) {
            vm.position = "right"
            odiv.style.top = "70px";
            odiv.style.left = "";
            odiv.style.right = "10px";
            odiv.style.bottom = "10px";
            this.$emit('navPosition', 'right')
          } else if (e.clientX / window.innerWidth > 0.15 && e.clientX / window.innerWidth < 0.85 && e.clientY / window.innerHeight < 0.15) {
            vm.position = "top"
            odiv.style.top = "60px";
            odiv.style.left = "0px";
            odiv.style.right = "0px";
            odiv.style.bottom = "";
            this.$emit('navPosition', 'top')
          } else if (e.clientX / window.innerWidth > 0.15 && e.clientX / window.innerWidth < 0.85 && e.clientY / window.innerHeight > 0.85) {
            vm.position = "bottom"
            odiv.style.top = "";
            odiv.style.left = "10px";
            odiv.style.right = "10px";
            odiv.style.bottom = "10px";
            this.$emit('navPosition', 'bottom')
          }
          else {
            odiv.style.left = oldLeft;
            odiv.style.top = oldTop;
          }
          // if (e.clientX <= 200 && e.clientY > 200 || (e.clientX <= 200 && window.innerWidth - e.clientY > 200)) {

          //   vm.position = "left"
          //   odiv.style.top = "70px";
          //   odiv.style.left = "10px";
          //   odiv.style.right = "";
          //   odiv.style.bottom = "10px";
          //   this.$emit('navPosition', 'left')

          // } else if (window.innerWidth - e.clientX <= 200 && e.clientY > 200 || (window.innerWidth - e.clientX <= 200 && window.innerWidth - e.clientY > 200)) {
          //   vm.position = "right"
          //   odiv.style.top = "70px";
          //   odiv.style.left = "";
          //   odiv.style.right = "10px";
          //   odiv.style.bottom = "10px";
          //   this.$emit('navPosition', 'right')
          // } else if (window.innerWidth - e.clientX > 200 && e.clientY < 200 || (e.clientX > 200 && e.clientY < 200)) {
          //   vm.position = "top"
          //   odiv.style.top = "60px";
          //   odiv.style.left = "0px";
          //   odiv.style.right = "0px";
          //   odiv.style.bottom = "";
          //   this.$emit('navPosition', 'top')
          // } else if (window.innerWidth - e.clientX > 200 && e.clientY < 200 || (e.clientX > 200 && window.innerHeight - e.clientY < 200)) {
          //   vm.position = "bottom"
          //   odiv.style.top = "";
          //   odiv.style.left = "10px";
          //   odiv.style.right = "10px";
          //   odiv.style.bottom = "10px";
          //   this.$emit('navPosition', 'bottom')
          // }
          // else {
          //   odiv.style.left = oldLeft;
          //   odiv.style.top = oldTop;
          // }
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    },

    selectMenu (index, indexPath) {

      /**
       * 在选择父级菜单时自动关闭其下所有子菜单
       * 选择时获取点击菜单的父级index，并计算得到该index在已打开菜单中的索引值，
       * 关闭位于当前打开菜单中该索引值之后的全部菜单
       */
      // 
      //let openedMenus = this.$refs.navbar.openedMenus;
      //let openMenuList;
      // 如果点击的是二级菜单，则获取其后已经打开的菜单
      // if (indexPath.length > 1) {
      //   let parentPath = indexPath[indexPath.length - 2];
      //   openMenuList = openedMenus.slice(openedMenus.indexOf(parentPath) + 1);
      // } else {
      //   openMenuList = openedMenus;
      // }

      // 关闭菜单
      // openMenuList = openMenuList.reverse();
      // openMenuList.forEach(ele => {
      //   this.$refs.navbar.closeMenu(ele);
      // });
    },
    openMenu () {
      this.navBgShow = true
    },
    closeMenu () {
      this.navBgShow = false
    },
    closeAll () {
      let openMenu = this.$refs.navbar.openedMenus.concat([])
      openMenu = openMenu.reverse()
      openMenu.forEach((ele) => {
        this.$refs.navbar.closeMenu(ele)
      })
      this.navBgShow = false
    }
  },
  components: { NavBarItem }
};
</script>

<style scoped>
/* .sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
} */
.side-nav {
  position: absolute;

  overflow: hidden;
  box-shadow: 0 0 2px #bbb;
  background: url(../../assets/images/navBG.png);
}

.side-nav::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: transparent;
}

/*定义滚动条轨道 内阴影+圆角*/
.side-nav::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: transparent;
}

/*定义滑块 内阴影+圆角*/
.side-nav::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  background-color: #d5e4e89e;
}
.side-nav.top {
  margin: 0;
}
.sidebar {
  top: 65px;
}

.el-menu {
  margin-right: 10px;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 180px;
}
.sidebar > ul {
  height: 100%;
}
.el-menu.el-menu--horizontal {
  border: 0;
}

.top {
  right: 0;
  height: 60px;
}
.right {
  width: 160px;
  overflow: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.left {
  width: 160px;
  overflow: auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.bottom {
  height: 60px !important;
  right: 0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
</style>
<style>
.el-menu {
  background: url(../../assets/images/navBG.png);
  background-size: 50% 100%;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  height: 100%;
}
.el-menu-item:hover,
.el-submenu__title:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
}
.el-menu--popup-bottom-start .el-menu-item {
  color: #00b7ee !important;
}
.el-menu--popup-bottom-start .el-menu-item:hover {
  background: #00b7ee !important;
  color: #fff !important;
}
.el-menu--horizontal .el-menu--popup-bottom-start {
  left: 0;
  bottom: 3px;
}
.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-submenu__title {
  background: none;
}
.el-submenu.is-opened .el-menu--inline {
  background: #fff;
}
.el-submenu.is-opened .el-menu--inline .el-menu-item {
  color: #00b7ee !important;
  padding-left: 50px !important;
}
.el-submenu.is-opened .el-menu--inline .el-menu-item:hover {
  background: #00b7ee !important;
  color: #fff !important;
}
.el-menu-item,
.el-submenu__title {
  padding-left: 10px !important;
}
.el-submenu__title .el-submenu__icon-arrow {
  color: #fff !important;
}
.el-menu--horizontal .el-submenu__title .el-icon-arrow-down {
  display: none;
}
.top_navpopper {
}
.bottom_navpopper {
}
</style>

