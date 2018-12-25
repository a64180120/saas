<template>
    <button class="sendSmsBtn" :class="disabled?'dissendSmsBtn':''" type="button" v-on:click="run" :disabled="disabled || time > 0">{{ text }}</button>
</template>

<script>
import { mapState, mapActions } from "vuex";

//附件
export default {
  name: "pictureUpload",
  props: {
        second: {
            type: Number,
            default: 60
        }
  },
  data() {
    return {
        time: 0,
        disabled:false
    };
  },
  //计算
  computed: {
    ...mapState({
        userid: state => state.user.userid,
        orgid: state => state.user.orgid
    }),
    text: function () {
        return this.time > 0 ? this.time + 's 后重获取' : '获取验证码';
    }
  },
  watch:{},
  //加载数据
  mounted(){

  },
  methods: {
        ...mapActions({
            uploadFile: 'uploadFile/Voucherupload'
        }),
        run(){
            this.$emit('run');
        },
        start(){
            this.time = this.second;
            console.log(this.disabled);
            this.timer();
        },
        setDisabled(val){
            this.disabled = val;
        },
        timer(){
            if (this.time > 0) {
                this.time--;
                setTimeout(this.timer, 1000);
            }else{
             this.disabled = false;
            }
        }
  }
};
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
.sendSmsBtn{
    position: absolute;
    right: 0px;
    height: 34px;
    line-height: 34px;
    border-radius: 3px;
    background: #ffb400;
    border: none;
    padding: 0 6px;
    color: #fff;
    display: inline-block;
    width: 90px;
    top: 12px;
}
.sendSmsBtn.dissendSmsBtn{
    background-color: #FFE39F;
}
</style>