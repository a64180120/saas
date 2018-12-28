<template>
  <div class="sys-page">
    <iframe :src="urlPath" class="iframe" ref="iframe"></iframe>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import httpConfig from '@/util/ajaxConfig'

//第三方网站
export default {
  name: "supcan",
  components: { },
  data() {
    return {
      urlPath:'/G6C/Examples/Index'
    }
  },
  created() {
    this.urlPath=httpConfig.baseurl+'/G6C/Examples/Index'
  },
  //加载数据
  mounted:function(){},
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          username: state => state.user.username,
          orgid: state => state.user.orgid
      })
  },
  methods: {

  }
}
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
