<template>
    <div class="tag-nav">
        <scroll-bar ref="scrollBar">
            <router-link ref="tag"
            class="tag-nav-item"
            :class="isActive(item) ? 'cur' : ''"
            v-for="(item, index) in tagNavList"
            :to="item.path"
            :key="index">
                {{item.title}}
                <span class='el-icon-close' @click.prevent.stop="closeTheTag(item, index)"></span>
            </router-link>
        </scroll-bar>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import ScrollBar from "@/Components/ScrollBar";
//import ScrollPane from "@/Components/ScrollBar/scrollPane";

export default {
  data() {
    return {
      defaultPage: "/home",
      selectedTag: {}
    };
  },
  computed: {
    tagNavList() {
      return this.$store.state.tagNav.openedPageList;
    }
  },
  mounted() {
    // 首次加载时将默认页面加入缓存
    this.addTagNav();
  },
  watch: {
    $route(newValue, oldValue) {
      this.addTagNav();
      this.scrollToCurTag();
    }
  },
  methods: {
    openMenu(tag, e) {
      this.selectedTag = tag
      console.log("selectedTag")
      console.log(this.selectedTag)
    },
    addTagNav() {
      // 如果需要缓存则必须使用组件自身的name，而不是router的name
      this.$store.commit("tagNav/addTagNav", {
        name: this.$router.getMatchedComponents()[1].name,
        path: this.$route.path,
        title: this.$route.meta.name,
        noCache: this.$route.meta.noCache
      });
    },
    isActive(item) {
      return item.path === this.$route.path;
    },
    closeTheTag(item, index) {
      // 当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
      // 如果没有前一个Tag，则加载默认页面
      this.$store.commit("tagNav/removeTagNav", item);
      if (this.$route.path == item.path) {
        if (index) {
          this.$router.push(this.tagNavList[index - 1].path);
        } else {
          this.$router.push(this.defaultPage);
          if (this.$route.path == "/home") {
            this.addTagNav();
          }
        }
      }
    },
    scrollToCurTag() {
      this.$nextTick(() => {
        for (let item of this.$refs.tag) {
          if (item.to === this.$route.path) {
            this.$refs.scrollBar.scrollToCurTag(item.$el);
            break;
          }
        }
      });
    },
    handleTags(command){
        command === 'other' ? this.closeOther() : this.closeAll();
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to === this.$route.path) {
            this.$refs.scrollBar.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    // 关闭全部标签
    closeAll(){
        this.$store.dispatch('tagNav/delAllTagNavViews').then(() => {
          this.$router.push('/home') //跳转主页
        })
    },
    // 关闭其他标签
    closeOther(){
        // 关闭其他标签
        const curItem = this.tagNavList.filter(item => {
            return item.path === this.$route.fullPath;
        })
        //this.tagNavList = curItem;
        this.$store.dispatch('tagNav/delOthersTagNavViews', curItem[0]).then(() => {
          //this.moveToCurrentTag()
        })

    }
  },
  components: { ScrollBar }
};
</script>
<style scoped>
    .tag-nav{
        height: 40px;
        padding: 0 0 0 15px;
    }
    .tag-nav .tag-nav-item{
        height: 28px;
        line-height: 28px;
        background: #fff;
        color:#ccc;
        border-color: #ccc;
    }
    .tag-nav .cur{
        background: #00b7ee ;
        color:#fff;
        border-color:#00b7ee
    }
    .tag-nav .tag-nav-item span{
        color:#fff;
        text-align: center;
    }
    .tag-nav .tag-nav-item:hover span{
        color:#00b7ee;
        background: #cfff;
    }
    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        background: #fff;
        z-index: 1;
    }
</style>
