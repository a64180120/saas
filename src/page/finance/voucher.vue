<template>

    <div class="voucher">
        <div class="voucherHead">
            <ul class="flexPublic">
                <li><span>凭证字号: </span><span>{{PNo?'记-':''}}</span>  <span>{{PNo}}</span></li>
                <li>
                    <div class="block">
                        <span class="demonstration">凭证日期: </span>
                        <el-date-picker
                            v-model="PDate"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </li>
                <li class="flexPublic">
                    <div class="flexPublic">附单据&nbsp;<span class="fileCount">{{PAttachment}}</span>&nbsp;张&nbsp;</div>
                    <div @click.stop="picUploadShow" class="uploaderTitle"></div>               
                </li>
            </ul>
        </div>
        <div  class="voucherContent">
            <div @click.stop="moneyInputHide" v-show="moneyInputMask" class="moneyInputMask"></div>
            <div  v-show="assistItemMask" class="assistItemMask"></div>
            <ul>
                <li>
                    <ul class="flexPublic voucherContentItem">
                        <li>摘要</li>
                        <li>科目</li>
                        <li>
                            <div>借方金额</div>
                            <div class="flexPublic money">
                                <div>亿</div>
                                <div>千</div>
                                <div>百</div>
                                <div>十</div>
                                <div>万</div>
                                <div>千</div>
                                <div>百</div>
                                <div>十</div>
                                <div>元</div>
                                <div>角</div>
                                <div>分</div>
                            </div>
                        </li>
                        <li>
                            <div>贷方金额</div>
                            <div class="flexPublic money">
                                <div>亿</div>
                                <div>千</div>
                                <div>百</div>
                                <div>十</div>
                                <div>万</div>
                                <div>千</div>
                                <div>百</div>
                                <div>十</div>
                                <div>元</div>
                                <div>角</div>
                                <div>分</div>
                            </div>
                        </li>
                    </ul>
                </li>
                <li v-for="(item,index) of voucherInfo" :key="index">
                    <ul  class="flexPublic voucherContentItem">
                        <div v-show="addIcon[index].checked">
                            <div @click="handleContent(true,index)" class="addIcon"></div>
                            <div @click="handleContent(false,index)" class="deleteIcon"></div>
                        </div>
                        <li>
                            <div class="inputContainer" >
                                <textarea :class="{chongHcss:AbstractCss=='冲红'}" v-model="item.Abstract" @focus="showAddIcon(index)" ></textarea>
                            </div>
                        </li>
                        <li @click.stop="handleKemuSel(index)" class="kemu">
                            <div>
                                <ul>
                                    <li >
                                        <div >
                                           <span>{{item.SubjectCode}} &nbsp;{{item.SubjectName}}</span> 
                                            <span v-show="item.DtlAccounts.assistItem"  v-for="(assist,index) of item.DtlAccounts.assistItem" 
                                                    :key="index">{{assist.BaseName?('.'+assist.BaseName):''}}</span>
                                        </div>
                                    </li>
                                    <li v-show="item.SubjectCode"><span v-if="item.balance">余额:</span><span v-if="item.balance">{{item.balance}}</span></li>
                                    <li v-show="item.SubjectCode" class="kemuCancle" @click.stop="kemuCancle($event,index,item)"><i></i></li>
                                </ul>
                            </div>
                            <searchSelect style="z-index:10" :itemlists="itemlists[index]" :placeholder="itemlistText" v-if="kemuSel[index].checked"
                                          :nodatatext="itemText" @item-click="itemClick"></searchSelect>
                            <div @click.stop="1" v-show="assistItem[index].checked" class="assistContainer">
                                <ul>
                                    <li v-for="(assist,index2) of assistList" :key="index2">
                                        <div :title="assist.BaseName">{{assist.BaseName}}</div>
                                        <div class="selectContainer">
                                            <select  v-model="assistSels[index2]">
                                                <option :value="val" v-for="(val,index) of assist.Children" :key="index">{{val.BaseName}}</option>
                                            </select>
                                        </div>
                                    </li>
                                </ul>
                                <p><span @click.stop="assistOk(true,item,index)">确认</span><span @click.stop="assistOk(false,item,index)">取消</span></p>
                                <router-link to="/setting/auxiliary">添加辅助项</router-link>
                            </div>
                        </li>
                        <li @click="moneyInputShow(item,'jiefang')" class="flexPublic money">
                            <span :class="{moneyInputShow:item.moneyInput.jiefang}" class="moneyValCon">
                                <input type="text"  v-model="item.money.jiefang" @blur="inputBlur($event,item,'jiefang')" placeholder="请输入金额"
                                       onkeyup="this.value=this.value.replace(/e/g,'')" onafterpaste="this.value=this.value.replace(/e/g,'')" >
                                <i @click.stop="moneyCancle(item,'jiefang')" class="inputCancle">X</i>
                             </span>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </li>
                        <li @click="moneyInputShow(item,'daifang')" class="flexPublic money">
                            <span :class="{moneyInputShow:item.moneyInput.daifang}" class="moneyValCon">
                                <input type="text"  v-model="item.money.daifang" @blur="inputBlur($event,item,'daifang')" placeholder="请输入金额"
                                       onkeyup="this.value=this.value.replace(/e/g,'')" onafterpaste="this.value=this.value.replace(/e/g,'')" >
                                <i @click.stop="moneyCancle(item,'daifang')" class="inputCancle">X</i>
                            </span>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </li>
                    </ul>
                </li>
                <li>
                    <ul class="flexPublic voucherContentItem count">
                        <li >合计</li>
                        <li  class="flexPublic money">
                            <span></span>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </li>
                        <li  class="flexPublic money">
                            <span></span>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="voucherFoot">
            <ul class="flexPublic ">
                <li><label>财务主管: <span>{{PFinancePerson}}</span> </label></li>
                <li><label>记账:<span>{{PKeepingPerson}}</span></label></li>
                <li><label>审核人: <span>{{PAuditorName}}</span></label></li>
                <li><label>制单: <span>{{PMakePerson}}</span></label></li>
                <li><label>出纳: <span>{{PCashier}}</span> </label></li>
            </ul>
        </div>
        <!-- 附件弹出框 -->
        <el-dialog title="选择附件"  :visible.sync="picVisible" :modal=false width="40%">
            <picture-upload @uploadimg="uploadimg" :imgList="imglist" :limit="3" @removeimg="removeimg"></picture-upload>
        </el-dialog>
    </div>
</template>

<script>
    import searchSelect from './searchSelect'
    import {mapState, mapActions} from 'vuex'
    import UserInfo from "@/util/auth";
    import { SysOrgModel,SysOrgUpdate,SysOrgUploadFile,SysOrgDelete } from '@/api/organize/orgInfo'
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import pictureUpload from "@/components/upload";
    export default {
        name: "voucher",
        props:{
            'dataList':Object,
            'sideDate':String
        },
        data(){return{
            fatherData:'',
            fileList:[],
            PhId:'',
            PDate:'',
            PNo:'',
            PAuditorName:'',
            PMakePerson:'',
            PFinancePerson:'',
            PKeepingPerson:'',
            PCashier:'',
            PAuditor:'',
            PType:'',
            Verify:'',
            jiefang:'',
            daifang:'',
            PersistentState:'1',
            //附件****************
            Attachements:[],
            loading: false,
            picVisible:false,     //图片上传显示
            imglist:[],//上传附件参数
            balance:'',//余额
            voucherInfo:[],//凭证内数据****************
            deleteDtls:[],//删除行的数据************************
            itemlists:[],//科目组件参数**************
            assistList:[],//科目下辅助项列表******************
            itemlistText:'选择科目',
            itemText:'添加科目',
            moneyInputMask:false,
            assistSels:[],//选中的辅助项列表************
            subjectlist:[],//所有科目列表*****************
            addIcon:[],//添加删除的按钮样式参数****************
            kemuSel:[],//科目选择框显示隐藏样式参数************
            assistItem:[],//辅助项显示隐藏样式参数********************
            assistItemMask:false,//辅助项遮罩********
            assistCheck:true,
            sideDateNew:'',
            nowTime:new Date,
            AbstractCss:false
        }},
        created(){
            if((!this.dataList.data.Mst)||typeof(this.dataList.data.Mst)=='string'){//没有传参时初始化页面
                this.voucherInfo=[
                    this.initVoucherInfo(),
                    this.initVoucherInfo(),
                    this.initVoucherInfo(),
                    this.initVoucherInfo(),
                    this.initVoucherInfo(),
                ]
                this.fatherData={
                    PhId:'',
                    Dtls:[]
                }
                this.PMakePerson=this.username;
                if(!this.sideDate){
                    this.sideDateNew=this.sideDate;
                } else{
                    this.sideDateNew=this.nowTime.getFullYear()+'-'+ (parseInt(this.$store.state.Pconfig.jmonth)+1);
                
                }
                this.getFreshVoucher();
            }else{   
                this.getVoucherData(this.dataList.data.Mst);
                if(this.dataList.data.Mst.PhId){
                    this.getAttachements(this.dataList.data.Mst.PhId);
                }   
            }
            this.initInfoCss();
        },
        mounted(){
            this.initMoneyCss();
            this.getSubject();         
        },
        methods:{
            //voucher组件要返回数据的函数********************
            voucherData() {
                if(this.jiefang!==this.daifang){
                    alert('借方金额不等于贷方金额,请查看');
                    return;
                }else{
                    var dtls; 
                    if(!this.fatherData.PhId){
                        dtls=[];
                    }else{
                        dtls= this.fatherData.Dtls;
                    }
                    var account;
                    var item;


                    for( var info of this.voucherInfo){
                        if(info.PhId){
                            for(var dtl of  dtls){
                                if(dtl.PhId==info.PhId){
                                    dtl.SubjectCode=info.SubjectCode;
                                    dtl.SubjectName=info.SubjectName;
                                    dtl.Abstract=info.Abstract;
                                    dtl.JSum=info.money.jiefang;
                                    dtl.DSum=info.money.daifang;
                                    dtl.PersistentState=2;
                                    if(dtl.DtlAccounts&&info.DtlAccounts.assistItem.length>0){
                                        dtl.DtlAccounts[0].JSum=info.money.jiefang;
                                        dtl.DtlAccounts[0].DSum=info.money.daifang;
                                        dtl.DtlAccounts[0].SubjectCode=info.SubjectCode;
                                        dtl.DtlAccounts[0].SubjectName=info.SubjectName;
                                        dtl.DtlAccounts[0].Abstract=info.Abstract;
                                        item = info.DtlAccounts.assistItem;
                                        account=dtl.DtlAccounts[0];
                                        for(var i of item){
                                            account[i.GLS]=i.PhId;
                                        }
                                        dtl.DtlAccounts[0].PersistentState=2;
                                    }else if(dtl.DtlAccounts&&info.DtlAccounts.assistItem.length<=0){
                                        dtl.DtlAccounts[0].PersistentState=3;
                                    }else if(!dtl.DtlAccounts&&info.DtlAccounts.assistItem.length>0){
                                        dtl.DtlAccounts=[{
                                        }];
                                        dtl.DtlAccounts[0].JSum=info.money.jiefang;
                                        dtl.DtlAccounts[0].DSum=info.money.daifang;
                                        dtl.DtlAccounts[0].SubjectCode=info.SubjectCode;
                                        dtl.DtlAccounts[0].SubjectName=info.SubjectName;
                                        dtl.DtlAccounts[0].Abstract=info.Abstract;
                                        dtl.DtlAccounts[0].PersistentState=1;
                                        item = info.DtlAccounts.assistItem;
                                        account=dtl.DtlAccounts[0];
                                        for(var i of item){
                                            account[i.GLS]=i.PhId;
                                        }
                                    }
                                }
                            }
                        }
                        else if(info.SubjectCode){
                            var newDtl={
                                Abstract:info.Abstract,
                                SubjectCode:info.SubjectCode,
                                SubjectName:info.SubjectName,
                                JSum:info.money.jiefang,
                                DSum:info.money.daifang,
                                PersistentState:1
                            }
                            if(info.DtlAccounts.assistItem.length>0){
                                newDtl.DtlAccounts=[];
                                var dt={
                                    Abstract:info.Abstract,
                                    SubjectCode:info.SubjectCode,
                                    SubjectName:info.SubjectName,
                                    JSum:info.money.jiefang,
                                    DSum:info.money.daifang,
                                    PersistentState:1
                                }
                                item = info.DtlAccounts.assistItem;
                                for(var i of item){
                                    dt[i.GLS]=i.PhId;
                                }
                                newDtl.DtlAccounts[0]=dt;
                            }
                            dtls.push(newDtl);
                        }
                    }
                    this.fatherData.Dtls=dtls;
                    for(var del of this.deleteDtls){
                        if(del.PhId){
                            for(var dtl of  dtls){
                                if(dtl.PhId==del.PhId){
                                    dtl.PersistentState=3;
                                    if(dtl.DtlAccounts){
                                        dtl.DtlAccounts[0].PersistentState=3;
                                    }
                                }
                            }
                        }
                    }
                    if(!this.PhId){
                        this.fatherData.PType='记';
                        this.fatherData.OrgId=this.orgid;
                        this.fatherData.OrgCode=this.orgcode;
                        this.fatherData.PersistentState=1;
                    }else{
                        this.fatherData.PersistentState=2;
                        this.fatherData.PhId=this.PhId;
                    }
                    this.fatherData.PDate=this.PDate;
                    this.fatherData.PAttachment=this.PAttachment;
                    if(!this.PMakePerson){
                        this.PMakePerson=this.username;
                    }
                    this.fatherData.PMakePerson=this.PMakePerson;
                    this.fatherData.PFinancePerson=this.PFinancePerson;
                    this.fatherData.PKeepingPerson=this.PKeepingPerson;
                    this.fatherData.PCashier=this.PCashier;
                    this.fatherData.PAuditor=this.PAuditor;
                    for(var img in this.imglist ){
                        if(this.imglist[img]){
                            this.Attachements[this.Attachements.length]=this.imglist[img];
                            if(this.Attachements[this.Attachements.length-1].PhId==0){
                                this.Attachements[this.Attachements.length-1].PersistentState=1;
                                this.Attachements[this.Attachements.length-1].BTable='gcw3_voucher_mst';
                                this.Attachements[this.Attachements.length-1].BusinessPrimaryKeys='';
                                this.Attachements[this.Attachements.length-1].ForeignKeys='';
                            }
                        }
                        
                    }
                    return {
                        Mst:this.fatherData,
                        Attachements: this.Attachements
                    }
                }
            },
            //添加删除行信息********************************
            handleContent(bool,index){
                if(bool){
                    this.voucherInfo.push(this.initVoucherInfo());
                    this.addIcon[this.voucherInfo.length-1]={checked:false};
                    this.kemuSel[this.voucherInfo.length-1]={checked:false};
                    this.assistItem[this.voucherInfo.length-1]={checked:false};
                    this.itemlists[this.voucherInfo.length-1]={id:this.voucherInfo.length-1,kemu:this.subjectlist}
                    /*
                                        this.assistItems[this.voucherInfo.length-1]={id:this.voucherInfo.length-1,kemu:['1','2','3','4','5']}
                    */
                }else{
                    if(this.voucherInfo.length>1){
                        if(this.voucherInfo[index].PhId){
                            this.deleteDtls.push(this.voucherInfo[index]);
                        }
                        this.voucherInfo.splice(index,1);
                        this.initMoneyCss();
                    }
                }
            },
            initVoucherInfo(){
                return {moneyInput:{jiefang:false,daifang:false},SubjectCode:'',SubjectName:'',DtlAccounts:{assistItem:[]},Abstract:'',money:{jiefang:'',daifang:''}}
            },
            //初始化信息样式***************
            initInfoCss(){
                for(var i in this.voucherInfo){
                    this.addIcon[i]={checked:false}
                    this.kemuSel[i]={checked:false}
                    this.assistItem[i]={checked:false}
                    this.itemlists[i]={
                        id:i,
                        kemu:this.subjectlist  //总的科目列表
                    }
                }
            },
            //获取最新一个凭证
            getFreshVoucher(){
                const loading1=this.$loading();
                if(!this.sideDateNew){
                    this.sideDateNew=this.nowTime.getFullYear()+'-'+this.nowTime.getMonth()
                }
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    sum1:'',
                    sum2:'',
                    keyword:'',
                    pagesize:3,
                    pageindex:0,
                    sort:['PDate DESC','PNo DESC'],
                   // itemValuePhid:649181122000008,
                    itemValuePhid:'',
                    queryfilter:{"PAccper*str*ge*1":this.sideDateNew.split('-')[1]>9?this.sideDateNew.replace("-",''):(this.sideDateNew.split('-')[0]+'0'+this.sideDateNew.split('-')[1]),
                                    "PAccper*str*le*1":this.sideDateNew.split('-')[1]>9?this.sideDateNew.replace("-",''):(this.sideDateNew.split('-')[0]+'0'+this.sideDateNew.split('-')[1])}
                }
                this.$axios.get('/PVoucherMst/GetVoucherList',{params:data})
                    .then(res=>{
                       
                        if(res.Record.length<=0){
                            this.PDate=this.nowTime;                     
                        } else{                         
                            this.PDate=res.Record[0].PDate;
                        }   
                        
                        loading1.close();
                    })
                    .catch(err=>{
                        this.$message({ showClose: true,message: 'err', type: "error"});loading1.close();
                    })
            },
            //获取父组件传参*********************************
            getVoucherData(data){
                this.fatherData=data;
                this.PhId=data.PhId;
                this.PType=data.PType;
                this.PNo=data.PNo;
                this.PAttachment=data.PAttachment;
                this.PMonth=data.PMonth;
                this.PMakePerson=data.PMakePerson;
                this.PFinancePerson=data.PFinancePerson;
                this.PKeepingPerson=data.PKeepingPerson;
                this.PCashier=data.PCashier;
                this.PAuditor=data.PAuditor;
                this.PAuditorName=data.PAuditorName;
                this.Verify=data.Verify;
                this.PDate=data.PDate;
                var dtls=data.Dtls;
                var reg=/^S[0-5][0-9]$/;
                for(var i in dtls){
                    this.voucherInfo[i]=this.initVoucherInfo();
                    this.voucherInfo[i].PhId=dtls[i].PhId;
                    this.voucherInfo[i].SubjectCode=dtls[i].SubjectCode;
                    this.voucherInfo[i].SubjectName=dtls[i].SubjectName;
                    this.voucherInfo[i].Abstract=dtls[i].Abstract;
                    this.voucherInfo[i].money.jiefang=dtls[i].JSum==0?'':dtls[i].JSum;
                    this.voucherInfo[i].money.daifang=dtls[i].DSum==0?'':dtls[i].DSum;
                    if(dtls[i].DtlAccounts&&dtls[i].DtlAccounts[0].NameValueDtls){
                        this.voucherInfo[i].DtlAccounts.assistItem=dtls[i].DtlAccounts[0].NameValueDtls;
                    }
                }
                if(this.voucherInfo.length<5){
                    var leng=5-this.voucherInfo.length;
                    for(var k=0;k<leng;k++){
                        this.voucherInfo.push(this.initVoucherInfo());
                    }
                }
                this.AbstractCss=data.PSource?data.PSource:'';//摘要样式******************
                
            },
            //获取附件信息*******************
            getAttachements(PhId){                 
                    var data={
                        uid:this.uid,
                        orgid:this.orgid,
                        id:PhId
                    }
                    const loading=this.$loading();
                    this.$axios.get('PVoucherMst/GetAttachmentListByID',{params:data})
                    .then(res=>{
                        
                        this.imglist=res.Record;
                        loading.close();
                    })
                    .catch(err=>{
                            this.$message({ showClose: true,message: err, type: "error"});loading.close();
                        }
                    )
            },
            //获取科目列表******************
            getSubject(){
                const loading1=this.$loading();
                var data={
                    orgid:this.orgid,
                    Ryear:(new Date).getFullYear()
                }
                this.$axios.get('/PSubject/GetPSubjectListByOrgId',{params:data})
                    .then(res=>{

                        this.subjectlist=res;
                        loading1.close();
                        for(var i in this.voucherInfo){
                            this.itemlists[i]={
                                id:i,
                                kemu:this.subjectlist  //总的科目列表
                            }
                        }
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading1.close();})
            },
            //ajax获取科目下的辅助项***************************
            getAssist(val){
                var data={
                    id:val.data.PhId,
                    orgid:this.orgid,
                } 
                const loading1=this.$loading();
                this.$axios.get("/PSubject/GetVoucherAuxiliaryBySubject",{params:data})
                    .then(res=>{
                        if(res.length>0){
                            this.assistList=res;
                            this.assistItem[val.id].checked=true;
                            this.assistItemMask=true;
                            this.assistCheck=true;
                            for(var a in this.assistList){
                                this.assistSels[a]=this.assistList[a].Children[0];
                            }
                        }else{
                            this.assistList=[]
                        }
                        loading1.close();
                        this.moneyInputMask=false;
                    })
                    .catch(err=>{this.$message({ showClose: true,message: err, type: "error"});loading1.close();this.moneyInputMask=false;})

            },
            //辅助项选择完成********************
            assistOk(bool,item,index){
                if(bool){
                    item.DtlAccounts.assistItem=this.assistSels;
                    console.log(this.assistSels)
                }else{
                    item.SubjectCode='';
                    item.SubjectName='';
                }
                this.assistItemMask=false;
                this.assistCheck=false;
                this.moneyInputHide();
            },
            //科目下拉框选择的科目********************************
            itemClick(childMsg){
               
                this.voucherInfo[childMsg.id].SubjectCode=childMsg.data.KCode;
                this.voucherInfo[childMsg.id].SubjectName=childMsg.data.FullName;
                this.kemuSel[childMsg.id].checked=false;
                this.voucherInfo[childMsg.id].DtlAccounts.assistItem=[];
                this.getAssist(childMsg);
                this.getBalance(childMsg);
                this.$forceUpdate();
            },
            //科目余额*******************
            getBalance(Msg){
                var Kcode=Msg.data.KCode;
                var nowTime=this.nowTime;
                var data={
                    Year:nowTime.getFullYear(),
                    OrgIds:this.orgid,
                    Kcode:Kcode
                } 
                const loading5=this.$loading();
                this.$axios.get('/PVoucherMst/GetSubjectBalance',{params:data})
                    .then(res=>{
                        console.log(res.Record)
                        if(res.Status=='error'){
                            this.$message(res.Msg)
                        }
                        if(res.Record.length==0){
                            this.voucherInfo[Msg.id].balance=0
                        }else{
                             this.voucherInfo[Msg.id].balance=res.Record[0].j_sum-res.Record[0].d_sum;
                        }
                        if(this.voucherInfo[Msg.id].balance==0){
                            this.voucherInfo[Msg.id].balance='0';
                        }
                        console.log(this.voucherInfo[Msg.id].balance)
                        this.$forceUpdate();
                        loading5.close();
                    })
                    .catch(err=>{
                        this.$message({ showClose: true,message: err, type: "error"})
                        loading5.close();
                    })  
            },
            //选择框显示********************
            handleKemuSel(index){
                for(var kemu in this.kemuSel){
                    this.assistItem[kemu].checked=false;
                    this.kemuSel[kemu].checked=false;
                }
                this.kemuSel[index]={checked:true};
                this.moneyInputMask=true;
                this.$forceUpdate();
            },
            kemuCancle($event,index,item){
                this.voucherInfo[index].DtlAccounts.assistItem=[];
                this.voucherInfo[index].SubjectCode='';
                this.voucherInfo[index].SubjectName='';
                item.money={jiefang:'',daifang:''};
                var input1=$event.currentTarget.parentNode.parentNode.parentNode.nextElementSibling.children[0].children[0]; 
                var input2=$event.currentTarget.parentNode.parentNode.parentNode.nextElementSibling.nextElementSibling.children[0].children[0]; 
                this.inputBlur(input1,item,'jiefang');
                this.inputBlur(input2,item,'daifang');
                this.moneyInputMask=false;
                this.$forceUpdate();
            },
            //
            moneyCancle(item,val){
                console.log(item,val)
                item.money[val]='';
            },
            //金额输入框键入*******************
            inputBlur($event,item,value){
                var input;
                if($event.target){
                    input=$event.target;
                }else{
                    input=$event;
                }
                if(!this.countJie||!this.countDai){
                    this.countJie=0;
                    this.countDai=0;
                }else{
                    this.countJie++;
                    this.countDai++;
                }
                if(item.money[value]){
                    item.money[value]=parseFloat(item.money[value]);    
                }               
                var val=item.money[value];
                item.moneyInput[value]=false;
                var children = input.parentNode.parentNode.children;
                this.moneyInputMask=false;
                this.$forceUpdate();
                this.moneyTurn(val,children);
                console.log(item)
                //清空另一个金额框的值*************
                if(value=='jiefang'&&item.money[value]){
                    item.money.daifang='';
                    children = input.parentNode.parentNode.nextElementSibling.children;
                    this.moneyTurn(0,children);
                }else if(value=='daifang'&&item.money[value]){
                    item.money.jiefang='';
                    children = input.parentNode.parentNode.previousElementSibling.children;
                    this.moneyTurn(0,children);
                }
            },
            initMoneyCss(){  //金额输入框样式初始化***************
                for(var i in this.voucherInfo){
                    var li = document.querySelectorAll(".voucherContent>ul>li");
                    var children1=li[i-0+1].children[0].children[3].children;
                    this.moneyTurn(this.voucherInfo[i].money.jiefang,children1);
                    var children2=li[i-0+1].children[0].children[4].children;
                    this.moneyTurn(this.voucherInfo[i].money.daifang,children2);
                    var sum = 0;
                    for (var item of this.voucherInfo) {
                        if (item.money.daifang) {
                            sum += parseFloat(item.money.daifang);
                        }
                    }
                    this.daifang=sum.toFixed(2);
                    sum=0;
                    for(var item of this.voucherInfo){
                        if(item.money.jiefang){
                            sum+=parseFloat(item.money.jiefang);
                        }
                    }
                    this.jiefang=sum.toFixed(2);
                    var jie=document.querySelector(".count>li:nth-child(2)");
                    this.moneyTurn(this.jiefang,jie.children);
                    var dai=document.querySelector(".count>li:nth-child(3)");
                    this.moneyTurn(this.daifang,dai.children);
                }
                this.$forceUpdate();

            },
            moneyTurn(val,children){  //金额输入框转文本样式***************

                if(val&&val!=0) {
                    val = parseFloat(val).toFixed(2).split('.');
                    var num = val[0];
                    var float = val[1];
                    children[11].innerHTML = float[1];
                    children[10].innerHTML = float[0];
                    for(var i=num.length-1,j=9;j>0;j--){
                        if(i>=0){
                            children[j].innerHTML=num[i] ;
                            i--;
                        }else{
                            children[j].innerHTML='';
                        }
                    }
                }else{
                    for(var i=11;i>0;i--){
                        children[i].innerHTML='';
                    }
                }
            },
            moneyInputShow(item,val){//金额输入框展示**********************
                if(item.SubjectCode){
                    item.moneyInput[val]=true;
                    this.moneyInputMask=true;
                }
            },
            moneyInputHide(){//输入框隐藏**********************
                for(var input of this.voucherInfo){
                    input.moneyInput.jiefang=false;
                    input.moneyInput.daifang=false;
                }
                for(var item of this.kemuSel){
                    item.checked=false;
                }
                for(var assist of this.assistItem){
                    assist.checked=false;
                }
                this.moneyInputMask=false;
            },
            showAddIcon(index){//增删icon显示*************
                for(var item of this.addIcon){
                    item.checked=false;
                }
                this.addIcon[index].checked=true;
                this.$forceUpdate();
            },
            //附件上传************************************
            //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
            // beforeAvatarUpload(file) {
            //     console.log(111,file)
            //     const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif') || (file.type === 'image/jpg');
            //     const isLt2M = file.size / 1024 / 1024 < 2;
            //     if (!isRightType) {
            //         this.$message.error('上传图片只能是 JPG,png,gif,jpeg 格式!');
            //         return false
            //     }
            //     if (!isLt2M) {
            //         this.$message.error('上传图片大小不能超过 2MB!');
            //         return false
            //     }
                
            // },
            // uploadFileMethodEnterprise(param) {console.log(res,2);
            //     let fileObject = param.file;
            //     let formData = new FormData();
            //     formData.append('id', this.orgForm.PhId)
            //     formData.append("file", fileObject);
            //     this.uploadFile(formData).then(res => {
            //         console.log(res,2);
            //         if(res.Status==='error'){
            //             this.$message.error(res.Msg);
            //             return
            //         }
                    
            //         //回传的上传临时文件
            //         if(res.Data[0]){
            //             this.orgForm.EnterpriseAttachment = res.Data[0];
            //             this.$message.success("上传成功");
            //         }

            //     }).catch(error => {      
            //         console.log(error);
            //         this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
            //     })
            // },
            // uploadFileMethodChairman(param){console.log(res,2);
            //     let fileObject = param.file;
            //     let formData = new FormData();
            //     formData.append('id', this.orgForm.PhId)
            //     formData.append("file", fileObject);

            //     this.uploadFile(formData).then(res => {
            //         console.log(res,1);
            //         if(res.Status==='error'){
            //             this.$message.error(res.Msg);
            //             return
            //         }

            //         //回传的上传临时文件
            //         if(res.Data[0]){
            //             this.orgForm.ChairmanAttachment = res.Data[0];
            //             this.$message.success("上传成功");
            //         }

            //     }).catch(error => {      
            //         console.log(error);
            //         this.$message({ showClose: true,  message: '上传附件失败',  type: 'error' })
            //     })
            // },
            picUploadShow(){
                console.log(this.picVisible)
                this.picVisible=true;
                console.log(this.picVisible)
            },
            removeimg(item,deleValue) {//
               this.imglist=item;
                if(item.length<1){
                    return;
                }
                console.log(item,deleValue,this.imglist);
                // var urls=deleValue.imgPath.split('/');
                // console.log(this.imglist,item,urls,deleValue)
                // for(var i in item[0]){ 
                //     console.log(item[0][i].BName,urls[4])
                //     if(item[0][i].BName==urls[4]){
                //             console.log(item)
                //           item[0].splice(i,1);  
                //     }
                // } 
                var param={
                    PhId:deleValue.phid,
                    BTable:'gcw3_voucher_mst',
                    BUrlPath:deleValue.imgPath
                };
                this.$axios({
                    url: '/PVoucherAttachment/PostDeleteFile',
                    method: "post",
                    data: param,
                }).then(res => {
                if(res.Status==="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error'});
                        return;
                    }
                }).catch(error => {
                    this.$message({ showClose: true, message: '附件删除错误', type: 'error'});
                });
            },
            uploadimg(item) {
                //this.imglist.push(item);
                
                console.log(this.imglist);
            },
            ...mapActions({
                uploadFile: 'uploadFile/Voucherupload'
            }),
        },
        computed:{
            countJie:{
                get(){
                },
                set(){
                    var sum=0;
                    for(var item of this.voucherInfo){
                        if(item.money.jiefang){
                            sum+=parseFloat(item.money.jiefang);
                        }
                    }
                    this.jiefang=sum.toFixed(2);
                    return ;
                }
            },
            countDai: {
                get() {

                },
                set(){
                    var sum = 0;
                    for (var item of this.voucherInfo) {
                        if (item.money.daifang) {
                            sum += parseFloat(item.money.daifang);
                        }
                    }
                    this.daifang=sum.toFixed(2);
                    return ;
                }
            },
            ...mapState({
                orgid: state => state.user.orgid,
                uid: state => state.user.userid,
                username:state => state.user.username,
                orgcode: state => state.user.orgcode
            }),
            picUrl:function(){
                return httpConfig.baseurl;
            },
            PAttachment:{
                get(){
                    return this.imglist.length;
                },
                set(){

                }
            }
        },
        watch:{
            jiefang(){
                var jie=document.querySelector(".count>li:nth-child(2)");
                this.moneyTurn(this.jiefang,jie.children);
            },
            daifang(){
                var dai=document.querySelector(".count>li:nth-child(3)");
                this.moneyTurn(this.daifang,dai.children);
            },
            "orgForm.ServiceTime"(val){           
                this.orgForm.ServiceStartTime=''
                this.orgForm.ServiceEndTime=''
            }
        },
        components:{
            searchSelect,
            pictureUpload
        }
    }
</script>

<style scoped>
    .voucher{
        width:100%;
        text-align: left;
        padding:8px 15px 0 25px;
        margin-right:10px;
        font-size:18px;
    }
    .assistItemMask{
        position: absolute;
        width:100%;
        height:100%;
        z-index: 9;
    }
    .voucherContent{
        margin-top:20px;
        border-top:1px solid #aaa;
        position: relative;
    }
    .moneyInputMask{
        width:100%;
        height:100%;
        position: absolute;
        z-index:2;
    }
    .voucherContent>ul>li:first-child{
        height:55px;
    }
    .voucherContentItem>div:first-of-type{
        width:25px;
        height:100%;
        position:absolute;
        left:-25px;
    }
    .voucherContentItem .inputContainer{
        height:100%;
    }
    .voucherContentItem .inputContainer>textarea{
        width:100%;
        height:100%;
        border: 0;
        padding:2px 5px;
        font-size:15px;
    }
    .addIcon,.deleteIcon{
        width:25px;
        height:25px;
        position:absolute;
        left:0px;
        cursor:pointer;
    }
    .addIcon{
        top:2px;
        background: url("../../assets/icon/addition_fill.svg");
        background-size:cover;
    }
    .addIcon:hover{
        background: url("../../assets/icon/addition.svg");
        background-size:cover;
    }
    .deleteIcon{
        bottom:2px;
        background: url("../../assets/icon/delete_fill.svg");
        background-size:cover;
    }
    .deleteIcon:hover{
        background: url("../../assets/icon/delete.svg");
        background-size:cover;
    }
    .voucherContentItem,.voucherContent>ul>li{
        height:55px;
        position:relative;
    }
    .voucherContent>ul>li:first-child>ul{
        height:55px;
        line-height:55px;
        background: #d3e8f9;
    }
    .voucherContent>ul>li:first-child>ul>li:nth-of-type(3),.voucherContent>ul>li:first-child>ul>li:nth-of-type(4){
        line-height:27.5px;
    }
    li:last-of-type>ul.voucherContentItem>li{
        width:24%;
    }
    li:last-of-type>ul.voucherContentItem>li:first-of-type{
        width:52%;
    }
    .voucherContentItem>li{
        width:26%;
        height:55px;
        line-height:55px;
        text-align: center;
        border-bottom:1px solid #ddd;
        border-right:1px solid #ddd;
        position:relative;
    }
    .voucherContentItem>li:first-of-type{
        border-left: 1px solid #dddddd;
    }
    .voucherContentItem>li:nth-of-type(3),.voucherContentItem>li:nth-of-type(4){
        width:24%;
    }
    .voucherContentItem>li,.voucherContentItem:nth-of-type(5)>li{
        border-right-color:#bbb;
        border-bottom-color:#bbb;
    }
    .voucherContentItem>li:first-of-type{
        border-left-color:#bbb;
    }
    .voucherContent>ul>li:first-of-type>ul>li>div~.money{
        border-top:1px solid #aaa;
    }
    .money{
        position:relative;
    }
    .money>div{
        border-right:1px solid #ddd;
        width:9.09%;
        height:100%;
        font-size: 14px;
        position: relative;
    }
    .money>div:nth-of-type(1){
        border-color:#53bff0;
    }
    .money>div:nth-of-type(2){
        border-color:#5dc2f0;
    }
    .money>div:nth-of-type(3){
        border-color:#8ed2ac;
    }
    .money>div:nth-of-type(4){
        border-color:#6dc594;
    }
    .money>div:nth-of-type(5){
        border-color:#8ad0a9;
    }
    .money>div:nth-of-type(6){
        border-color:#ffdf8b;
    }
    .money>div:nth-of-type(7){
        border-color:#ffe18f;
    }
    .money>div:nth-of-type(8){
        border-color:#ffdd80;
    }
    .money>div:nth-of-type(9){
        border-color:#ffdc7e;
    }
    .money>div:nth-of-type(10){
        border-color:#fe7b7b;
    }
    .money>div:last-of-type{
        border:0;
    }
    .money>.moneyInputActive{
        position:absolute;
        background: #fff;
        width:100%;
        height:100%;
    }
    .voucherFoot{
        margin:20px 0;
    }
    .voucherFoot>ul>li{
        width:20%;
        text-align: center;

    }
    .voucherFoot>ul>li>label{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .voucherFoot>ul>li>label>input{
        width:100px;
        border:1px solid #ccc;
    }

    .moneyValCon{
        opacity: 0;
        position:absolute;
        width:100%;
        height:100%;
        background:#fff;
        outline:1px solid #fff;
        padding:0 30px 0 5px;
        z-index: 5;
    }
    .moneyInputShow{
        opacity: 1;
    }
    .moneyValCon>input{
        width:100%;
        height:90%;
        border:0;
        outline: 0;
        font-size: 20px;
    }
    .inputCancle{
        border:1px solid red;
        width:25px;
        height:25px;
        line-height: 25px;
        color:red;
        cursor:pointer;
        border-radius: 50%;
        font-style: normal;
        position: absolute;
        right:2.5px;
        top:15px;
    }
    .kemu>.inputContainer>input{
        border:0;
    }
    .kemu>div{
        position:relative;
        z-index:5;
        width:100%;
        height:100%;
    }
    .kemu>div:first-of-type>ul{
        padding:5px 3px;
    }
     .kemu>div:first-of-type>ul>li:first-of-type{
         width:100%;
         height:30px;
         overflow-y: auto;         
     }
     .kemu>div:first-of-type>ul>li:first-of-type>div:first-of-type{
         white-space: pre-wrap;
         width:100%;
         text-align: left;
     }   
    .kemu>div>ul{
        height:100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: flex-start;
    }
    .kemu>div>ul>li{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        padding:0 3px;
        font-size: 13px;
        line-height: 15px;
    }
    .kemu>div{
        position:relative;
    }
    .kemu>div>ul>li.kemuCancle{
        position:absolute;
        width:20px;
        height:20px;
        right:10px;
        top:15px;
        cursor:pointer;
    }
    .kemu>div>ul>li.kemuCancle>i{
        position: absolute;
        width:100%;
        height:100%;
        border:1px solid red;
        border-radius: 50%;
    }
    .kemu>div>ul>li.kemuCancle>i:before,
    .kemu>div>ul>li.kemuCancle>i:after{
        width:1px;
        height:12px;
        content:"";
        position: absolute;
        left:50%;
        top:2.5px;
        background: red;
    }
    .kemu>div>ul>li.kemuCancle>i:before{
        transform: rotate(45deg);
    }
    .kemu>div>ul>li.kemuCancle>i:after{
        transform: rotate(-45deg);
    }
    .kemu>.assistContainer{
        background: #fff;
        position:absolute;
        height:auto;
        border-top:1px solid #aaa;
        z-index: 99;
    }
    .kemu>.assistContainer>ul{
        padding:5px;
    }
    .kemu>.assistContainer>ul>li{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom:5px;
    }
    .kemu>.assistContainer>ul>li>div:first-of-type{
        margin-right: 15px;
        width:60px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .kemu>.assistContainer>a{
        display: block;
        height:30px;
        line-height: 30px;
        font-size: 16px;
        width:100%;
        background: #ccc;
        border-bottom: 1px solid #aaa;
    }
    .kemu>.assistContainer>p{
        height:30px;
        line-height: 30px;
        font-size: 14px;
        width:100%;
    }
    .kemu>.assistContainer>p>span{
        padding:3px 10px;
        margin-left: 10px;
        border: 1px solid #02a7e7;
        border-radius: 3px;
        cursor:pointer;
    }
    .kemu>.assistContainer>p>span:hover{
        background: #02a7e7;
        color:#fff;

    }
    .uploaderTitle{
        position:relative;
        width:40px;
        height:30px;  
        cursor:pointer; 
        background: url("../../assets/icon/f90c871a-13a3-4900-9b6f-ff9edc5c98c5.svg") no-repeat;
        background-size:40px 30px;
    }
    
    .avatar-uploader{
    position: absolute;
    z-index: 1;
    right: 61px;
    top: -20px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader .el-upload--text{
    width: 80px;
    height: 80px;
}

.avatar-uploader-icon {
    font-size: 20px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
}
.avatar {
    width: 80px;
    height: 80px;
    display: block;
}
.orgform .el-form-item__label{
    background: #00B8EE;
}

.orgform .el-form-item{
    margin-bottom: 2px;
}
.chongHcss{
    color:red;
}
</style>
