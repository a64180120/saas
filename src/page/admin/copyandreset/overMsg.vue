<template>
  <div class="overMsg">
    <div class="msg clear">
      <div><img src="@/assets/images/message.png"
             alt=""> </div>
      <div>
        云备份记录已经满20次,如继续操作,请删除部分备份记录后再操作。如点击【继续执行】，则
        <span style="color:red">系统自动删除最早期的备份记录，删除后无法回退</span>
        ，请谨慎操作。
      </div>
    </div>
    <p class="textR">
      <span @click="cancle"
            class="btngrey">取消</span>
      <span @click="stillGo"
            class="btn">继续执行</span>
      <span @click.stop="showCopylist=true"
            class="btn">删除备份记录</span>
    </p>
    <el-dialog append-to-body
               :visible.sync="showCopylist"
               title="数据备份记录"
               custom-class="eldialogClass">
      <copy-list @close="closeCopylist"
                 v-if="showCopylist"></copy-list>
    </el-dialog>
  </div>
</template>

<script>
import copyList from './copyList'
export default {
  props: {
  },
  name: 'overMsg',
  data () {
    return {
      showCopylist: false,
    }
  },
  methods: {
    cancle () {

      this.$emit('cancle', false)
    },
    closeCopylist () {
      this.showCopylist = false;
    },
    stillGo () {
      this.$emit('still-go', )

    }
  },
  components: {
    copyList
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/baseColor.scss";
.overMsg {
  border-top: 1px solid $bordercolor;
  .msg {
    font-size: 15px;
    height: 120px;
    padding-top: 30px;
    > div {
      float: left;
      width: 60px;
      height: 60px;
      &:last-of-type {
        width: 440px;
        margin-left: 10px;
        text-indent: 2em;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  > p {
    span {
      margin-left: 10px;
    }
  }
}
</style>

<style lang="scss">
.eldialogClass {
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
