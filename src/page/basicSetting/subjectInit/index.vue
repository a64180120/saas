<template>
  <div class="sys-page">
    <div class="container">

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Auth from "@/util/auth";

//科目期初
export default {
  name: "subjectInit",
  components: { },
  data() {
    return {

    }
  },
  created() {

  },
  //加载数据
  mounted:function(){

  },
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          orgid: state => state.user.orgid
      })
  },
  methods: {

  }
}
</script>
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>

</style>