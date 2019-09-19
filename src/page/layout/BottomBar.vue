<template>
  <div class="navBottom"
       style="z-index:9">

    <div class="sys-footer"
         :class="{NavShow:barshow,NavHide:!barshow}">
      <transition name="move"
                  mode="out-in"
                  appear>
        <nav-bar :isCollapse="collapsevule"></nav-bar>
      </transition>
      <div class="bottomBorder"></div>
    </div>
    <div class="navtitle navCss"
         @click="Navingclick()"
         :class="{NavShow:barshow,NavHide:!barshow}">
      <div></div>
      <el-button type="success"
                 round
                 size="small">功能导航</el-button>
    </div>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import NavBar from './NavBar'

export default {
  data () {
    return {
      collapsevule: this.isCollapse,
      barshow: true
    }
  },
  props: ["isCollapse"],
  computed: {
    ...mapState({
      username: state => state.user.name,
      lang: state => state.lang
    })
  },
  components: {
    NavBar
  },
  methods: {
    Navingclick () {
      //console.log('123456')
      var old = this.barshow;
      this.barshow = !old;
    }
  }
}
</script>
<style lang="scss" scoped>
.navBottom {
  position: absolute;
  overflow: hidden;
  left: 0;
  bottom: 0px;
  top: 0px;
  width: 180px;
  transition: all 0.2s linear;
  border-radius: 0 5px 5px 0;
  border: 1px solid #ccc;
  border-left: 0;
  border-color: #00b7ee;
  background: #fff;
}
.NavHide {
  width: 50px;
  overflow: hidden;
}
.sys-footer {
  &::-webkit-scrollbar {
    width: 0;
  }
  height: 100%;
  overflow: auto;
}
</style>
