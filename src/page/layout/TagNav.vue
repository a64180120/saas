<template>
  <div class="tag-nav">
    <scroll-bar ref="scrollBar">
      <router-link ref="tag"
                   :title="item.title"
                   class="tag-nav-item"
                   :class="isActive(item) ? 'cur' : ''"
                   v-for="(item, index) in tagNavList"
                   :to="item.fullPath"
                   :key="index">
        {{item.title}}
        <span v-if="item.fullPath!='/home'"
              class='el-icon-close'
              @click.prevent.stop="closeTheTag(item, index)"></span>
      </router-link>
    </scroll-bar>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini"
                   type="primary">
          标签选项<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small"
                          slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item @click.stop="closeAll">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import ScrollBar from "@/Components/ScrollBar";
//import ScrollPane from "@/Components/ScrollBar/scrollPane";
import { mapState, mapActions } from 'vuex'
import httpConfig from '@/util/ajaxConfig';
import httpajax from "axios";
export default {
  data () {
    return {
      defaultPage: "/home",
      selectedTag: {}
    };
  },
  computed: {
    tagNavList () {
      return this.$store.state.tagNav.openedPageList;
    },
    ...mapState({

      orgid: state => state.user.orgid,
      uid: state => state.user.userid,
      uname: state => state.user.username,
      orgcode: state => state.user.orgcode,
      usercount: state => state.user,
      jbuildDate: state => state.Pconfig.jbuildDate,//建账日期
      roleInfo: state => state.user.roleInfo,
      dbname: state => state.user.dbname
    }),
  },
  mounted () {
    // 首次加载时将默认页面加入缓存
    this.addTagNav();
    //判断默认页面
    this.defaultPageSelect();


  },
  watch: {
    $route (newValue, oldValue) {
      this.addTagNav();
      this.scrollToCurTag();
    }
  },
  methods: {
    openMenu (tag, e) {
      this.selectedTag = tag
    },
    addTagNav () {
      // 如果需要缓存则必须使用组件自身的name，而不是router的name
      this.$store.commit("tagNav/addTagNav", {
        name: this.$router.getMatchedComponents()[1].name,
        path: this.$route.path,
        fullPath: this.$route.fullPath,
        title: this.$route.meta.name,
        noCache: this.$route.meta.noCache
      });
    },
    isActive (item) {
      return item.path === this.$route.path;
    },
    closeTheTag (item, index) {
      // 当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
      // 如果没有前一个Tag，则加载默认页面
      this.$store.commit("tagNav/removeTagNav", item);
      if (this.$route.path == item.path) {
        if (index) {
          this.$router.push(this.tagNavList[index - 1].path);
        } else {
          this.$router.push(this.defaultPage);
          if (this.$route.path == this.defaultPage) {
            this.addTagNav();
          }
        }
      }
    },
    scrollToCurTag () {
      this.$nextTick(() => {
        for (let item of this.$refs.tag) {
          if (item.to === this.$route.path) {
            this.$refs.scrollBar.scrollToCurTag(item.$el);
            break;
          }
        }
      });
    },
    handleTags (command) {
      command === 'other' ? this.closeOther() : this.closeAll();
    },
    moveToCurrentTag () {
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
    //根据登入人的Id与组织Id获取不同的权限
    getDifferenRole: function (userId, orgId) {
      let base = httpConfig.getAxiosBaseConfig();
      let headconfig = httpConfig.getTestHeaderConfig(this.dbname);
      httpajax.create(base)({
        method: 'get',
        url: '/SysRole/GetDefaultPageByRoles?userId=' + userId + '&orgId=' + orgId,
        headers: headconfig
      }).then(res => {
        let data = JSON.parse(res.data);
        if (data.UrlAddress == null || data.UrlAddress == '') {
          this.$message.error("当前用户还未赋予有页面的菜单权限，请联系管理员!");
        } else {
          this.defaultPage = data.UrlAddress;
          //this.$router.push(data.UrlAddress);
        }
      }).catch(err => {
        console.log(err);
      })
    },
    //判断默认页面
    defaultPageSelect () {
      var data = {
        orgId: this.orgid,
        userId: this.uid
      };
      this.$axios
        .get("SysRole/GetDefaultPageByRoles", { params: data })
        .then(res => {
          if (res.UrlAddress == null || res.UrlAddress == '') {
            this.$message.error("当前用户还未赋予有页面的菜单权限，请联系管理员!");
          } else {
            this.defaultPage = res.UrlAddress;
            //this.$router.push(data.UrlAddress);
          }
        })
        .catch(err => {
          this.saasMessage = {
            message: "获取默认页面失败了!",
            visible: true
          };
        });
      /*var roleFlam;
        if(this.roleInfo.length>0){
            for(let i =0; i< this.roleInfo.length; i++){
                if(this.roleInfo[i].EnCode == '004'){
                    roleFlam = 2;
                }
                if(this.roleInfo[i].EnCode == 'admin'){
                    roleFlam = 3;
                }
                if(this.roleInfo[i].EnCode == '001'){
                    roleFlam = 1;
                    break;
                }
            }
        }

        if(roleFlam == 1){
            this.defaultPage='/home'
             //跳转主页
        }else if(roleFlam == 2){
            this.defaultPage='/system/account'

        }else {
            this.defaultPage='/admin/orgin'

        }*/
    },
    // 关闭全部标签
    closeAll () {
      this.$store.dispatch('tagNav/delAllTagNavViews').then(() => {
        this.$router.push(this.defaultPage) //跳转主页
      })
    },
    // 关闭其他标签
    closeOther () {
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
.tag-nav {
  height: 40px;
  padding: 0 0 0 15px;
}
.tag-nav .tag-nav-item {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
  text-align: center;
  padding: 0 12px 0 5px;
  width: 92px;
  height: 28px;
  line-height: 28px;
  background: #fff;
  color: #ccc;
  border-color: #ccc;
}
.tag-nav .cur {
  background: #88b927;
  color: #fff;
  border-color: #88b927;
}

.tag-nav .tag-nav-item span {
  color: #ccc;
  text-align: center;
  position: absolute;
  top: 6px;
  right: -1px;
}
.tag-nav .tag-nav-item:hover span {
  color: #88b927 !important;
}
.tag-nav .tag-nav-item.cur span {
  color: #fff !important;
  background-color: transparent !important;
}
.tags-close-box {
  position: absolute;
  right: 15px;
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
