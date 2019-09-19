<template>
    <div v-show="visible"  class="saasConfirm">
        <div class="saasMsg">
            <p class="title"><span>提示</span>
                <i @click="noclose(type)"></i>
            </p>
            <div>
                <div class="imgCon"><img src="../../assets/images/error.png"></div>  
                <span style="float:right;width:290px">{{message}}</span>
            </div>
            <div>
                
                <span @click="noclose(type)"  class="btngrey">{{btn2}}</span>
                <span @click="okclose(type)" style="margin-left:20px" class="btn">{{btn1}}</span>
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
      okclose(type){
          
          this.$emit('ok-click',type,this.data);
      },
      noclose(type){
            this.$emit('no-click',type,this.data);
      },
      // close(){
      //     this.$emit('update:visible',false);
      // },
  },
  props:{
      data:{type:String,
            default:''
      },//参数
      message:String, //提示信息
      btn1:{   //按钮1
        type:String,
        default:'确定'
        },
      btn2:{  //按钮2
        type:String,
        default:'取消'
        },
      type:String,  //本次调用的方法名
      visible:false
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
    position:-ms-page;
    left:0;
    top:0;
    right:0;
    bottom:0;
    z-index:9999;
    background:rgba(0,0,0,0.5);
    box-shadow: 0 0 10px 2px #d3e9f9;
    text-align: center;
    &:after{
        content:"";
        display: inline-block;
        height:100%;
        width:0px;
        vertical-align: middle;
    }
    >.saasMsg{
        width: 370px;
        height: 220px;
        // position:absolute;
        // top:200px;
        // left:40%;
        text-align: left;
        display: inline-block;
        vertical-align:middle;
        background: #fff;
        border:1px solid #ccc;
        font-size:14px;
        padding:20px;
        >div{
            display: flex;
            align-items: center;
            &:first-of-type{
                height:60%;
                font-size:16px;
                overflow-y: auto;
            }
            &:nth-of-type(2){
                margin-top: 10px;
                justify-content: flex-end;
            }
            >.imgCon{
                float:left;
                width:60px;
                height:55px;

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
// .btn{
//     cursor: pointer;
//     background: #00b7ee;
//     color:#fff;
//     text-align: center;
//     border:1px solid #00b7ee;
//     border-radius: 5px;
//     height:30px;
//     line-height: 30px;
//     width:90px;
//     margin-right:20px;
// }
// .btn:hover{
//     background: #fff;
//     color:#00b7ee;
// }
</style>
