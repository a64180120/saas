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
        <div v-show="(checkNav=='audit')||(checkNav=='codeReset')"  class="audit">
             <!-- 审核 -->
            <p  v-show="checkNav=='audit'" class="title">
                <span >审核凭证</span><i @click="checkNavShow('month')"></i></p> 
            <p  v-show="checkNav=='audit'" class="auditCheck"><span @click="listHandle('audit')">审核</span></p> 

            <!-- 重排 -->
            <p v-show="checkNav=='codeReset'" class="title">
                <span >凭证号重排</span><i @click="checkNavShow('month')"></i></p>   
            <p v-show="checkNav=='codeReset'" class="auditCheck"><span @click="listHandle('codeReset')">开始重排</span></p>    
            <section  class="listContainer">
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
            </section> 
        </div>
         <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
  </div>
</template>

<script>
    import saasMsg from './message'
    import {mapState, mapActions} from 'vuex'
  export default {
    name: "next-month-check",
      data(){return {
          month:'',
          year:'',
          nowTime:new Date,
          pagesize:100,
          pageindex:0,
          checkedTime:'',
          voucherList:[],
          chooseItem:'',
          checkNav:'month',
          saasMessage:{
              message:'',
              visible:false,
              delay:0
          },
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
          //检查页面操作****************
        handle(val){
            switch (val){
                case false:
                    this.$emit('child-click',false)
                    break;
                case 'begin':
                    this.matchBegin();
                    this.checkCss=true;
                    break;
                case 'check': //结账*********
                    this.checkOut('check',this.checkedTime);                    
                    
                    break;
                case 'audit': //凭证审核页面****
                    this.checkNavShow('audit')
                    break;
                case 'codeReset'://凭证号重排****
                    this.checkNavShow('codeReset')
                    break;

            }
        },
        //审核重排页面**************
        listHandle(val){
            var PhIds=[];
            if(val=='audit'){
                for( var vou of this.voucherList){
                    PhIds.push(vou.PhId);
                }
                this.audit(true,PhIds);
            }else if(val=='codeReset'){
                this.resetCode(val);
            }
        },
        //开始检查*********************
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
                                                 },err => {
                                                    console.log(err);
                                                
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
                    loading.close();
                    if(res.Record.length==0){
                        this.saasMessage={
                            message:'当前组织未初始化!',
                            delay:4000,
                            visible:true
                        }
                        
                        return;
                    }  
                    this.checkedTime=res.Record[0].JAccountPeriod+1;
                    this.year=this.nowTime.getFullYear();
                    this.month=this.checkedTime;
                  },err => {
                        console.log(err);
                       
                    })
                  .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading.close()})
          },
          //结账功能**********************
          checkOut(str,val){
              var t;
              var url;
              var vm=this;
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
                          this.$message("结账成功!");
                          this.$emit('child-click',false);
                      }else{
                          this.$message({ showClose: true,message: res.Msg, type: "error"});
                      }
                  },err => {
                        console.log(err);
                       
                    })
                  .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading1.close();})
          },
        
        checkNavShow(str){//切换页面功能*************
            this.checkNav=str;
            if(str=='audit'){
                this.getvoucherList('audit');
            }else if(str=='codeReset'){
                this.getvoucherList();
            }
        },
        //审核*****************
            audit(bool,PhIds){
                var chooseItem=JSON.stringify(this.chooseItem);
                var item=JSON.parse(chooseItem);              
                if(item.PhId<=0){
                    this.$message("请先选择凭证!");
                    return;
                }
                var data={
                    orgid:this.orgid,
                    uid:this.uid,
                    uname:this.uname,
                    infoData:PhIds
                }
                var url='PVoucherMst/PostAudit';
                if(!bool){
                    url='PVoucherMst/PostUnAudit'
                }
                const loading=this.$loading();
                this.$axios.post(url,data)
                    .then(res=>{  
                        loading.close();      
                        if(res.Status=='success'){
                            if(bool){
                                this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'审核成功!'
                               };
                            }else{
                                 this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'反审核成功!'
                               };
                            }
                        }else{
                            if(bool){
                                 this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'审核失败!'
                               };
                            }else{
                                 this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:'反审核成功!'
                               };
                            }
                        }
                    },err => {
                        console.log(err);
                       
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"}),loading.close();})
            },
        //凭证号重排确认***************
        resetCode(val){
                if(val){
                    const loading5=this.$loading();
                    var data={
                        orgid:this.orgid,
                        Year:this.year,
                        Pmonth:this.month
                    }
                    var url='/PVoucherMst/GetRebuilder';
                    if(this.allReset){
                        url='PVoucherMst/GetRebuilderForAllYear';
                        data={
                            orgid:this.orgid,
                            Year:this.sideDate.split('-')[0],
                        }
                    }
                    this.$axios.get(url,{params:data})
                        .then(res=>{
                            console.log(res)
                            if(res.Status=='error'){
                                this.$message(res.Msg);
                            }else if(res.Status=='success'){
                                this.checkNav='month';
                                this.saasMessage={
                                    message:'重排成功,请重新检查!',
                                    visible:true,
                                    delay:4000
                                };
                                this.getvoucherList();
                            }
                            loading5.close();
                        },err => {
                            console.log(err);
                        
                        })
                        .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading5.close();})
                }else{
                    this.resetShow=false;
                }
            },
        //凭证列表***************高级搜索***********************
        getvoucherList(str){
            console.log(this.year.toString()+(this.month>9?this.month:('0'+this.month)).toString())
            var data={
                uid:this.uid,
                orgid:this.orgid,
                pageindex:this.pageindex,
                pagesize:this.pagesize,
                sum1:'',
                sum2:'',
                keyword:'',
                export2excel:str,
                sort:['PNo DESC','PType','PDate DESC'],
                // itemValuePhid:649181122000008,
                itemValuePhid:'',
                queryfilter:{
                     //未审核****   "PAuditor*num*eq*1":0,
                   //已审核****    "PAuditor*num*ge*1":0, 
                    "PAccper*str*ge*1":this.year.toString()+(this.month>9?this.month:('0'+this.month)).toString(),
                    "PAccper*str*le*1":this.year.toString()+(this.month>9?this.month:('0'+this.month)).toString()
                    }
            }
             console.log(this.year.toString()+(this.month>9?this.month:('0'+this.month)).toString())
            if(str=='audit'){
                data.queryfilter={
                   "PAuditor*num*eq*1":0,  //未审核****   
                   //已审核****    "PAuditor*num*ge*1":0, 
                    "PAccper*str*ge*1":this.year.toString()+(this.month>9?this.month:('0'+this.month)).toString(),
                    "PAccper*str*le*1":this.year.toString()+(this.month>9?this.month:('0'+this.month)).toString()
                    };
            }
            this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                .then(res=>{
                    if(res.Status=='success'){
                        this.$message(res.Msg);                  
                        return;
                    }  
                    if(res.Record.length<=0){
                        this.$message('无法找到该凭证!')
                    } else{
                        this.voucherList= res.Record;
                    }
                        
                },err => {
                        console.log(err);
                       
                    })
                .catch(err=>{this.$message({ showClose: true,message: 'err', type: "error"});})
        },
      },
      filters:{
            sum(val,dtl){
                var sum=0;
                var fu='';
                if(!dtl){
                    dtl=[]
                }
                function Num(value) {
                    if(!value||(value==0)) return '';                    
                    /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
                    var intPart =  Number(value)|0; //获取整数部分
                    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
                    var floatPart = ".00"; //预定义小数部分
                    var value2Array = value.toString().split(".");
                    //=2表示数据有小数位
                    if(value2Array.length == 2) {
                        floatPart = value2Array[1].toString(); //拿到小数部分

                        if(floatPart.length == 1) { //补0,实际上用不着
                            return intPartFormat + "." + floatPart + '0';
                        } else {
                            return intPartFormat + "." + floatPart;
                        }

                    } else {
                        return intPartFormat + floatPart;
                    }

                }
                switch(val){
                    case 'jie':
                        for(var d of dtl){
                            if(d.JSum){
                                sum+=parseFloat(d.JSum);
                            }
                        }
                        sum=Num(sum);
                        break;
                    case 'dai':
                        for(var d of dtl){
                            if(d.DSum){
                                sum+=parseFloat(d.DSum);
                            }
                        }
                        sum=Num(sum);
                        break;
                    case 'sum':
                        for(var d of dtl){
                            if(d.JSum){
                                sum+=parseFloat(d.JSum);
                            }
                        }
                        if(sum<0){
                            sum=-1*sum;
                            fu='(负数)'
                        }
                        sum=sum.toFixed(2);
                        var arr1=['零','壹','贰','叁','肆','伍','陆','柒','捌','玖','拾'];
                        var arr2=['','拾','百','千','万','亿'];
                        var str=sum.toString().split('.');
                        var dot='元';
                        var INTstr=str[0];
                        var INT='';
                        var bool=false;
                        var zero='';
                        if(parseInt(str[1])!=0){
                            dot+=arr1[str[1][0]]+'角';
                            if(str[1][1]!=0){
                                dot+=arr1[str[1][1]]+'分'
                            }
                        }else{
                            dot+='整'
                        }
                        for(var i=INTstr.length-1,j=0;i>=0; i--,j++){
                            if(INTstr[i]!=0){
                                bool=true;
                            }
                            if(j==4){
                                INT=arr2[j]+INT;
                            }else if(j==8){
                                INT=arr2[5]+INT;
                            }
                            if(bool){
                                if(INTstr[i]!=0){
                                    if(zero=='零'){
                                        zero='';
                                    }
                                    if(j==4){
                                        INT=arr1[INTstr[i]]+INT;
                                        bool=false;
                                    }else if(j==8){
                                        INT=arr1[INTstr[i]]+INT;
                                    }else{
                                        INT=arr1[INTstr[i]]+arr2[j%4]+INT;
                                        bool=false;
                                    }
                                }else{
                                    if(zero==''){
                                        INT='零'+INT;
                                        zero='零';
                                    }
                                    if(j==4){
                                        INT=arr2[j]+INT;
                                        bool=false;
                                    }else if(j==8){
                                        INT=arr2[5]+INT;
                                        bool=false;
                                    }
                                }
                            }
                        }
                        sum=fu+INT+dot;
                        break;
                }
                
                return sum;

            },
            
            //数字转换******************
            NUmTurn(value){
                if(!value) return '';
                /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
                var intPart =  Number(value)|0; //获取整数部分
                var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断


                var floatPart = ".00"; //预定义小数部分
                var value2Array = value.toString().split(".");

                //=2表示数据有小数位
                if(value2Array.length == 2) {
                    floatPart = value2Array[1].toString(); //拿到小数部分

                    if(floatPart.length == 1) { //补0,实际上用不着
                        return intPartFormat + "." + floatPart + '0';
                    } else {
                        return intPartFormat + "." + floatPart;
                    }

                } else {
                    return intPartFormat + floatPart;
                }
            },
        },
      computed:{
          ...mapState({
              orgid: state => state.user.orgid,
              uid: state => state.user.userid,
              uname: state => state.user.username,
          })
      },
      components:{
          saasMsg,
      }
  }
</script>

<style lang="scss" scoped>
    .nextMonthCheck{
        background: rgba(0,0,0,0.5);
        position: fixed;
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
            box-shadow: 0 0 10px 2px #444;
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
        color:#00b7ee;
        border:2px solid #00b7ee;
        font-weight:400;
        font-size:16px;
        padding:3px 10px;
        border-radius:3px;
        cursor:pointer;
        &:hover{
            color:#fff;
            background:#00b7ee;
        }
    }
    .audit{
        height:80%;
        width:85%;
        min-width:868px;
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
                cursor:pointer;
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
        max-height:70%;
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
    .wrapKemu{
          height:30px;
          font-size: 14px;
         
      }
      ul.listContent > li > ul > li div.wrapKemu>div{
          width:100%;
          height:30px;
          overflow-y: auto;         
      }  
      
       .ul.listContent > li > ul > li > div{
           text-align: left;
           overflow-y: auto;     
       } 
</style>
