<template>
<!--17-->
  <div class="nextMonthCheck">
        <div class="container">
            <p class="flexPublic">
                <span>规范性检查</span>
                <i @click.stop="handle(false)"></i>
            </p>
            <ul>
                <li>
                    <div><img src="@/assets/icon/shuju.svg" alt=""></div>
                    <span>期初余额检查</span>
                </li>
                <li v-if="checkCss">
                    <ul>
                        <li :class="{checkFaile:checkFaile[0].StartBalance}">期初余额试算{{checkFaile.StartBalance?'不':''}}平衡</li>
                    </ul>
                </li>
                <li>
                    <div><img src="@/assets/icon/share.svg" alt=""></div>
                    <span>凭证数及审核情况检查</span>
                </li>
                <li v-if="checkCss">
                    <ul>
                        <li :class="{checkFaile:checkFaile[1].CkeckAudio}">本期存在未审核凭证 {{CkeckAudioRes.all-CkeckAudioRes.already}} 张{{CkeckAudioRes.res==0?'':',请处理'}}</li>
                        <li>本期凭证数 : {{CkeckAudioRes.all}}</li>
                        <li>本期已审核凭证数 : {{CkeckAudioRes.already}}</li>
                    </ul>
                </li>
                <li>
                    <div><img src="@/assets/icon/share.svg" alt=""></div>
                    <span>凭证断号及序时检查</span>
                </li>
                <li v-if="checkCss">
                    <ul>
                        <li :class="{checkFaile:checkFaile[2].CkeckInTime}">本期凭证{{checkFaile[2].CkeckInTime?'':'不'}}存在断号</li>
                        <li :class="{checkFaile:checkFaile[3].CkeckAudio}">本期凭证号{{checkFaile.CkeckAudio?'未':'已'}}按凭证日期排序</li>
                    </ul>
                </li>
            </ul>
            <div>
                <span @click.stop="handle(false)" class="btn">取消</span>
                <span v-if="!checkCss" @click.stop="handle('begin')" class="btn">开始检查</span>
                <span v-if="checkCss&&!checkOutCss" @click.stop="handle('begin')" class="btn">重新检查</span>
                <span v-if="checkCss&&checkOutCss" @click.stop="handle('check')" class="btn">结账</span>
            </div>
        </div>
  </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
  export default {
    name: "next-month-check",
      data(){return {
          month:'',
          year:'',
          nowTime:new Date,
          checkedTime:'',
          checkFaile:[
                {StartBalance:true},
                {CkeckAudio:true},
                {CkeckInTime:true},
                {CkeckBreakNo:true}
          ],
          CkeckAudioRes:'',
          checkOutCss:false,
          checkCss:false
      }},
      mounted(){
          this.getChecked();
      },
      methods:{
        handle(val){
            switch (val){
                case false:
                    this.$emit('child-click',false)
                    break;
                case 'begin':
                    this.matchBegin();
                    this.checkCss=true;
                    break;
                case 'check':
                    this.checkOut('check',this.checkedTime);
                    this.$emit('child-click',false);
                    break;
            }

        },
         matchBegin(){
            var data={
                orgid:this.orgid,
                Year:this.nowTime.getFullYear().toString(),
                Pmonth:this.checkedTime
            }
             var data2={
                 OrgIds:this.orgid,
                 Year:this.nowTime.getFullYear().toString(),
                 Pmonth:this.checkedTime
             }
             //期初余额检查************
             this.$axios.get('/PVoucherMst/GetStartBalance',{params:data2})
                 .then(res=>{console.log(res)
                     if(res.Status=='success'){
                         this.checkFaile[0].StartBalance=false;

                     }
                     //凭证数及审核情况**************
                     this.$axios.get('/PVoucherMst/GetCkeckAudio',{params:data})
                             .then(res=>{console.log(res)
                                 this.CkeckAudioRes=res;
                                 if(res.res==0){
                                     this.checkFaile[1].CkeckAudio=false;
                                 }
                                 //时序检查*****************************
                                 this.$axios.get('/PVoucherMst/GetCkeckInTime',{params:data})
                                         .then(res=>{console.log(res)
                                             if(res.Status=='success'){
                                                 this.checkFaile[2].CkeckInTime=false;
                                             }
                                             //断号检查********************
                                             this.$axios.get('/PVoucherMst/GetCkeckBreakNo',{params:data})
                                                 .then(res=>{console.log(res)
                                                     if(res.Status=='success'){
                                                         this.checkFaile[3].CkeckBreakNo = false;
                                                     }
                                                     this.checkOutCss=true;
                                                     for(var che of this.checkFaile){
                                                         if(che){
                                                             this.checkOutCss=false;
                                                         }
                                                     }
                                                     this.checkOutCss=true;
                                                     this.$message("检查结束!")
                                                 })

                                         })

                             })

                 })
                 .catch(err=>console.log(err))

          },
          //获取当前结账的最新月份************
          getChecked(){
              var data={
                  uid:this.uid,
                  orgid:this.orgid,
                  queryfilter:{"JYear*str*eq*1":this.nowTime.getFullYear().toString(),"OrgId*num*eq*1":this.orgid}
              }
              this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                  .then(res=>{
                      console.log(res);
                      this.checkedTime=res.Record[0].JEnableMonth+1;
                  })
                  .catch(err=>console.log(err))
          },
          //结账功能**********************
          checkOut(str,val){
              var t;
              var url;
              if(str=='check'){
                  url='/PBusinessConfig/UpdateBusinessConfig';
              }else if(str=='uncheck'){
                  if(this.unCheckVal>this.checkedTime-1){
                      this.$message('当前月份还未结账,无法反结账!');
                      return;
                  }
                  url='/PBusinessConfig/UnUpdateBusinessConfig';
              }
              t=this.nowTime.getFullYear()+'-'+val
              var data={
                  orgid:this.orgid,
                  uid:this.uid,
                  dateTime:t
              }
              const loading1=this.$loading();
              this.$axios.get(url,{params:data})
                  .then(res=>{
                      loading1.close();
                      if(res.Status=='success'){
                          this.$message('结账成功!');
                      }else{
                          this.$message('结账失败!');
                      }
                  })
                  .catch(err=>{console.log(err);loading1.close();})
          },
      },
      computed:{
          ...mapState({
              orgid: state => state.user.orgid,
              uid: state => state.user.userid,
          })
      }
  }
</script>

<style lang="scss" scoped>
    .nextMonthCheck{
        background: rgba(0,0,0,0.5);
        position: absolute;
        z-index: 99;
        left:0;
        top:0;
        width:100%;
        height:100%;
        >.container{
            background: #fff;
            padding:10px 30px;
            width:850px;
            min-height:380px;
            margin:100px auto 0;
            border-radius: 10px;
            >p{
                font-size:20px;
                font-weight: 800;
                font-family: Arial;
                padding:5px 5px 10px 5px;
                border-bottom: 1px solid #ccc;
                >i{
                    cursor: pointer;
                    width:25px;
                    height:25px;
                    background: url("../../assets/icon/close.svg");
                    background-size: cover;
                }
            }
            >ul{
                padding:25px 30px;
                border-bottom: 1px solid #ccc;
                >li{
                    display: flex;
                    align-items: center;
                    margin-bottom: 25px;
                    font-size: 18px;
                    font-weight: 600;
                    >div{
                        width:46px;
                        height:46px;
                        background: #fc9f8b;
                        line-height: 46px;
                        text-align: center;
                        margin-right: 20px;
                        >img{
                            width:28px;
                            height:28px;
                            vertical-align: middle;
                        }
                    }
                    &:nth-of-type(2){
                        >div{
                            background: #4faed2;
                        }
                    }
                    &:nth-of-type(3){
                        >div{
                            background: #fb7798;
                        }
                    }
                    >ul{
                        list-style: circle;
                        padding-left: 70px;
                        margin:-10px 0;
                        font-weight: normal;
                        font-size: 17px;
                        >li{
                            margin-bottom: 5px;
                            &.checkFaile{
                                color:red;
                            }
                        }
                    }
                }
            }
            >div{
                display: flex;
                align-items: center;
                justify-content: center;
                >span{
                    margin-left: 40px;
                    margin-top: 8px;
                    height:40px;
                    line-height: 40px;
                    font-size: 16px;
                }
            }
        }
    }
</style>
