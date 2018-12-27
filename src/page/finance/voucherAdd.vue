<template>
<!--17-->
    <div class="addVoucher">
        <div class="unionState flexPublic">
            <div class="flexPublic searcherCon">
                <div class="searcherValue" style="width:200px"><input @keyup.13="getvoucherList('searcher')" type="text" v-model="superSearchVal.keyword" placeholder="科目/摘要/凭证号"></div>
                <div @click="getvoucherList('searcher')"  class="searcherBtn">凭证定位</div>
                <ul class="fastGps">
                    <li @click="getvoucher('pre')"></li>
                    <li @click="getvoucher('next')"></li>
                    <li  @click.prevent="addVoucher('moreVoucher')">更多凭证</li>
                    <li @click.stop="nextMonthShow" v-if="!voucherDataList.data.Mst.PhId">做下月账</li>
                </ul>
            </div>
            <ul class="handle">
                <a>
                    <li class="mode" style="width:60px;">
                        <span >模板</span>
                        <span @click.prevent="addVoucher('modelList')" >引用模板</span>
                        <span @click.prevent="addVoucher('keepModel')">存为模板</span>
                    </li>
                </a>
                <a v-if="!voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('keep')" ><li >保存</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('keep')"><li >修改</li></a>
                <a v-if="!voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('keepAdd')"><li style="width:80px">保存并新增</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('audit')"><li >审核</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('unAudit')"><li >反审核</li></a>
                <a v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('delete')"><li >删除</li></a>           
                <a @click.prevent="addVoucher('print')"><li style="width:80px">保存并打印</li></a> 
                <a style="position:relative;display:block;width:80px;height:30px;margin-left:10px">
                    <li class="more" style="width:80px">
                        <ul >
                            <li>更多</li>
                            <li v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('copy')">复制</li>
                            <li v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('cut')">剪切</li>
                            <li v-if="voucherDataList.data.Mst.PhId" @click.prevent="addVoucher('chongh')">冲红</li>
                            <li @click.prevent="addVoucher('reset')">凭证号重排</li>
                        </ul>
                    </li>
                </a>
                <a @click.prevent="addVoucher('fresh')" style="width:40px;margin-left:10px"><li class="fresh"><img src="@/assets/icon/fresh2.svg" alt=""> </li></a>
            </ul>
        </div>
        <!--凭证组件*******************-->
        <div style="overflow-y:auto"  :class="{voucherMask:voucherMask}" ref="print">
            <div class="voucherContainer">
                <p v-if="voucherMask" class="title">
                    <span v-if="voucherMask=='copy'">复制凭证</span><span v-if="voucherMask=='cut'">剪切凭证</span><span v-if="voucherMask=='chongh'">冲红凭证</span><span v-if="voucherMask=='gengz'">更正凭证</span><i @click="voucherMaskShow(false)"></i></p>
                <div v-if="voucherMask">
                    <span class="btn" @click.stop="keepChoose(voucherMask)">保存</span>
                    <span class="btn" @click.stop="keepChoose(false)">取消</span>
                </div>
                <div class="voucherDisabledCon">
                    <div :class="{voucherDisabled:voucherMask=='chongh'}"></div>
                    <voucher :sideDate='sideDate' :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
                </div>
                 <div v-show="!voucherMask" class="voucherBG"><img src="../../assets/images/d.png">  </div>            
            </div>
           
        </div>
        <!--右侧时间选择组件-->
        <div class="asideNav">
            <div @click.stop="yearSelShow"><span>会计期</span></div>
            <p>{{sideDate.split('-')[0]}}</p>
            <div style="overflow:hidden;height:87%">
                <div class="monthsContainer">
                    <ul @mouseleave.stop="dragLeave" @mousemove.stop="dragMove" @mouseup.stop="dragDown(false)" @mousedown.prevent.stop="dragDown(true,$event)"   id="scrollMonth" class="months">
                        <li v-for="item of nowYear-2000"  :key="item">
                            <ul>
                                <li>{{nowYear-item+1}}</li>
                                <li :class="{active:sideDate.split('-')[1]==i&&nowYear-item+1==sideDate.split('-')[0],unchecked:i>checkedTime&&nowYear-item+1==nowYear,futureM:nowYear-item+1==nowYear&&i>nowYear+1}" @click="sideMonth(i,nowYear-item+1)" v-for="i of 12" :key="i">{{i}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <!--会计期弹窗*************************************-->
            <div v-show="yearSelCss" class="yearsContainer">
                <p class="yearsTitle">
                    <span @click="checkOutSel('kuaiji')" :class="{active:monthsSelCss=='kuaiji'}">会计期</span>
                    <span @click="checkOutSel('jiezhang')" :class="{active:monthsSelCss=='jiezhang'}">结账</span>
                    <span @click="checkOutSel('fanjiezhang')" :class="{active:monthsSelCss=='fanjiezhang'}">反结账</span>
                </p>
                <div v-show="monthsSelCss=='kuaiji'" class="yearsContent">
                    <div class="flexPublic">
                        <div>{{year}}</div>
                        <div class="flexPublic">
                            <img @click="nextYear(false)" src="../../assets/icon/leftArr.svg" alt="">
                            <img @click="nextYear(true)" src="../../assets/icon/leftArr.svg" alt="">
                        </div>
                    </div>
                    <ul @click="yearMonthClick"  class="year-month">
                        <li :class="{active:month==index}" v-for="index of 12" :key="index">{{index}}月</li>
                    </ul>
                </div>
                <div v-show="monthsSelCss=='jiezhang'" class="yearsContent jiezhang">
                    <div>
                        <span>结账至</span>
                        <i @click="nextMonth('pre',checkVal,'checkVal')"></i>
                        <div class="inputContainer"><input v-model="checkVal" type="text"></div>
                        <i @click="nextMonth('next',checkVal,'checkVal')"></i>
                        <span>月</span>
                    </div>
                    <p>
                        <span @click="yearsTrue(false)">取消</span>
                        <span @click="yearsTrue('check',checkVal)">确认</span>
                    </p>
                </div>
                <div v-show="monthsSelCss=='fanjiezhang'" class="yearsContent jiezhang">
                    <div>
                        <span>反结账至</span>
                        <i @click="nextMonth('pre',unCheckVal,'unCheckVal')"></i>
                        <div class="inputContainer"><input  v-model="unCheckVal" type="text"></div>
                        <i @click="nextMonth('next',unCheckVal,'unCheckVal')"></i>
                        <span>月</span>
                    </div>
                    <p>
                        <span @click="yearsTrue(false)">取消</span>
                        <span @click="yearsTrue('uncheck',unCheckVal)">确认</span>
                    </p>
                </div>

            </div>
        </div>
        <!--凭证重排****************************-->
        <div v-if="resetShow" class="codeResetContainer">
            <div>
                <p class="flexPublic">
                    <span>凭证重排</span>
                    <i @click="resetCode(false)"></i>
                </p>
                <div  class="yearsContent">
                    <p>请选择会计期</p>
                    <div class="flexPublic">
                        <div>{{year}}</div>
                        <div class="flexPublic">
                            <img @click="nextYear(false)" src="../../assets/icon/leftArr.svg" alt="">
                            <img @click="nextYear(true)" src="../../assets/icon/leftArr.svg" alt="">
                        </div>
                    </div>
                    <ul @click="resetCodeMonth" :class="{allActive:allReset}"  class="year-month">
                        <li :class="{active:month==index}" v-for="index of 12" :key="index">{{index}}月</li>
                    </ul>
                    <div>
                        <p>
                            <label ><input type="checkbox" v-model="allReset">对所有会计期进行凭证号重排</label>
                        </p>
                        <div>
                            <span @click="resetCode(false)" class="btn">取消</span>
                            <span @click="resetCode(true)" class="btn">确认</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- 凭证模板****************** -->
        <voucher-temp v-if="modelListCss" @temp-click="tempClick"></voucher-temp>
        <!-- 下月账******************* -->
        <next-month v-if="nextMonthCss" @child-click="nextMonthHandle"></next-month>
        <div class="footInfo " >
            <router-link to="">服务协议</router-link>
            <router-link to="">运营规范</router-link>
            <router-link to="">关于政云</router-link>
        </div>
        <!-- 存为模板******************** -->
        <div v-if="temp.tempMask" class="tempMask">
            <div>
                 <p  class="title">
                    <span>存为模板</span><i @click="tempMaskShow(false)"></i></p>
                <ul>
                    <li class="flexPublic">
                        <div>模板名称</div><div class="inputContainer"><input placeholder="必填" type="text" v-model="temp.TemName"></div>
                    </li>
                    <li class="flexPublic">
                        <div>保存金额</div>
                        <div><label > <input type="radio" name="tempM" v-model="temp.TemMoney" value='1'> 是 </label><label > <input type="radio" name="tempM" v-model="temp.TemMoney" value='0'> 否</label></div>
                    </li>
                </ul>
                <div class="flexPublic">
                    <span class="btn" @click="tempMaskShow(false)">取消</span><span class="btn" @click="tempMaskShow(true)">保存</span>    
                </div> 
            </div>
        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </div>
</template>

<script>
    import saasMsg from './message'
    import nextMonth from './nextMonthCheck'
    import voucher from './voucher'
    import {mapState, mapActions} from 'vuex'
    import voucherTemp from './vouchertemp'
    //import { getLodop } from '@/plugins/Lodop/LodopFuncs';
    export default {
        name:'voucherAdd',
        data(){return {
            val1:'',
            sideDate:'',
            year:'',
            month:'',
            searchVal:'',
            temp:{ 
                TemName:'',
                TemMoney:0,
                tempMask:false
            },
            
            superSearchVal:{//高级搜索参数******************
                    assistItemList:{type:'',list:''},
                    assistItem:'',
                    sum1:'',
                    sum2:'',
                    date1:'',
                    date2:'',
                    keyword:'',
                    placeholder:'选择辅助项',
                    nodatatext:'',
                    show:true
                },
            userState:0,
            checkVal:'',
            unCheckVal:'',
            checkedTime:'',//下一个结账月*******
            pagesize:10,
            pageindex:0,
            totalRows:'',
            voucherDataList:{bool:false,data:{Mst:'',Attachements:[]}},
            newAddList:[],
            yearSelCss:false,
            nowTime:new Date,
            nowYear:(new Date).getFullYear(),
            monthsSelCss:'kuaiji',
            mouseDown:false,
            mouseStartY:'',
            count:0,
            modelListCss:false,
            nextMonthCss:false,
            allReset:'',
            resetShow:false,
            voucherMask:false,
            
            saasMessage:{
                visible:false,  //消息弹出框*******
                message:'', //消息主体内容**************
                delay:0
            }
        }},
        created(){ 
            if(this.$route.query.list){
                this.$store.commit("tagNav/upexcludeArr", []);
                this.voucherDataList.data.Mst=this.$route.query.list,
                this.resetVoucher();
            } 
        },
        mounted(){  
            this.getChecked();
        },
        methods:{
            //操作列表按钮********
            addVoucher(str){
                var Mst;
                switch(str){
                    case 'keep':
                        this.voucherData();
                        this.keepVoucher();
                        break;
                    case 'keepAdd':
                        this.voucherData();
                        this.keepVoucher('keepAdd');
                        this.resetVoucher();
                        break;
                    case 'modelList':
                        this.modelListCss=true;
                        break;
                    case 'keepModel':
                        this.temp.tempMask=true;
                        this.temp.TemName='';      
                        break;
                    case 'moreVoucher':
                        //this.$store.commit("tagNav/turnCachePage",false);
                        this.$router.push({path:'/finance/voucherList'})
                        break;
                    case 'audit':
                        this.voucherData();
                        if(this.voucherDataList.data.Mst.Verify){
                            this.$message("该凭证已审核!");
                            return;
                        }
                        this.audit(true,this.voucherDataList.data.Mst.PhId);
                        break;
                    case 'unAudit':
                        this.voucherData();
                        if(!this.voucherDataList.data.Mst.Verify){
                            this.$message("该凭证未审核!");
                            return;
                        }
                        this.audit(false,this.voucherDataList.data.Mst.PhId);
                        break;
                    case 'copy':
                        this.voucherMaskShow('copy');
                        break;
                    case 'cut':
                        this.voucherMaskShow('cut');
                        break;
                    case 'chongh':
                        this.voucherMaskShow('chongh');
                        this.chongh();
                        break;
                    case 'delete' :
                        this.voucherData();
                        if(this.voucherDataList.data.Mst.Dtls.length<=0){
                            alert('请输入内容!')
                            return;
                        }
                        var data1={
                            uid:this.uid,
                            orgid:this.orgid,
                            id:this.voucherDataList.data.Mst.PhId
                        }
                        this.delete(data1);
                        this.voucherDataList.data={
                            Mst:{},
                            Attachements:[]
                        }
                        this.resetVoucher();
                        break;
                    case 'reset':
                        if(confirm('凭证号重排过程中不允许取消、暂停操作。确定重排？')){
                            this.resetShow=true;
                        }
                        break;
                    case 'print':
                        this.voucherData();
                        this.keepVoucher('print');
                        break;
                    case 'fresh':
                         this.voucherDataList.data={
                            Mst:{},
                            Attachements:[]
                        }
                        this.voucherDataList.bool=false;
                        this.getChecked();
                        
                        break;
                }
            },
            //保存凭证*******************
            keepVoucher(str){
                var url='Add';
                var oldPhId=this.voucherDataList.data.Mst.PhId;
                var Vdata=this.voucherDataList.data;
                if(str=='gengz'){
                    this.clearPhId(Vdata.Mst);
                    Vdata.Mst.Dtls=Vdata.Mst.Dtls.splice(0,Vdata.Mst.Dtls.length/2);
                }
               if(Vdata.Mst.Dtls.length<=0){
                   this.$message('请输入内容!')
                   return;
               }
               if(Vdata.Mst.PDate){
                   if(typeof(Vdata.Mst.PDate)=='object'){
                       Vdata.Mst.Uyear=Vdata.Mst.PDate.getFullYear();
                       Vdata.Mst.PMonth=Vdata.Mst.PDate.getMonth()+1;
                       var date=Vdata.Mst.PDate.getDate();
                       Vdata.Mst.PDate=(Vdata.Mst.Uyear+'-')+(Vdata.Mst.PMonth<10?('0'+Vdata.Mst.PMonth):Vdata.Mst.PMonth)+'-'+((date)<10?('0'+date):date);
                   }else {
                       Vdata.Mst.PDate=Vdata.Mst.PDate.substring(0,10);
                       Vdata.Mst.Uyear=Vdata.Mst.PDate.substring(0,4);
                       Vdata.Mst.PMonth=Vdata.Mst.PDate.substring(5,7);
                   }
               }else{
                   this.$message('请输入凭证会计期!')
                   return;
               }
               
               if(Vdata.Mst.Uyear==this.nowTime.getFullYear()&& Vdata.Mst.PMonth>=this.checkedTime) {
                   var data = {
                       uid: this.uid,
                       orgid: this.orgid,
                       orgcode: this.orgcode,
                       infoData: this.voucherDataList.data
                   }
                   if (this.voucherDataList.data.Mst.PhId) {
                       url = 'Update';
                   }
                   const loading1=this.$loading();
                   this.$axios.post('/PVoucherMst/Post' + url, data)
                       .then(res => {
                           if (res.Status == 'success') {
                               this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
                               
                               if(str=='keepAdd'){
                                   this.voucherDataList.data={
                                        Mst:{
                                        },
                                        Attachements:[]
                                    }
                                    this.resetVoucher();
                                }
                               if(str=='print'){
                                   this.printContent();
                               }   
                                this.voucherMask=false;
                                if(oldPhId){
                                    this.getVoucherData(oldPhId);
                                }  
                               
                                
                           } else {
                               this.$message(res.Msg)
                           }
                           loading1.close();
                       })
                       .catch(err =>{
                           this.$message(err);loading1.close();
                       } )
               }else if(url=='update'){
                   this.$message('当前月份已结账,无法修改凭证!')
               }else{
                   this.$message('当前月份已结账,无法新增凭证!')
               }
            },
            //手动刷新voucher组件**************************
            resetVoucher(){
                var vm=this;    
                this.voucherDataList.bool=false;    
                function delay(){
                    vm.voucherDataList.bool=true
                }
                setTimeout(delay,5);
            },
            //保存为模板弹窗确认******************
            tempMaskShow(bool){
                if(!bool){
                    this.temp.tempMask=false;
                }else{
                    if(!this.temp.TemName){
                        this.message("请输入凭证名称!")
                    }else{
                        this.voucherData();
                        var dtls=this.voucherDataList.data.Mst.Dtls;
                        if(this.temp.TemMoney==0){
                            for(var dtl of dtls){
                                dtl.JSum='';
                                dtl.DSum='';
                                if(dtl.DtlAccounts){
                                    dtl.DtlAccounts[0].JSum='';
                                    dtl.DtlAccounts[0].DSum='';
                                }
                            }
                        }            
                        this.keepModel(this.temp.TemName);
                        this.temp.tempMask=false;
                    }
                }
            },
            //保存模板**********************
            keepModel(name){
                if(this.voucherDataList.data.Mst.PhId ){
                    this.clearPhId(this.voucherDataList.data.Mst); 
                }
                if(this.voucherDataList.data.Mst.Dtls.length<=0){
                    this.$message('请输入内容!')
                    return;
                }
                this.voucherDataList.data.Mst.TemName=name;
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    infoData:this.voucherDataList.data
                }
                const loading=this.$loading();
                this.$axios.post('/PVoucherTemplateMst/PostAdd',data)
                    .then(res=>{
                        loading.close();
                        if(res.Status=='success'){
                            this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
                            this.voucherDataList.bool=false;
                            this.voucherMask=false;
                            var vm=this;
                            function delay(){
                                vm.voucherDataList.bool=true
                            }
                            setTimeout(delay,10);
                        }else{
                            this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
                        }
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading.close();})
            },
            //审核*****************
            audit(bool,PhId){
                var data={
                    orgid:this.orgid,
                    uid:this.uid,
                    uname:this.uname,
                    infoData:[PhId]
                }
                var url='PVoucherMst/PostAudit';
                if(!bool){
                    url='PVoucherMst/PostUnAudit'
                }
                const loading=this.$loading();
                this.$axios.post(url,data)
                    .then(res=>{
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
                            this.getVoucherData(PhId);
                        }else{
                           this.$message({ showClose: true,message: res.Msg, type: "error"});
                        }
                        loading.close();
                    })
                    .catch(err=>{loading.close();this.$message({ showClose: true,message: err, type: "error"});})
            },
            //删除***********************
            delete(data){ 
                const loading=this.$loading();
                this.$axios.post('PVoucherMst/PostDelete',data)
                    .then(res=>{
                        if(res.Status=='success'){
                             this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
                        }else{
                            this.$message({ showClose: true,message: res.Msg, type: "error"});
                        }
                        loading.close();
                    })
                    .catch(err=>{loading.close();this.$message({ showClose: true,message: err, type: "error"});})
            },
            voucherData(){//接收voucher组件传值************
                this.voucherDataList.data=this.$refs.voucher.voucherData();
                console.log('voucher传值',this.voucherDataList)
            },
            //接收temp组件传值***********************
            tempClick(data){
                if(data){ 
                    data.PersistentState=1;
                for(var dtl of data.Dtls){
                    dtl.PersistentState=1;
                    if(dtl.DtlAccounts){
                        dtl.DtlAccounts[0].PersistentState=1;
                    }
                }
                data.PDate=new Date;
                this.voucherDataList.data.Mst=data;
                console.log(222,data);
                this.resetVoucher(); 
                }
                this.modelListCss=false;
            },
            //接收下月账传值******************
            nextMonthHandle(data){
                if(data===false){
                    this.nextMonthCss=false;
                    this.getChecked();
                }else{
                    console.log(data)
                }
            },
            //获取单个凭证**************
            getVoucherData(PhId){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    id:PhId
                }
                const loading2=this.$loading();
                this.$axios.get('/PVoucherMst/GetVoucher',{params:data})
                    .then(res=>{
                        if(res.Status=='success'){                            
                            this.voucherDataList.data.Mst=res.Data;
                            this.resetVoucher();
                        }else{
                            this.$message({ showClose: true,message: res.Msg, type: "error"});
                        }  
                        loading2.close();                          
                    })
                    .catch(err=>{
                        this.$message({ showClose: true,message: err, type: "error"});loading2.close();
                    })
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
                        this.sideDate=this.nowTime.getFullYear()+'-'+this.checkedTime;
                        this.year=this.sideDate.split('-')[0];
                        this.month=this.sideDate.split('-')[1];
                        this.checkVal=this.checkedTime;
                        this.unCheckVal=this.checkedTime>1?this.checkedTime-1:1;
                        this.superSearchVal.date2=this.superSearchVal.date1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                        this.voucherDataList.bool=true;           
                        this.$forceUpdate(); 
                        loading.close();
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading.close();})
            },
            //前后快速翻页定位凭证****************
            getvoucher(str){
                if(str=='pre'){
                    if(this.count>0){
                        this.count--;
                        this.voucherDataList.data={
                            Mst:this.newAddList[this.count]
                        };
                        this.resetVoucher();
                    }else{
                        if(this.pageindex>0){
                            this.pageindex--;
                            this.getvoucherList('pre');
                        }else{
                            this.$message("已到当前月份第一张!")
                        }
                    }
                }else if(str=='next'){
                    if(this.count<this.newAddList.length-1){
                        this.count++;
                        this.voucherDataList.data={
                            Mst:this.newAddList[this.count]
                        };
                        this.resetVoucher();
                    }else{
                        if(this.totalRows-this.pageindex*this.pagesize<=this.count+1){
                            this.$message("已到当前月份最后一张!")
                        }else{
                            this.pageindex++;
                            this.getvoucherList();
                        }
                    }
                }
            },       
            //凭证列表***************高级搜索***********************
            getvoucherList(val){
                var vm=this;
                const loading1=vm.$loading();
                var data={
                    uid:vm.uid,
                    orgid:vm.orgid,
                    sum1:vm.superSearchVal.sum1,
                    sum2:vm.superSearchVal.sum2,
                    keyword:vm.superSearchVal.keyword,
                    pagesize:vm.pagesize,
                    pageindex:vm.pageindex,
                    sort:['PNo DESC','PType','PDate DESC'],
                   // itemValuePhid:649181122000008,
                    itemValuePhid:vm.superSearchVal.assistItem.PhId,
                    queryfilter:{"PAccper*str*ge*1":vm.superSearchVal.date1.replace('-',''),"PAccper*str*le*1":vm.superSearchVal.date2.replace('-','')}
                }
                vm.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                         if(res.Status=='success'){
                           
                            vm.$message(res.Msg);
                            vm.voucherDataList.data={
                                         Mst:{},
                                         Attachements:[]
                             }
                             vm.resetVoucher();
                             loading1.close();
                             return;
                        } else{   
                            loading1.close();              
                            if(val=='searcher'&&res.Record.length>1){
                               vm.$store.commit("tagNav/upexcludeArr", ['voucherList']);
                                 vm.$router.push({path:'/finance/voucherList',query:{voucherList:res.Record}})   
                            }else if(res.Record.length==0){
                                vm.$message('暂无新凭证!');                  
                                return;
                            }     
                            vm.newAddList=res.Record;
                            vm.count=(val=='pre')?this.newAddList.length-1:0;
                            vm.totalRows=res.totalRows;
                            vm.pagesize=res.size;
                            vm.pageindex=res.index;
                            vm.voucherDataList.data={
                                Mst:vm.newAddList[vm.count]
                            };  
                            vm.resetVoucher();                          
                        }
                    })
                    .catch(err=>{vm.$message({ showClose: true,message: err, type: "error"});loading1.close();})
            },
            
            //选择会计期***************
            sideMonth(i,year){
                this.month=i;
                this.year=year;
                this.sideDate=year+'-'+i;
                this.superSearchVal.date2=this.superSearchVal.date1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                this.getvoucherList('reset');
            },
            //鼠标滚轮移动月份选择****************
            monthsSel($event){
                var month= document.getElementById('scrollMonth');
                var bot=parseInt(month.style.bottom);
                if($event.deltaY=='-100'){
                    if(parseInt(bot)>0){
                        return;
                    }else{
                        month.style.bottom=bot-100+'px';
                    }
                }else if($event.deltaY=='100'){
                    if(bot>-100){
                        month.style.bottom='0px';
                    }else{
                        month.style.bottom=bot+100+'px';
                    }
                }
            },
            //火狐浏览鼠标滚轮移动****************
            foxMonthSel($event){
                var month= document.getElementById('scrollMonth');
                var bot=parseInt(month.style.bottom);

                if($event.detail=='-3'){
                    if(parseInt(bot)>0){
                        return;
                    }else{
                        month.style.bottom=bot-100+'px';
                    }
                }else if($event.detail=='3'){
                    if(bot>-100){
                        month.style.bottom='0px';
                    }else{
                        month.style.bottom=bot+100+'px';
                    }
                }
            },
            //鼠标按下***************
            dragDown(bool,$event){
                if(bool){
                    this.mouseDown=true;
                    this.mouseStartY=$event.clientY;
                }else{
                    this.mouseDown=false;
                    this.mouseStartY='';
                }
            },
            //鼠标离开*********************
            dragLeave(){
                this.mouseDown=false;
                this.mouseStartY='';
            },
            //鼠标移动拖拽*********************
            dragMove($event){
                if(this.mouseDown){
                    var Y=$event.clientY-this.mouseStartY;
                    var month= document.getElementById('scrollMonth');
                    var bot=parseInt(month.style.bottom);
                    if(bot>0){
                        month.style.bottom='0px';
                        return;
                    }
                        month.style.bottom=bot-Y*2+'px';
                    this.mouseStartY=$event.clientY;
                }

            },
            //会计期[反]结账确认选择*****************************
            yearsTrue(str,val){
               if(str=='check'||str=='uncheck'){
                    this.checkOut(str,val);
               }else{
                    this.yearSelCss=false;
               }
            },
            //结账功能 //反结账功能*****************************************
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
                    url='/PBusinessConfig/GetUnUpdateBusinessConfig';
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
                            this.saasMessage={
                                  visible:true,
                                  delay:3000,
                                  message:res.Msg
                               };
                            this.getChecked();
                        }else{
                            this.$message({ showClose: true,message: res.Msg, type: "error"});
                        }
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading1.close();})
            },
            //会计期年份上下切换******
            nextYear(bool){
                var year=this.year;
                if(bool){
                    this.year=year>=this.sideDate.split('-')[0]?year:parseInt(year)+1;
                }else{
                   this.year=year<=2000?year:--year;
                }
            },
            //结账月份加减********************
            nextMonth(str,val,name){
                if(str=='pre'&&val>1){
                    val--;
                }else if(str=='next'&&val<12){
                    val++;
                }
                this[name]=val;
            },
            //会计期弹窗年月份选择*****************
            yearMonthClick($event){
                this.month=parseInt($event.target.innerHTML)
                this.sideDate=this.year+'-'+this.month;
                this.superSearchVal.date2=this.superSearchVal.date1=this.year+'-'+(this.month>9?this.month:('0'+this.month));
                this.getvoucherList('reset');
            },
            //凭证重排月份选择******************
            resetCodeMonth($event){
              this.month= this.month=parseInt($event.target.innerHTML);
            },
            //凭证号重排确认***************
            resetCode(val){
                if(val){
                    const loading5=this.$loading();
                    var data={
                        orgid:this.orgid,
                        Year:this.sideDate.split('-')[0],
                        Pmonth:this.sideDate.split('-')[1]
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
                            
                            if(res.Status=='error'){
                                this.$message(res.Msg);
                            }else if(res.Status=='success'){
                                this.$message('重排成功!');
                                this.resetShow=false;
                            }
                            loading5.close();
                        })
                        .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading5.close();})
                }else{
                    this.resetShow=false;
                }
            },
            //会计期内容切换************************************
            checkOutSel(val){
                this.monthsSelCss=val;
            },
            //会计期窗口弹出**************************
            yearSelShow(){
                this.checkVal=this.checkedTime;
                this.unCheckVal=this.checkedTime>1?this.checkedTime-1:1;
                this.yearSelCss=!this.yearSelCss;
            },
            //做下月账****************
            nextMonthShow(){
                this.nextMonthCss=true;
            },
            //冲红***********************
            chongh(){
                var vm=this;
                this.voucherData();  
                var Mst=this.voucherDataList.data.Mst;
                if(Mst.WriteOff_PhIds.length>0){
                    if(confirm("该凭证已经冲红,需要重新冲红吗?")){
                       
                    }else{
                        this.voucherMaskShow(false);
                        return;
                    }
                }
                var month;
                var date1;
                var oldPhId=this.voucherDataList.data.Mst.PhId;
                month=Mst.PDate.slice(5,7);
                date1=Mst.PDate.slice(8,10);
                for(var dtl of Mst.Dtls){   
                    dtl.Abstract=`注销${month}月${date1}号${Mst.PNo}号凭证`;                   
                    dtl.JSum=dtl.JSum?dtl.JSum*-1:'';
                   dtl.DSum=dtl.DSum?dtl.DSum*-1:'';
                    if(dtl.DtlAccounts){
                        dtl.DtlAccounts[0].JSum=dtl.DtlAccounts[0].JSum?dtl.DtlAccounts[0].JSum*-1:'';
                        dtl.DtlAccounts[0].DSum=dtl.DtlAccounts[0].DSum?dtl.DtlAccounts[0].DSum*-1:'';
                    }
                }
               
                this.clearPhId(this.voucherDataList.data.Mst); 
                this.voucherDataList.data.Mst.PhidTransaction=oldPhId;
                this.voucherDataList.data.Mst.PSource='冲红'
                this.resetVoucher();        
                this.$message("请查看凭证信息,确认无误点击保存!")                      
            },
            //清空凭证phid*****************
            clearPhId(item){
                item.PhId='';
                if(item.PNo){
                    item.PNo='';
                }
                item.PersistentState=1;
                for(var dtl of item.Dtls){
                    dtl.PhId='';
                    dtl.PhidTransaction='';
                    dtl.PhidVouchermst='';
                    dtl.PersistentState=1;
                    if(dtl.DtlAccounts){
                        dtl.DtlAccounts[0].PhId='';
                        dtl.DtlAccounts[0].PhidTransaction='';
                        dtl.DtlAccounts[0].PhidVouchermst='';
                        dtl.DtlAccounts[0].PhidVoucherDel='';
                        dtl.DtlAccounts[0].PersistentState=1;
                    }
                }    
            },
            //打印******************
            // printLodop() {
            //     const me = this
            //     var html=this.$refs.print.innerHTML; 
            //     console.log(html) 
            //     let  LODOP = getLodop();
            //     LODOP.PRINT_INIT("凭证信息");      //首先一个初始化语句
            //     LODOP.SET_PRINT_STYLE("FontSize", 18);  //字体
            //     LODOP.SET_PRINT_STYLE("Bold", 1);
            //     //LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
            //     LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "凭证信息");
            //     LODOP.ADD_PRINT_HTM(88, 200, 350, 600,html);
            //     //LODOP.PRINT();
            //     LODOP.PREVIEW();
            // },
             // 打印
            printContent(e){
                this.$print(this.$refs.print) // 使用
            },
            //复制剪切******************************
            voucherMaskShow(val){
                this.voucherMask=val;
            },
            keepChoose(val){
                var vm=this;
                if(val){
                    this.voucherData();
                    var id = this.voucherDataList.data.Mst.PhId;
                    if(val=='cut'){
                        var data1={
                            uid:this.uid,
                            orgid:this.orgid,
                            id:id
                        }
                        this.cut(data1);
                    }else if(val=='chongh'){
                        var Vdata=this.voucherDataList.data;
                        if(Vdata.Mst.Dtls.length<=0){
                            this.$message('请输入内容!')
                            return;
                        }
                        if(Vdata.Mst.PDate){
                            if(typeof(Vdata.Mst.PDate)=='object'){
                                Vdata.Mst.Uyear=Vdata.Mst.PDate.getFullYear();
                                Vdata.Mst.PMonth=Vdata.Mst.PDate.getMonth()+1;
                                var date=Vdata.Mst.PDate.getDate();
                                Vdata.Mst.PDate=(Vdata.Mst.Uyear+'-')+(Vdata.Mst.PMonth<10?('0'+Vdata.Mst.PMonth):Vdata.Mst.PMonth)+'-'+((date)<10?('0'+date):date);
                            }else {
                                Vdata.Mst.PDate=Vdata.Mst.PDate.substring(0,10);
                                Vdata.Mst.Uyear=Vdata.Mst.PDate.substring(0,4);
                                Vdata.Mst.PMonth=Vdata.Mst.PDate.substring(5,7);
                            }
                        }else{
                            this.$message('请输入凭证会计期!')
                            return;
                        }
                        console.log(Vdata.Mst,this.checkedTime);debugger;
                        if(Vdata.Mst.Uyear==this.nowTime.getFullYear()&& Vdata.Mst.PMonth>=this.checkedTime) {
                            var data = {
                                uid: this.uid,
                                orgid: this.orgid,
                                orgcode: this.orgcode,
                                infoData: this.voucherDataList.data
                            }
                            var oldPhId=this.voucherDataList.data.Mst.PhidTransaction;
                            var oldData=this.voucherDataList.data.Mst;
                            const loading=this.$loading();
                            //this.voucherMask=false; 
                            this.voucherDataList.bool=false; 
                            this.$axios.post('/PVoucherMst/PostAdd', data)
                                .then(res => {
                                    if (res.Status == 'success') {
                                        if(confirm('保存成功，是否生成【更正凭证】？')){
                                            this.voucherMask=true;
                                            vm.voucherDataList.bool=true; 
                                            vm.voucherDataList.data.Mst=oldData
                                            vm.voucherDataList.data.Mst.PhId=oldData.PhidTransaction;
                                            vm.voucherDataList.data.Mst.PSource='更正';
                                            for(var dtl of  vm.voucherDataList.data.Mst.Dtls ){
                                                if(dtl.SubjectCode){
                                                    dtl.Abstract=dtl.Abstract.replace("注销",'更正错账')
                                                }                                            
                                            }
                                            vm.voucherMask='gengz'; 
                                        }else{
                                            vm.voucherMask=false;
                                            vm.getVoucherData(oldPhId);     
                                        }
                                    } else {
                                        this.$message({ showClose: true,message: res.MSg, type: "error"});
                                    }
                                    loading.close();
                                })
                                .catch(err=>{
                                    this.$message({ showClose: true,message: err, type: "error"});
                                    loading.close();    
                                })   
                        }else{
                            this.$message('当前月份已结账,无法新增凭证!')
                        }
                                              
                    }
                    else{
                        //this.clearPhId(this.voucherDataList.data.Mst); 
                        this.keepVoucher(val);
                        this.voucherMask=false; 
                        //this.voucherDataList.bool=false; 
                        //this.voucherDataList={bool:false,data:{Mst:'',Attachements:[]}};    
                    } 
                }else{
                    this.voucherMask=false; 
                    //this.voucherDataList.bool=false; 
                    //this.voucherDataList={bool:false,data:{Mst:'',Attachements:[]}};   
                }
                    
            },
            //剪切*****************
            cut(data1){
                this.$message('功能暂未开放!')
            },
        },
        computed:{
            ...mapState({
                orgid: state => state.user.orgid,
                uid: state => state.user.userid,
                uname: state => state.user.username,
                orgcode: state => state.user.orgcode,
                cachePage:state=>state.tagNav.cachePage  //是否利用路由缓存
            })
        },
        components:{
            voucher,
            voucherTemp,
            nextMonth,
            saasMsg
        }
    }
</script>

<style lang="scss" scoped>
    .addVoucher{
        width:100%;
        min-width: 920px;
        height:100%;
        overflow: hidden;
        overflow-y: auto;
        text-align: left;
        padding:8px 18px;
        padding-right:70px;
        margin-right:10px;
        font-size:14px;
        position:relative;
    }
    .unionState{
        padding-right: 10px;
       // margin-bottom: 30px;
        >ul{
            
            >a:first-of-type{
                position:relative;
                width:70px;
                height:30px;
               
                .mode{
                    width:60px;
                    display: flex;
                    flex-flow: column;
                    height:30px;       
                    overflow: hidden;
                    position:absolute;                   
                    transition:all 0.2s linear;
                    border:1px solid #00b7ee;
                    >span{
                        display: block;
                        width:100%;
                        margin-right:10px;
                        background: #fff;
                        opacity: 1;
                        &:hover{
                            background: #ccc;
                            color:#fff;
                        }
                        &:first-of-type{
                            background: #00b7ee;
                            border:0;
                        }
                    }
                    &:hover{
                        height:90px;
                        border:1px solid #ccc;
                        background: #fff;
                        opacity: 1;
                         z-index: 5;
                        color:#aaa;    
                    }
                }

            }
            .more{
                height:30px;
                overflow:hidden; 
                position: absolute;
                z-index: 2;
                width:100%;
                margin:0;  
                opacity:1;         
                >ul{
                    width:100%;  
                    >li{
                    width:100%;     
                    background: #fff;         
                    color:#999;
                    &:hover{
                        background:#ccc;
                        color:#fff;
                    }
                    &:first-of-type{
                        background: #00b7ee;
                        border-radius: 3px;
                        color:#fff;
                    }
                    
                }
                }
                
                &:hover{
                    height:auto;
                    background: #00b7ee;  
                }
                
            }
        }

    }
    .searcherCon{
        min-width: 432px;
        justify-content: flex-start;
    }
    .fastGps{
        display: flex;
        align-items: center;
        >li{
            &:hover{
                opacity: 0.8;
            }
            margin-left: 5px;
            padding:0 5px;
            background:#00b7ee;
            color:#fff;
            height:30px;
            width:80px;
            line-height: 30px;
            text-align: center;
            cursor:pointer;
            &:first-of-type,&:nth-of-type(2){
                width:30px;
                position:relative;
                &:before{
                    content:"";
                    position: absolute;
                    width:10px;
                    height:10px;
                    top:10px;
                    left:10px;
                    border:2px solid #ddd;
                    border-width: 0 0 2px 2px ;
                    -webkit-transform: rotate(45deg);
                    -moz-transform: rotate(45deg);
                    -ms-transform: rotate(45deg);
                    -o-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
            }
            &:nth-of-type(2):before{
                border-width:2px 2px 0 0  ;
                left:8px;
            }
            &:nth-of-type(3){
                width:70px;
                padding:0;
            }
            // &:nth-of-type(4){
            //     background: #6acccb;
            // }
        }
    }
    .searcherValue{
        border:1px solid #ddd;
        border-radius: 10px 0 0 10px ;
        overflow: hidden;
        padding-left:10px;
    }
    .searcherValue{
        width:30%;
    }
    .searcherValue>input{
        width:100%;
        height:30px;
        outline: none;
        margin:0;
        font-size: 14px;
        border:0;
    }
    .searcherBtn{
        height:30px;
        width:60px;
        min-width: 70px;
        text-align: center;
        line-height: 30px;
        background:#00b7ee;
        color:#fff;
        cursor:pointer;
    }
    .unionState .handle{
        margin-right:20px;
        min-width: 590px;
    }
    .unionState .handle>a{
        float:left;
        min-width:50px;
    }
    .unionState .handle>a>li.more:hover{
        opacity:1;
    }
    .unionState .handle>a>li{
        border:0;
        padding:0;
        color:#fff;
        cursor:pointer;
        border-radius: 3px;
        text-align: center;
        background: #00b7ee;
        width:100%;
        font-size:14px;
        width:50px;
        height:30px;
        line-height: 30px;    
        margin-right: 0;
        &:hover{
            opacity: 0.8;
        }
        &.fresh{
            width:30px;
            min-width:30px;
            border-radius:50%;
            background:none;
            position:relative;
            left:-10px;
            >img{
                height:100%;
            }
            &:hover{
                background: none;
            }
        }
        
    }
    .unionState .handle>a:nth-of-type(4)>li{
        min-width: 60px;
    }
    .unionState .handle>a>li:hover{
        opacity:0.8;
        color:#fff;
    }
    .asideNav{
        width:55px;
        position:absolute;
        right:0px;
        top:0px;
        height: 95%;
        min-height:490px;
        background: #fff;  
        box-shadow:0 0 20px 2px #ccc;
        >div:first-of-type{
            height:34px;
            line-height: 34px;
            text-align: center;
            background: #45c0f7;
            color:#fff;
            cursor: pointer;
            &:hover{
               background:  #00b7ee;
            }
        }
        p{
            text-align: center;
            height:30px;
            line-height: 30px;
            font-size: 18px;
            background: #fff;
            color:#04a9f4;
        }
        .monthsContainer{
            height:100%;
            overflow-y:scroll;
            overflow-x: hidden;     
            position: relative;
            left:7px;     
            width:70px;
            >ul.months{
                position: relative;
                left:-5px;
               >li{
                   >ul> li{
                       &:nth-of-type(2):after,&:nth-of-type(1):after{
                           background: none;
                       }
                       &:after{
                           content:"";
                           position: absolute;
                           width:3px;
                           height:10px;
                           background: #02a7e7;
                           left:45%;
                           top:-12px;

                       }
                       &:first-of-type{
                           margin-top:0;
                       }
                       &:first-of-type:after{
                           content:"";
                           height:0;
                       } 
                       position: relative;
                       width:40px;
                       height:40px;
                       line-height: 40px;
                       font-size: 15px;
                       text-align: center;
                       margin:0 auto;
                       margin-top: 12px;
                       color: #45c0f7;
                       border: #c7e8f7 1px solid;
                       border-radius: 50%;
                       cursor:pointer;
                       &.active.unchecked{
                           color:#fff;
                           background: rgb(3, 169, 244);
                       }
                       &.active{
                           background: rgb(3, 169, 244);
                           box-shadow: 0px 2px 2px #dbf4ff;
                           border: #c7e8f7 1px solid;
                           color:#fff;
                       }
                       &.unchecked{
                           background: #fff;
                           border-color:transparent;
                           color: #CCC !important;
                           border: #ececec 1px solid !important;
                           box-shadow: 0px 2px 2px #e0e0e0 !important;
                           &:after{
                               background: #ccc;
                           }
                        //    &:hover{
                        //        border-color:#aaa;
                        //        background: #ccc;
                        //        color:#333;
                        //    }
                       }
                    //    &.futureM.unchecked{
                    //        
                    //        background: #ccc;
                    //        cursor:default;
                    //    }
                    //    &:hover{
                    //        background: #02a7e7;
                    //        color:#fff;
                    //    }
                       &:first-of-type{
                           border:0;
                           font-size: 15px;
                           font-weight: bold;
                           cursor:default;
                        //    &:hover{
                        //        background: none;
                        //        color:#333;
                        //    }
                       }
                       &:nth-of-type(2){
                           margin-top: 0;
                       }
                   }
               }
            }
        }
        
        .yearsContainer{
            &:before{
                position:absolute;
                content:"";
                right:-7px;
                top:30px;
                width:15px;
                height:15px;
                background: #fff;
                transform: rotate(-45deg);
                box-shadow: 0px 7px 5px 0px #D9D9D9;
            }
            position:absolute;
            top:0;
            z-index:9;
            left:-320px;
            width:300px;
            height:310px;
            background: #fff;
            padding:30px 10px 10px 10px;
            box-shadow: 7px 7px 5px 0px #D9D9D9;
            p{
                background: #fff;
            }
            .yearsTitle{
                border-bottom:1px solid #ccc;
                display: flex;
                align-items: center;
                color:#aaa;
                padding-bottom: 10px;
                >span{
                    width:33.33%;
                    border-right:1px solid #aaa;
                    font-weight: bold;
                    cursor:pointer;
                    &:hover{
                        color:#3e8cbc;
                    }
                    &.active{
                        color:#3e8cbc;
                    }
                    &:last-of-type{
                        border:0;
                    }
                }
            }
            .yearsContent{
                font-size: 15px;
                >div:first-of-type{
                    font-size: 18px;
                    font-weight: bold;
                    padding:10px;
                    margin-left: 10px;
                    >div:nth-of-type(2){
                        width:70px;
                        margin-right: 30px;
                        >img{
                            width:20px;
                            height:20px;
                            transform: rotate(-90deg);
                            position:relative;
                            top:-8px;
                            cursor:pointer;
                            &:first-of-type{
                                transform: rotate(90deg);
                                top:0px;
                            }
                        }
                    }
                }

                >ul{
                    display: flex;
                    align-items: center;
                    flex-flow: row wrap;
                    justify-content: space-between;
                    padding:5px 20px;
                    width:100%;
                    height:160px;
                    >li{
                        width:50px;
                        height:50px;
                        line-height: 50px;
                        text-align: center;
                        cursor:pointer;
                        &:hover{
                            background:#00b7ee ;
                            color:#fff;
                        }
                        &.active{
                            background:#00b7ee;
                            color:#fff;
                        }
                    }
                }
                >p{
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    >span{
                        width:80px;
                        height:30px;
                        line-height: 30px;
                        text-align: center;
                        margin-left: 40px;
                        color:#3e8cbc;
                        border:1px solid #3e8cbc;
                        border-radius: 3px;
                        cursor:pointer;
                        &:hover{
                            color:#fff;
                            background: #3e8cbc;
                        }
                    }
                }
            }
            .jiezhang{
                >div{
                    width:230px;
                    margin: 50px auto ;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    >div{
                        width:50px;

                    }
                    >i{
                        display: block;
                        width:24px;
                        height:24px;
                        border:1px solid #3e8cbc;
                        border-radius: 50%;
                        margin: 5px;
                        background: #3e8cbc;
                        position: relative;
                        cursor: pointer;
                        &:first-of-type{
                            background: none;
                            border-color:#ff9900;
                        }
                        &:before{
                            content:"";
                            width:14px;
                            height:1px;
                            background: #ff9900;
                            position: absolute;
                            top:11px;
                            left:4px;
                        }
                        &:nth-of-type(2):before{
                            background: #fff;
                        }
                        &:nth-of-type(2):after{
                            background: #fff;
                            content:"";
                            width:1px;
                            height:14px;
                            position: absolute;
                            top:4.5px;
                            left:11px;
                        }
                    }
                }
            }
        }

    }
    .codeResetContainer{
        background: rgba(0,0,0,0.5);
        position: absolute;
        z-index: 99;
        left:0;
        top:0;
        width:100%;
        height:100%;
        >div{
            width:300px;
            height:410px;
            margin: 150px auto 0;
            border-radius: 10px;
            background: #fff;
            padding:10px;
            >p:first-of-type{
                height:35px;
                font-size: 18px;
                font-weight: bold;
                border-bottom: 1px solid #ccc;
                padding:5px;
                >i{
                    width:25px;
                    height:25px;
                    background: url("../../assets/icon/close.svg");
                    background-size: cover;
                    cursor:pointer;
                }
            }
            .yearsContent{
                font-size: 15px;
                >p:first-of-type{
                    margin:10px 15px 5px;
                    padding: 5px 0;
                    font-size: 18px;
                    font-weight: bold;
                    border-bottom: 1px solid #ccc;
                }
                >div:first-of-type{
                    font-size: 18px;
                    font-weight: bold;
                    padding:5px 0 0 15px;
                    >div:nth-of-type(2){
                        width:70px;
                        margin-right: 20px;
                        >img{
                            width:20px;
                            height:20px;
                            transform: rotate(-90deg);
                            position:relative;
                            top:-8px;
                            cursor:pointer;
                            &:first-of-type{
                                transform: rotate(90deg);
                                top:0px;
                            }
                        }
                    }
                }
                >div:nth-of-type(2){
                    margin:0 15px;
                    >p{
                        >label{
                            display: flex;
                            align-items: center;
                            color:#000;
                            font-weight: 400;
                            font-size: 16px;
                            input{
                                margin-right: 10px;
                            }
                        }
                        margin-bottom: 20px;
                    }
                    >div{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding:0 15px;
                        >span{
                            height:40px;
                            line-height: 40px;
                        }
                    }
                }
                >ul{
                    display: flex;
                    align-items: center;
                    flex-flow: row wrap;
                    justify-content: space-between;
                    padding:5px 20px;
                    width:100%;
                    >li{
                        width:60px;
                        height:60px;
                        line-height: 60px;
                        text-align: center;
                        cursor:pointer;
                        font-size: 16px;
                        &:hover{
                            background:#00b7ee ;
                            color:#fff;
                        }
                        &.active{
                            background:#00b7ee;
                            color:#fff;
                        }
                    }
                }
                >p{
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    >span{
                        width:80px;
                        height:30px;
                        line-height: 30px;
                        text-align: center;
                        margin-left: 40px;
                        color:#3e8cbc;
                        border:1px solid #3e8cbc;
                        border-radius: 3px;
                        cursor:pointer;
                        &:hover{
                            color:#fff;
                            background: #3e8cbc;
                        }
                    }
                }
                .allActive>li{
                    background:#00b7ee ;
                    color:#fff;
                }
            }
        }

    }
    .voucherMaskActive{
        position:fixed;
        bottom: 0;
        z-index: -1;
    }
    .footInfo{
        position:fixed;
        z-index:10;
        bottom:0;
        left:0;
        width:100%;
        height:50px;
        line-height: 50px;
        background: #2b3245;
        text-align: center;
        color:#fff;
        font-size: 20px;
        >a{
            color:#fff;
            padding:0 20px;
            border-right:1px solid #fff;
            &:last-of-type{
                border:0;
            }
        }
    }
    .voucherContainer{
         position:relative;
         padding:50px 0;
         overflow: hidden;
         margin-right: 10px;   
    }
    .voucherMask{
        position: absolute;
        width:100%;
        height:100%;
        background: rgba(0,0,0,0.3);
        .voucherContainer{        
          width:80%;
          position:absolute;
          background:#fff;
          top:30px;
          left:100px;
          padding:10px;
          >div:first-of-type{
              display: flex;
              justify-content: flex-end;
              padding:5px 10px;
              position: relative;
              z-index: 1;
              >span{
                  margin-left: 20px;
              }
          } 
          >p{
              position: relative;
              z-index: 1;
          }
          
        }
    }
    .voucherBG{
                position:absolute;
                z-index:0;
                left:-40px;
                top:0;
                width:105%;
                height:100%;
                >img{
                    width:100%;
                    height:100%;
                }
            } 
    
    .title{
        border-bottom: 1px solid #ccc;
        padding:8px 3px;
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
    

     .voucherDisabledCon{
         position:relative; 
        // min-height:516px;  
         z-index: 1; 
         background:#fff;
        .voucherDisabled{
            
            position:absolute;
            background: none;
            z-index: 99;
            width:100%;
            height:100%;
            >div{
                position:relative;
                z-index:89;
            }
        }     

    }
    .tempMask{
        width:100%;
        height:100%;
        top:0;
        left:0;
        position:absolute;
        z-index: 999;
        background: rgba(0,0,0,.3);
        >div{
            position: absolute;
            left:30%;
            top:150px;
            width:552px;
            height:246px;
            background: #fff;
            border-radius: 5px;
            padding:5px 15px;
            >ul{
                padding:30px 50px;
                font-size:16px;
                >li{
                    justify-content: flex-start;
                    height:100%;
                    line-height:100%;
                    &:first-of-type{
                        margin-bottom:30px;
                    }
                    
                    >div:first-of-type{
                        width:100px;
                        
                    }
                    >div{
                        >label{
                            margin-right: 20px;
                        }
                    }
                }
            }
            >div{
                justify-content: center;
                >span{
                    margin-left:60px;
                    width:110px;
                    height:35px;
                    line-height: 35px;
                }
            }
        }
    }
</style>
