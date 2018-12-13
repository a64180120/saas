<template>

    <div class="voucher">
        <div class="voucherHead">
            <ul class="flexPublic">
                <li><span>凭证字号: </span><span>{{PNo}}</span></li>
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
                    <el-upload
                        class="upload-demo flexPublic"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        multiple
                        :limit="3"
                        :on-exceed="handleExceed"
                        :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div title="只能上传jpg/png文件，且不超过500kb" slot="tip" class="el-upload__tip"></div>
                    </el-upload>
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
                            <div class="inputContainer">
                                <textarea v-model="item.Abstract" @focus="showAddIcon(index)" maxlength="50"></textarea>
                            </div>
                        </li>
                        <li @click.stop="handleKemuSel(index)" class="kemu">
                            <div>
                                <ul>
                                    <li class="flexPublic">
                                        <span>{{item.SubjectCode}}{{item.SubjectName}}</span>
                                        <span v-show="item.DtlAccounts.assistItem"  v-for="(assist,index) of item.DtlAccounts.assistItem" :key="index">-{{assist.AuxiliaryName}}{{assist.BaseName}}</span>
                                    </li>
                                    <li v-show="item.SubjectCode"><span>余额:</span><span></span></li>
                                    <li v-show="item.SubjectCode" class="kemuCancle" @click.stop="kemuCancle(index)"><i></i></li>
                                </ul>
                            </div>
                            <searchSelect :itemlists="itemlists[index]" :placeholder="itemlistText" v-if="kemuSel[index].checked"
                                          :nodatatext="itemText" @item-click="itemClick"></searchSelect>
                            <div @click.stop="1" v-show="assistItem[index].checked" class="assistContainer">
                                <ul>
                                    <li v-for="(assist,index2) of assistList" :key="index2">
                                        <div :title="assist.BaseName">{{assist.BaseName}}</div>
                                        <div class="selectContainer">
                                            <select  v-model="assistSels[index2]">
                                                <option :value="val" v-for="(val,index) of assist.Children">{{val.BaseName}}</option>
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
                                <input type="number" v-model="item.money.jiefang" @blur="inputBlur($event,item,'jiefang')" placeholder="请输入金额"
                                       onkeyup="this.value=this.value.replace(/e/g,'')" onafterpaste="this.value=this.value.replace(/e/g,'')" >
                                <i class="inputCancle">X</i>
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
                                <input type="number" v-model="item.money.daifang" @blur="inputBlur($event,item,'daifang')" placeholder="请输入金额"
                                       onkeyup="this.value=this.value.replace(/e/g,'')" onafterpaste="this.value=this.value.replace(/e/g,'')" >
                                <i class="inputCancle">X</i>
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
                <li><label>审核: <span>{{PAuditor}}</span></label></li>
                <li><label>制单: <span>{{PMakePerson}}</span></label></li>
                <li><label>出纳: <span>{{PCashier}}</span> </label></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import searchSelect from './searchSelect'
    import {mapState, mapActions} from 'vuex'
    export default {
        name: "voucher",
        props:{
            'dataList':Object,
        },
        data(){return{
            fatherData:'',
            fileList:[],
            PhId:'',
            PDate:'',
            PNo:'',
            PAttachment:'0',
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
            assistItemMask:false,
            assistCheck:true
        }},
        created(){
            if(!this.dataList.data.Mst){//没有传参时初始化页面
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
            }else{
                this.getVoucherData(this.dataList.data.Mst);
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
                    if(!this.fatherData.PhId){
                        this.fatherData.Dtls=[];
                    } 
                    var dtls = this.fatherData.Dtls;
                    var account;
                    var item;
                    for( var info of this.voucherInfo){
                        console.log('jishu',1)
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
                            console.log(2222222)
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
                    this.fatherData.PMakePerson=this.PMakePerson;
                    this.fatherData.PFinancePerson=this.PFinancePerson;
                    this.fatherData.PKeepingPerson=this.PKeepingPerson;
                    this.fatherData.PCashier=this.PCashier;
                    this.fatherData.PAuditor=this.PAuditor;
                    console.log(this.fatherData)
                    return {
                        Mst:this.fatherData,
                        Attachements:this.fileList
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
                    if(this.voucherInfo[index].PhId&&this.voucherInfo.length>1){
                        this.deleteDtls.push(this.voucherInfo[index]);
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
                    .catch(err=>{console.log(err);loading1.close();})
            },
            //ajax获取科目下的辅助项***************************
            getAssist(val){
                const loading1=this.$loading();
                var data={
                    id:val.data.PhId
                }
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
                    })
                    .catch(err=>{console.log(err);loading1.close();})

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
                this.voucherInfo[childMsg.id].SubjectName=childMsg.data.KName;
                this.kemuSel[childMsg.id].checked=false;
                this.voucherInfo[childMsg.id].DtlAccounts.assistItem=[];
                this.getAssist(childMsg);
                this.$forceUpdate();
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
            kemuCancle(index){
                this.voucherInfo[index].DtlAccounts.assistItem=[];
                this.voucherInfo[index].SubjectCode='';
                this.voucherInfo[index].SubjectName='';
                this.$forceUpdate();
            },
            //金额输入框键入*******************
            inputBlur($event,item,value){
                if(!this.countJie||!this.countDai){
                    this.countJie=0;
                    this.countDai=0;
                }else{
                    this.countJie++;
                    this.countDai++;
                }
                item.money[value]=parseFloat(item.money[value]);
                var val=item.money[value];
                item.moneyInput[value]=false;
                var children = $event.target.parentNode.parentNode.children;
                this.$forceUpdate();
                this.moneyTurn(val,children);
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
            handleRemove(file, fileList) {//预留文件上传**************************
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            }
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
                orgcode: state => state.user.orgcode
            })
        },
        watch:{
            jiefang(){
                var jie=document.querySelector(".count>li:nth-child(2)");
                this.moneyTurn(this.jiefang,jie.children);
            },
            daifang(){
                var dai=document.querySelector(".count>li:nth-child(3)");
                this.moneyTurn(this.daifang,dai.children);
            }
        },
        components:{
            searchSelect,
        }
    }
</script>

<style scoped>
    .voucher{
        width:100%;
        text-align: left;
        padding:8px 18px;
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
        background: url("../../assets/icon/addition.svg");
        background-size:cover;
    }
    .addIcon:hover{
        background: url("../../assets/icon/addition_fill.svg");
        background-size:cover;
    }
    .deleteIcon{
        bottom:2px;
        background: url("../../assets/icon/delete.svg");
        background-size:cover;
    }
    .deleteIcon:hover{
        background: url("../../assets/icon/delete_fill.svg");
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
        width:30%;
    }
    li:last-of-type>ul.voucherContentItem>li:first-of-type{
        width:40%;
    }
    .voucherContentItem>li{
        width:20%;
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
        width:30%;
    }
    .voucherContentItem>li,.voucherContentItem:nth-of-type(5)>li{
        border-right-color:#7a7a7a;
        border-bottom-color:#7a7a7a;
    }
    .voucherContentItem>li:first-of-type{
        border-left-color:#7a7a7a;
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

</style>
