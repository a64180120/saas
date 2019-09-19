<template>
  <div class="sys-page">
    <!-- <iframe :src="urlPath" class="iframe" ref="iframe"></iframe> -->
    <div id="report" :style="'height:'+ height + 'px'" v-html='supcanHTML'></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import httpConfig from '@/util/ajaxConfig'
import { bldStr } from 'static/supcan/dynaload.js'

//第三方网站
export default {
  name: "supcan",
  components: { },
  data() {
    return {
      urlPath:'/G6C/Examples/Index',
      height: (document.body.clientHeight) - 100,
      supcanHTML:bldStr('LuxForm', 'AF', '', '100%')
    }
  },
  created() {
    this.urlPath=httpConfig.baseurl+'/G6C/Examples/Index'
  },
  //加载数据
  mounted:function(){
    this.$nextTick(function() {
      let self = this
      window.onresize = function() {
        self.autoResize()
      }
    })
  },
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          username: state => state.user.username,
          orgid: state => state.user.orgid
      })
  },
  methods: {
    // 调整窗口大小表格处理
    autoResize() {
      console.log(11)
      let dv = document.querySelector('#report')
      let height = (document.body.clientHeight) - 100
      dv.style.height = height + 'px'
    },
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
