<template>
  <div class="nextMonthCheck" >
        <div v-show="checkNav=='month'" class="container">
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
                        <li :class="{checkFaile:checkFaile[0]}">期初余额试算{{checkFaile.StartBalance?'不':''}}平衡</li>
                    </ul>
                </li>
                <li>
                    <div><img src="@/assets/icon/share.svg" alt=""></div>
                    <span>凭证数及审核情况检查</span>
                    <span @click="handle('audit')" v-show="CkeckAudioRes.all-CkeckAudioRes.already>0" class="checkRight">凭证审批</span>
                </li>
                <li v-if="checkCss">
                    <ul>
                        <li :class="{checkFaile:checkFaile[1]}">本期存在未审核凭证 {{CkeckAudioRes.all-CkeckAudioRes.already}} 张{{CkeckAudioRes.res==0?'':',请处理'}}</li>
                        <li>本期凭证数 : {{CkeckAudioRes.all}}</li>
                        <li>本期已审核凭证数 : {{CkeckAudioRes.already}}</li>
                    </ul>
                </li>
                <li>
                    <div><img src="@/assets/icon/share.svg" alt=""></div>
                    <span>凭证断号及序时检查</span>
                    <span @click="handle('codeReset')" v-show="(checkFaile[2]||checkFaile[3])&&checkCss" class="checkRight">凭证重排</span>
                </li>
                <li v-if="checkCss">
                    <ul>
                        <li :class="{checkFaile:checkFaile[2]}">本期凭证{{checkFaile[2]?'':'不'}}存在断号</li>
                        <li :class="{checkFaile:checkFaile[3]}">本期凭证号{{checkFaile[3]?'未':'已'}}按凭证日期排序</li>
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
        <div v-show="checkNav=='audit'" class="audit">
            <p class="title">
                <span >审核凭证</span><i @click="checkNavShow('month')"></i></p> 
            <p class="auditCheck"><span>审核</span></p>  
            <!-- <section  class="listContainer">
                <ul class="listTitle">
                    <li>序号</li>
                    <li>摘要</li>
                    <li>科目</li>
                    <li>借方金额(元)</li>
                    <li>贷方金额(元)</li>
                </ul>
                <ul  @click="choose(item)" :class="{choosed:item.PhId==chooseItem.PhId}" class="listContent" v-for="(item,index) of voucherList" :key="index">
                    <li @dblclick="voucherDel(item)">
                        <ul class="listIndex"><li>{{index+1}}</li></ul>
                        <ul>
                            <li>
                                <span>凭证日期 : {{item.PDate?item.PDate.substring(0,10):''}}</span>
                                <span>凭证字号 : 记-{{item.PNo}}</span>
                                <span>附件数 : {{item.PAttachment}}</span>
                                <span>制单人 : {{item.PMakePerson}}</span>
                                <span>审核人 : {{item.PAuditorName}}</span>
                            </li>
                            <li v-for="(dtl,ind) of item.Dtls" :key="ind">
                                <div class="wrapKemu">
                                    <div>{{dtl.Abstract}}</div>
                                </div>
                                <div class="wrapKemu"> 
                                    <div> 
                                        {{dtl.SubjectCode}}&nbsp;{{dtl.SubjectName}}
                                        <span 
                                            v-for="(item,index) of dtl.DtlAccounts?dtl.DtlAccounts[0].NameValueDtls:0" :key="index">
                                            .{{item.AuxiliaryName}}
                                        </span> 
                                    </div>
                                </div>
                                <div>{{(dtl.JSum==0?'':dtl.JSum) | NUmTurn}}</div>
                                <div>{{(dtl.DSum==0?'':dtl.DSum) | NUmTurn}}</div>
                            </li>
                            <li>
                                <div>合计:{{'sum' | sum(item.Dtls)}}</div>
                                <div>{{'jie'|sum(item.Dtls)}}</div>
                                <div>{{'dai'|sum(item.Dtls)}}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </section>  -->
        </div>
        <div v-show="checkNav=='codeReset'" class="codeReset">
            <p class="title">
                <span >凭证号重排</span><i @click="checkNavShow('month')"></i></p>     
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
          checkNav:'month',
          checkFaile:[
                'true','true','true','true'
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
                case 'audit':
                    this.checkNavShow('audit')
                    break;
                case 'codeReset':
                    this.checkNavShow('codeReset')
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
                 .then(res=>{
                     if(res.Status=='success'){
                         this.checkFaile[0]=false;
                     }
                     //凭证数及审核情况**************
                     this.$axios.get('/PVoucherMst/GetCkeckAudio',{params:data})
                             .then(res=>{
                                 this.CkeckAudioRes=res;
                                 if(res.res==0){
                                     this.checkFaile[1]=false;
                                 }
                                 //时序检查*****************************
                                 this.$axios.get('/PVoucherMst/GetCkeckInTime',{params:data})
                                         .then(res=>{
                                             if(res.Status=='success'){
                                                 this.checkFaile[2]=false;
                                             }
                                             //断号检查********************
                                             this.$axios.get('/PVoucherMst/GetCkeckBreakNo',{params:data})
                                                 .then(res=>{
                                                     if(res.Status=='success'){
                                                         this.checkFaile[3] = false;
                                                     }
                                                     this.checkOutCss=true;
                                                     for(var che of  this.checkFaile){
                                                        if(che){
                                                            this.checkOutCss=false;
                                                        }  
                                                     }
                                                     this.$message("检查结束!")
                                                 })

                                         })

                             })

                 })
                 .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});})

          },
          //获取当前结账的最新月份************
          getChecked(){
              var data={
                  uid:this.uid,
                  orgid:this.orgid,
                  queryfilter:{"JYear*str*eq*1":this.nowTime.getFullYear().toString(),"OrgId*num*eq*1":this.orgid}
              }
              const loading=this.$loading();
              this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                  .then(res=>{
                      this.checkedTime=res.Record[0].JAccountPeriod+1;
                      loading.close();
                  })
                  .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading.close()})
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
                          this.$message({ showClose: true,message: res.Msg, type: "error"});
                      }
                  })
                  .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading1.close();})
          },
        checkNavShow(str){
            this.checkNav=str;
        }
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
        overflow-y: auto;
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
                    position:relative;
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
    .checkRight{
        position:absolute;
        right:40px;
        color:#2473eb;
        border:2px solid #2473eb;
        font-weight:400;
        font-size:16px;
        padding:3px 10px;
        border-radius:3px;
        cursor:pointer;
        &:hover{
            color:#fff;
            background:#2473eb;
        }
    }
    .audit{
        height:80%;
        width:85%;
        background: #fff;
        position:absolute;
        left:5%;
        top:100px;
        padding:5px 15px;
        >.title{
            width:100%;
            height:40px;
            line-height: 40px;
            font-size:18px;
            font-weight: 600;
            border-bottom:1px solid #ccc;
            >span{
                float:left;
            }
            >i{
                float:right;
                margin-top:10px;          
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
        >p.auditCheck{
            height:50px;
            line-height: 50px;
            >span{
                float:right;
                width:80px;
                height:30px;
                text-align: center;
                line-height: 30px;
                margin-top:10px;
                margin-right:30px;
                color:#fff;
                border-radius: 4px;
                background: #00b7ee;
                &:hover{
                    opacity:0.8;
                }
                &:after{
                    content:"";
                    clear: both;
                    display: block;
                }
            }
        }
    }

    .listContainer{
        max-height:85%;
        overflow-y: auto;
        padding:5px;
        margin-top:10px;
        padding-bottom: 20px;
    }
    .listContainer ul.listTitle{
        display: flex;
        background: #d3e9f9 ;
        color:#333;
        
    }
    .listContainer ul.listTitle li{
        text-align: center;
        height:40px;
        line-height: 40px;
    }
    .listContainer ul.listTitle li:first-of-type{
        width:5%;
    }
    .listContainer ul.listTitle li:nth-of-type(2){
        width:31%;
    }
    .listContainer ul.listTitle li:nth-of-type(3){
        width:26%;
    }
    .listContainer ul.listTitle li:nth-of-type(4){
        width:19%;
    }
    .listContainer ul.listTitle li:nth-of-type(5){
        width:19%;
    }
    ul.listContent{
        border-top:1px solid #ccc;
        margin-bottom: 20px;
        background: #fff;
    }    
    ul.listContent.choosed>li>ul.listIndex{
        background: #d3e9f9;
        color:#333;
    
    }
    
    ul.listContent>li {
        width:100%;
        height:100%;
        display: flex;
        overflow: hidden;
        align-items: center;
        position: relative;
    }
        ul.listContent>li> ul.listIndex{
        margin:0;
        border:1px solid #ccc;
        border-top:0;
        height:100%;
        width:5%;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        position:absolute;
            
    }
    ul.listContent>li> ul.listIndex>li:first-of-type{
            border:0;
            width:100%;
            height:100%;
            display: flex;
            align-items: center;
            justify-content:center;
        }
    ul.listContent>li> ul {
        height:100%;
        width: 95%;
        margin-left:5%;
        
    }
    ul.listContent>li> ul>li{
        display: flex;
        justify-content: flex-start;
        height:30px;
        line-height: 30px;
    }
    ul.listContent>li> ul>li:first-of-type{
        padding:0 10px;
        border:1px solid #ccc;
        border-top:0;
        border-left: 0;
    }
    ul.listContent>li> ul>li:first-of-type>span{
            margin-right: 50px;
        }
    ul.listContent>li> ul>li>div{
        text-align: left;
        padding:0 10px;
        border:1px solid #ccc;
        border-top:0;
        border-left:0;
    }
    ul.listContent>li> ul>li div:first-of-type{
        width:32%;
    }
    ul.listContent>li> ul>li div:nth-of-type(2){
        width:28%;
    }
    ul.listContent>li> ul>li div:nth-of-type(3){
        width:20%;
    }
    ul.listContent>li> ul>li div:nth-of-type(4){
        width:20%;
    }
    
    ul.listContent>li> ul>li:last-of-type>div{
        text-align: left;
        border:1px solid #ccc;
        border-top:0;
        border-left:0;
        width:20%;
        
    }
    ul.listContent>li> ul>li:last-of-type>div:first-of-type{
            width:60%;
        }
        ul.listContent>li> ul:nth-of-type(2)>li>div:nth-last-of-type(1),ul.listContent>li> ul:nth-of-type(2)>li>div:nth-last-of-type(2){
            text-align: right;
        }
    
         ul.listContent>li> ul:nth-of-type(2)>li:last-of-type>div{
             padding-left:10%;
         }
</style>
