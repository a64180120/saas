<template>
    <div class="checkOut">
       <div class="checkTitle flexPublic">
           <div>
               本次结账会计期 : <span>2018年9月</span>
           </div>
           <ul>
               <a href="" @click.prevent="standard"><li>规范性检查</li></a>
               <a href=""><li>反结账</li></a>
           </ul>
       </div>
        <div class="checkContent">
            <div class="months">
                <ul>
                    <li v-for="(item,index) of months" :key="index">
                        <div :class="{checked:item.checked,active:date==index+1}">{{item.month}}月</div>
                        <i></i>
                    </li>
                </ul>
            </div>
            <div class="checkList">
                <ul>
                    <li>
                        <div>期初余额检查 </div>
                        <ul v-show="standardCheck">
                            <li>期初余额试算平衡</li>
                        </ul>
                    </li>
                    <li>
                        <div>凭证数及审核情况检查<a href="" @click.prevent="" v-show="standardCheck">凭证审批</a></div>
                        <ul v-show="standardCheck">
                            <li :class="{danger:standardData.noCheck>0}">本期存在未审核凭证 {{standardData.noCheck}}  张，请处理</li>
                            <li>本期凭证数：{{standardData.checks}}</li>
                            <li>本期已审核凭证数：{{standardData.checked}}</li>
                        </ul>
                    </li>
                    <li>
                        <div>凭证断号及序时检查<a href="" @click.prevent="routerTo" v-show="standardCheck">凭证重排</a></div>
                        <ul v-show="standardCheck">
                            <li :class="{danger:standardData.duanhao}">本期凭证存在断号</li>
                            <li>本期凭证号已按凭证日期排序</li>
                        </ul>
                    </li>
                    <li>
                        <div>期末结转检查</div>
                        <ul v-show="standardCheck">
                            <li>XXXXX</li>
                            <li>XXXXX</li>
                        </ul>
                    </li>
                    <li>
                        <div>其他检查</div>
                        <ul v-show="standardCheck">
                            <li>XXXXX</li>
                            <li>XXXXX</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "check-out",
      created(){
        this.init();
      },
      data(){
        return {
            date:'9',
            standardData:{noCheck:3,checks:10,checked:7,duanhao:1},
            months:[
                {month:1,checked:true},
                {month:2,checked:true},
                {month:3,checked:true},
                {month:4,checked:true},
                {month:5,checked:true},
                {month:6,checked:true},
                {month:7,checked:true},
                {month:8,checked:true},
                {month:9,checked:false},
                {month:10,checked:false},
                {month:11,checked:false},
                {month:12,checked:false}
            ],
            standardCheck:false
        }
      },
      methods:{
        init(){

        },
          standard(){
            this.standardCheck=!this.standardCheck;
          },
          routerTo(){
            this.$router.push('/finance/voucherDel');
          }
      }
  }
</script>

<style lang="scss" scoped>
    .checkOut{
        padding:10px;
        min-width: 1024px;
        .checkTitle{
            width:100%;
            height:30px;

            >div{
               width: 300px;
                font-size: 18px;
            }
            >ul{
                display: flex;
                >a>li{
                    font-size: 15px;
                    margin-right: 20px;
                    border:1px solid #ff9900;
                    padding:3px 5px;
                    border-radius: 3px;
                    &:hover{
                        background: #ff9900;
                        color:#fff;
                    }
                }
            }
        }
        .checkContent{
            padding:10px 20px;
            .months{
                >ul{
                    height:100px;
                    min-width: 1024px;
                    padding:10px;
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    >li{
                        width:80px;
                        height:40px;
                        line-height: 40px;
                        display: flex;
                        align-items: center;
                        position:relative;
                        margin-right: 15px;
                        >div{
                            width:40px;
                            text-align: center;
                            border-radius: 50%;
                            background:#ccc;
                            color:#fff;
                            position: relative;
                            cursor:pointer;
                            &.checked{
                                background:#6acccb ;
                            }
                            &.active:before{
                                content:"";
                                position: absolute;
                                top:-20px;
                                left:10px;
                                border:10px solid transparent;
                                border-top-color:#ff9900;
                            }
                            &.active:after{
                                content:"待结账";
                                position: absolute;
                                top:-50px;
                                left:-20px;
                                width:80px;
                                height:30px;
                                line-height: 30px;
                                text-align: center;
                                border-radius: 10px;
                                background: #ff9900;
                            }
                        }
                        >i{
                            width:22px;
                            height:4px;
                            background: #ccc;
                            margin-left: 10px;
                        }
                    }
                    >li:last-of-type{
                        width:40px;
                        >div{
                            width:40px;
                        }
                        >i{
                            display: none;
                        }

                    }
                }
            }
            .checkList{
                min-width: 1024px;
                padding:10px;
                overflow-y: auto;
                height:550px;
                >ul{
                    >li{
                        min-height:100px;
                        border-top:1px solid  #ddd;
                        padding:5px 0;
                        display: flex;
                        flex-flow: column;
                        justify-content: center;
                        padding-left: 60px;
                        font-size: 20px;
                        >div{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            >a{
                                border:2px solid #2473eb;
                                border-radius: 3px;
                                width:80px;
                                height:30px;
                                line-height: 30px;
                                text-align: center;
                                font-size: 13px;
                                color:#2473eb;
                                cursor:pointer;
                            }
                        }
                        >ul{
                            list-style: circle;
                            font-size: 15px;
                            padding:5px 30px;
                            >li{
                                margin-top: 10px;
                            }
                            .danger{
                                color:red;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
