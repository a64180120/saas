<template>
    <div v-show="visible" class="saasMsgCon">
        <div class="saasMsg">
            <p class="title"><span>提示</span>
                <i @click="close"></i>
            </p>
            <div>
                <div class="imgCon"><img src="../../assets/images/message.png"></div>  
                <span v-if="delay">{{message}}&nbsp;({{delayTime}}s) 后自动关闭</span>
            </div>
            <div>
                <span @click="close" class="btn">立即关闭</span>
            </div>    
        </div>
    </div>
</template>

<script>

export default {
  data() {
    return {
        delayTime:''
    };
  },
  mounted(){
    //  var vm=this;
    //  vm.delayTime=parseInt(vm.delay/1000+1);
    //  console.log(vm.delayTime,vm.delay)
    //  vm.$nextTick(vm.oneTime(vm));
  },
  methods:{
      close(){
          this.$emit('update:visible',false);
      },
      oneTime(vm){
          var vm=this;
          vm.delayTime--;
          if(vm.delayTime>0){
            setTimeout(vm.oneTime,1000)
          }else{
              vm.close();
          }
      }
  },
  props:{
      delay:Number,
      message:String,
      visible:{type:Boolean}
  },
  computed:{
      
  },
  watch:{
      visible(val){
          var vm=this;
          vm.delayTime=parseInt(vm.delay/1000);
          vm.oneTime(vm);
      }
  }
}
</script>

<style lang="scss" scoped>
.saasMsgCon{
    position:fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:2999;
    background:rgba(0,0,0,0.5);
    box-shadow: 0 0 10px 2px #d3e9f9;
    >.saasMsg{
        width: 370px;
        height: 180px;
        position:absolute;
        top:100px;
        left:40%;
        background: #fff;
        border:1px solid #ccc;
        font-size:14px;
        padding:20px;
        >div{
            display: flex;
            align-items: center;
            &:first-of-type{
                height:50%;
                font-size:16px;
                overflow-y: auto;
            }
            &:nth-of-type(2){
                margin-top: 10px;
                justify-content: flex-end;
            }
            >.imgCon{
                width:60px;
                height:60px;
                margin-right:15px;
                >img{
                    width:100%;
                    height:100%;
                }
            }
        }
    }
}
.title{
        border-bottom: 1px solid #ccc;
        padding:0px 3px 8px 3px ;
        display: flex;
        justify-content: space-between;
        width:100%;
        font-family: Arial;
        font-size: 14.0pt;
        font-style: normal;
        font-weight: 700;
        i{
            background: url("../../assets/icon/close.svg");
            background-size:cover ;
            width:20px;
            height:20px;
            cursor:pointer;
            &:hover{
                opacity:0.7;
            }
        }
    }
.btn{
    cursor: pointer;
    background: #3e8cbc;
    color:#fff;
    text-align: center;
    border:1px solid #3e8cbc;
    border-radius: 5px;
    height:30px;
    line-height: 30px;
    width:90px;
}
.btn:hover{
    background: #fff;
    color:#3e8cbc;
}
</style>