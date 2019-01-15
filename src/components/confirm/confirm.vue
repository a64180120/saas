<template>
    <div  class="saasConfirm">
        <div class="saasMsg">
            <p class="title"><span>提示</span>
                <i @click="close(false)"></i>
            </p>
            <div>
                <div class="imgCon"><img src="../../assets/images/error.png"></div>  
                <span >{{message}}</span>
            </div>
            <div>
                <span @click="okClose('ok')" class="btn">确定</span>
                <span @click="noclose('no')" class="btn">取消</span>
            </div>    
        </div>
    </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  mounted(){
    //  var vm=this;
    //  vm.delayTime=parseInt(vm.delay/1000+1);
    //  console.log(vm.delayTime,vm.delay)
    //  vm.$nextTick(vm.oneTime(vm));
  },
  methods:{
      okclose(data){
          this.$emit('ok-click',data);
      },
      noclose(data){
          this.$emit('no-click',data);
      },
      
  },
  props:{    
      message:String,
  },
  computed:{
      
  },
  watch:{
      
  }
}
</script>

<style lang="scss" scoped>
.saasConfirm{
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
        height: 220px;
        position:absolute;
        top:200px;
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
                width:55px;
                height:55px;
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
    background: #00b7ee;
    color:#fff;
    text-align: center;
    border:1px solid #00b7ee;
    border-radius: 5px;
    height:30px;
    line-height: 30px;
    width:90px;
}
.btn:hover{
    background: #fff;
    color:#00b7ee;
}
</style>