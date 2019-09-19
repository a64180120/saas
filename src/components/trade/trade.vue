<template>
    <section>
        <div class="trade-content">
            <ul>
                <li v-for="(item,idx) in data" class="trade-item" @click="selectRow(item,idx)">
                    <span :class="[item.Code ===activeIdx?'active':'']">{{item.Value}}</span>
                    <i v-if="item.Code == activeIdx" class="el-icon-check" :class="[item.Code ===activeIdx?'active':'']"></i>
                </li>
            </ul>
        </div>
        <div class="btn-group">
            <el-button @click="close()" style="margin-right:50px;color: #00B8EE; border-color: #00B8EE;">取 消</el-button>
            <el-button :disabled="disabled" :type="btnType" @click="getTrade()">确认</el-button>
        </div>
    </section>
</template>

<script>
    export default {
        name: "trade",
        props:{
          data:{
              type:Array,
              default:function () {
                  return [{
                      Value:'1',
                      Code:'1'
                  }]
              }
          },
            defaultValue:{
              type: String,
              default:''
            }
        },
        data(){
            return{
                activeIdx:this.defaultValue,
                disabled:true,
                btnType:'info'
            }
        },
        watch:{
            activeIdx(value){
                if (value == ''){
                    this.disabled = true
                } else {
                    this.disabled = false
                }
            },
            defaultValue(val){
                console.log(val)
                this.activeIdx = val
                if (val ==''){
                    this.btnType = 'info'
                    this.disabled = true
                } else {
                    this.btnType = 'primary'
                    this.disabled = false
                }
            },
            data:{
                handler(val){
                    console.log(val)
                },
                deep:true

            }
        },
        mounted(){
            let activeItem = this.data.filter((item)=> item.Code === '9999');
            let that = this
            console.log('------------',this.defaultValue)
          if (this.data.indexOf(activeItem[0]) !== -1 && this.defaultValue ==='9999'){
              that.activeIdx = activeItem[0].Code
              this.disabled = false
          }else {
              let x = this.data.filter((item)=> item.Code === this.defaultValue);
              if(this.data.indexOf(x[0]) === -1){
                  this.activeIdx = ''
              }else {
                  this.activeIdx = this.defaultValue
              }
          }
        },
        methods:{
            //点击当前行事件
            selectRow(item,idx){
                let activeItem = this.data.filter((item)=> item.Code === this.activeIdx);
                if (this.data.length ===1 && this.activeIdx === '9999'){
                    return
                }
                if (this.data.indexOf(activeItem[0]) !== -1){
                    if(this.activeIdx === item.Code){
                        this.activeIdx = ''
                    }else {
                        this.activeIdx = item.Code
                    }
                }else {
                    this.activeIdx = item.Code
                }
            },
            //确定按钮
            getTrade(){
                let activeItem = this.data.filter((item)=> item.Code === this.activeIdx);

                this.$emit('getTrade',activeItem[0])
            },
            //关闭按钮
            close(){
                this.$emit('closeBtn')
                setTimeout(()=>{
                    this.activeIdx = this.defaultValue
                },100)
            }

        }
    }
</script>

<style lang="scss" scoped>
    .trade-content{
        height: 430px;
        >ul{
            > .trade-item{
                margin-bottom: 20px;
                cursor: default;
                >.active{
                    color: rgb(0, 184, 238);
                }
                >span{
                    font-size: 18px;
                }
                &:hover{
                    color: rgb(0, 184, 238);
                }
                >i{
                    font-size: 24px;
                    float: right;
                }
            }
        }
    }
    .btn-group{
        text-align: center;
    }
</style>
