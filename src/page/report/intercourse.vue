<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent" v-loading="loading">
                <div class="reportBox">
                    <div class="unionState flexPublic">
                        <ul class="flexPublic">
                        </ul>
                        <ul class="flexPublic handle">
                            <a><li style='margin:0 0 0px 20px;' @click="aoc(0)">新增</li ></a>
                            <a><li style='margin:0 0 0px 20px;' @click="aoc(1)">修改</li ></a>
                            <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel" :loading="downloadLoading">导出</li ></a>
                            <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                            <a><li style='margin:0 0 0px 20px;' class="el-icon-refresh" @click="refresh"></li></a>
                        </ul>
                    </div>
                        <div class="formData" ref="printFrom">
                            <ul>
                                <li>资产类科目</li>
                                <li>具体内容</li>
                                <li>金额(元)</li>
                                <li>负债类科目</li>
                                <li>具体内容</li>
                                <li>余额(元)</li>
                            </ul>
                            <template v-for="item in interCourse">
                                <ul class="formDataItems flexPublic">
                                    <li :class="{'bolder':item.Layer==1,'algin-center':item.Layer==2}">{{item.Asset_Name}}</li>
                                    <li>{{item.Asset_Content}}</li>
                                    <li class="align-right">
                                       <template v-if="item.Asset_Content">
                                            {{item.Asset_Amount | NumFormat}}
                                        </template>
                                    </li>
                                    <li :class="{'bolder':item.Layer==1,'algin-center':item.Layer==2}">{{item.Liability_Name}}</li>
                                    <li>{{item.Liability_Content}}</li>
                                    <li class="align-right">
                                        <template v-if="item.Liability_Content">
                                            {{item.Liability_Amount | NumFormat}}
                                        </template>
                                    </li>
                                </ul>
                            </template>

                        </div>
                </div>
                <!--新增和修改共用同一个界面，通过aocType 去判断调用哪边的接口-->
                <div class="cover" :style="{'display':(aocType.show?'block':'none')}">
                    <div class="coverdiv">
                        <div class="head">
                            <p>{{aocType.title}}</p>
                            <i class="el-icon-close" @click="aocType.show=false"></i>
                        </div>
                        <div class="selectarea">
                            <el-radio label="4" v-model="checkType">资产类科目</el-radio>
                            <el-radio label="5" v-model="checkType">负债类科目</el-radio>
                            <select v-model="chooseSubject">
                                <template  v-for="item in subjectList">
                                    <option :value="item">{{item.KName}}</option>
                                </template>
                            </select>
                            <!--<el-select  v-model="chooseSubject" :value="chooseSubject.KName" placeholder="请选择"  @change="getCodeDetailData">
                                <el-option
                                    v-for="(item,index) in subjectList"
                                    :key="item.KCode"
                                    :label="item.KName"
                                    :value="item.KCode"
                                    :style="{'margin-left':'30px'}"
                                >
                                </el-option>
                            </el-select>-->
                            <div class="btnArea">
                                <div class=""  @click="aocType.show=false">取消</div>
                                <template v-if="aocType.choose==0">
                                    <div class="" @click="saveList(1)">保存</div>
                                </template>
                               <template v-else>
                                   <div class="" @click="saveList(2)">保存</div>
                               </template>
                            </div>

                        </div>
                        <div class="formData"  style="overflow-y: auto;height: 420px;overflow-x: hidden; ">
                            <ul>
                                <li style="width:80%">具体内容</li>
                                <li style="width:20%">金额(元)</li>
                            </ul>
                            <!--新增-->
                            <template v-if="aocType.choose==0">
                                <template v-for="(item,index) in changeList">
                                    <div class="delArea areaf">
                                        <i @click="delChangeList(index)">—</i>
                                        <i class="el-icon-lx-add" @click="addChangeList(index)"></i>
                                    </div>
                                    <ul class="formDataItems flexPublic" @mouseenter="showIcon"><!-- @mouseleave="hideIcon"-->

                                        <li style="width:80%"><input :disabled="item.content=='合计'" :class="{bolder:item.content=='合计'}" data-type="0" :data-index="index" :value="item.content" @change="newChildAdd"></li>
                                        <li style="width:20%" class="align-right"><input :disabled="item.content=='合计'" :class="{bolder:item.content=='合计'}" :value="item.money" data-type="1" :data-index="index" @change="newChildAdd"></li>
                                    </ul>
                                </template>
                                <ul class="formDataItems flexPublic">
                                    <li style="width:80%"><input class="bolder"value="合计"></li>
                                    <li style="width:20%" class="align-right"><input disabled class="bolder" :value="addCountMoney"></li>
                                </ul>
                            </template>

                            <!--修改-->
                            <template v-else>
                                <template  v-for="(item,index) in changeListFix">
                                    <div class="delArea areat" style="top: 13px">
                                        <i @click="delChangeListFix(index)" >—</i>
                                        <!--<i class="el-icon-lx-add" @click="addChangeListFix(index)"></i>-->
                                    </div>
                                    <ul class="formDataItems flexPublic" @mouseenter="showIconT">
                                         <li style="width:80%"><input :disabled="item.Content=='合计'" :class="{bolder:item.Content=='合计'}" :value="item.Content" data-type="0" :data-index="index" @change="newChildFix"></li>
                                        <li style="width:20%" class="align-right"><input :disabled="item.Content=='合计'" :class="{bolder:item.Content=='合计'}" :value="item.AccountSum" data-type="1" :data-index="index"  @change="newChildFix"></li>
                                    </ul>
                                </template>
                                <template v-if="changeListFix.length<8">
                                    <template v-for="n in (8-changeListFix.length)">
                                        <ul class="formDataItems flexPublic">
                                            <li  style="width:80%"></li>
                                            <li style="width:20%"></li>
                                        </ul>
                                    </template>
                                </template>
                                <ul class="formDataItems flexPublic">
                                    <li style="width:80%"><input class="bolder"value="合计"></li>
                                    <li style="width:20%" class="align-right"><input disabled class="bolder" :value="fixCountMoney"></li>
                                </ul>
                            </template>

                        </div>
                    </div>
                </div>
            </div>
            <div class="timeSelectBox">
                <time-select-bar @item-click="dateChoose" :showtype="'yearTime'"></time-select-bar>
            </div>
        </div>
    </div>
</template>

<script>
    import TimeSelectBar from "../../components/TimeSelectBar/index";
    import { mapState, mapGetters } from "vuex";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import qs from 'qs'
    export default {
        name: "user",
        data(){
            return{
                downloadLoading:false,
                date1:[],//存储时间选择器的时间
                loading:false,//页面刷新的等待幕布
                interCourse:[],
                date1:[],
                proofType:'1',
                checkType:'4',//新增往来明细 4选择资产类  5选择负债类
                subjectList:[],//选择资产类，查询详细的资产类科目
                chooseSubject:'',//选择的资产科目
                aocType:{show:false,choose:0,title:'新增往来明细'}, //选择的增加还是修改,0增加，1修改
                changeList:[],//默认添加的空白表格
                addCountMoney:0,
                changeListFix:[],//修改保存的数据
                fixCountMoney:0
            }
        },
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds
            }),
        },
        mounted(){
            let currentYear = new Date();
            let currentyear=currentYear.getFullYear(currentYear);
            let currentMonth=currentYear.getMonth()+1;
            this.date1.choosedYear=currentyear;
            this.date1.choosedMonth=currentMonth;
            this.getData();
            this.addBlock();

        },
        components: { TimeSelectBar },
        watch:{
            checkType:function(){
                this.getCodeData();
            },
            chooseSubject:function(){
                console.log(this.chooseSubject);
                this.changeList=[];
                this.addBlock();
                this.changeListFix=[];
                this.getCodeDetailData();
            }
        },
        methods:{
            //页面加载，默认添加表格
            addBlock:function (){

                for(let i=0;i<8;i++){
                    let c={'content':'','money':''};
                    this.changeList[i]=c//默认添加的空白表格
                }
            },
            //选择增加还是隐藏
            aoc:function(type){
              this.aocType.show=true;
              this.aocType.choose=type;
              if(type==0){
                  this.aocType.title='新增往来款项明细';
                  this.getCodeData(0);
              }else{
                  this.aocType.title='修改往来款项明细';
                  this.getCodeData(1);
              }
            },
            //时间选择器选择时间返回值
            dateChoose:function(val){
                this.date1=val;
                this.getData();
            },
            //获取数据
            getData:function(){
                let param='';
                if(this.date1.choosedYear==undefined){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    param=currentyear;
                }else{
                    param=this.date1.choosedYear;
                }
                let data={
                    "orgid":this.orgid,
                    "Year":  param
                }
                this.loading=true;
                this.$axios.get(
                    // 'PSubjectBudget/GetBeginYear',
                    'DealingsMst/GetBaseModel',
                    {params:data}
                ).then(res=>{
                    this.loading=false;
                    console.log(res);
                    this.interCourse=res.Record;
                }).catch(err=>{
                    this.loading=false;
                  this.$message(err);
                })
            },
            //根据类型获取科目列表
            getCodeData:function(type){
                let param='';
                if(this.date1.choosedYear==undefined){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    param=currentyear;
                }else{
                    param=this.date1.choosedYear;
                }
                let data={
                    "orgid":this.orgid,
                    "Year":  param,
                    'Type': this.checkType
                }
                this.loading=true;
                this.$axios.get(
                    // 'PSubjectBudget/GetBeginYear',
                    'DealingsMst/GetPSubjectByType',
                    {params:data}
                ).then(res=>{
                    this.loading=false;
                    console.log(res);
                    this.subjectList=res.Record;
                    this.chooseSubject=res.Record[0];
                    if(type==1){
                        this.getCodeDetailData();
                    }
                }).catch(err=>{
                    this.loading=false;
                    this.$message(err);
                })
            },
            //根据科目类型获取明细列表
            getCodeDetailData:function(){
                this.changeListFix='';
                let param='';
                if(this.date1.choosedYear==undefined){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    param=currentyear;
                }else{
                    param=this.date1.choosedYear;
                }
                let data={
                    "orgid":this.orgid,
                    "Year":  param,
                    'Type': this.chooseSubject.KType,
                    'KCode':this.chooseSubject.KCode
                }
                this.loading=true;
                this.$axios.get(
                    'DealingsMst/GetDealingDtlByOrgidUyearTypeKcode',
                    {params:data}
                ).then(res=>{
                    this.loading=false;
                    console.log(res);
                    this.changeListFix=res.Record;
                    this.fixCountMoney=0;
                    for(var i in res.Record){
                        this.fixCountMoney+=res.Record[i].AccountSum;
                    }
                }).catch(err=>{
                    this.loading=false;
                    this.$message(err);
                })
            },
            /*
            * 保存信息，
            * 新增this.aocType.choose==0
            * 修改this.aocType.choose==1
            *type:1保存  2修改
            * 接口：同一个  DealingsMst/PostSaveDealings
            * */
            saveList:function(type){
                console.log(this.chooseSubject);
               let saveList= [{
                   'OptionType':type,
                   'PhId':this.chooseSubject.PhId_DealingMst,
                   'OrgId':this.orgid,
                   'OrgCode':this.OrgCode,
                   'Type':this.chooseSubject.KType,
                   'PhidSubject':this.chooseSubject.PhId,
                   'SubjectCode':this.chooseSubject.KCode,
                   'TotalSum':    0 ,
                   'Uyear':this.date1.choosedYear,
                   'NgRecordVer':this.chooseSubject.NgRecordVer_DealingMst,
                   'Dtls':[]
               }];
               let dtls=[];
               if(this.aocType.choose==0){
                   for(var i in this.changeList){
                       if(this.changeList[i].content!=''){
                           let dtl={
                               PhId:0,
                               DealPhid:this.chooseSubject.PhId_DealingMst,
                               Content:this.changeList[i].content,
                               AccountSum:this.changeList[i].money,
                           };
                           dtls.push(dtl);
                       }
                   };
               }else{
                   console.log(222222222222);
                   dtls=this.changeListFix;
                   /*for(var i in this.changeListFix){
                       let dtl={
                           PhId:this.changeListFix[i].PhId,
                           DealPhid:this.changeListFix[i].DealPhid,
                           Content:this.changeListFix[i].Content,
                           AccountSum:this.changeListFix[i].AccountSum,
                           NgRecordVer:this.changeListFix[i].NgRecordVer
                       };
                       dtls.push(dtl);
                   };*/
               }

                saveList[0].Dtls=dtls;
                let data={infoData:saveList};//JSON.stringify(JSON.stringify(saveList))
                this.$axios.post(
                    'DealingsMst/PostSaveDealings',
                    data
                ).then(res=>{
                    console.log(res);
                    this.$message(res.Msg,'success');
                    if(res.Status=='success'){
                        this.aocType.show=false;
                        this.getCodeData();//每次保存成功之后都要测重新获取科目列表，刷新版本号
                        this.getData();//页面数据刷新
                    }else{

                    }

                }).catch(err=>{
                    console.log(err);
                })
            },
            /*
            *新增 input输入监听
            * type:0--content   1--money
            * index:修改的哪个数组
            * */
            newChildAdd:function(val){
                console.log(val);
                let type=val.target.dataset.type,index=val.target.dataset.index,value=val.target.value;
                console.log(type+'===='+index+'===='+value);
                if(type==0){
                    this.changeList[index].content=value;
                }else{
                    if(this.changeList[index].money!=''){
                        //先计算后赋值
                        this.addCountMoney=this.addCountMoney-this.changeList[index].money+value;
                    }
                    this.changeList[index].money=value;
                }
                console.log(this.changeList);
            },
            /*
            *修改 input输入监听
            * */
            newChildFix:function(val){
                console.log(val);
                let type=val.target.dataset.type,index=val.target.dataset.index,value=val.target.value;
                if(type==0){
                    this.changeListFix[index].Content=value;
                }else{
                    this.fixCountMoney=this.fixCountMoney-Number(this.changeListFix[index].AccountSum)+Number(value);
                    this.changeListFix[index].AccountSum=value;
                }
            },
            //显示隐藏的小图标
            showIcon:function(val){
                let list=document.getElementsByClassName('areaf');
                console.log(list);
                for(var i=0;i<list.length;i++){
                    console.log(list[i]);
                    list[i].style.display='none';
                }
                val.target.previousElementSibling.style.display='block';
            },
            showIconT:function(val){
                let list=document.getElementsByClassName('areat');
                console.log(list);
                for(var i=0;i<list.length;i++){
                    console.log(list[i]);
                    list[i].style.display='none';
                }
                val.target.previousElementSibling.style.display='block';
            },
            //隐藏小图标
            hideIcon:function(val){
                val.target.previousElementSibling.style.display='none';
            },
            //删除行
            delChangeList:function(index){
                console.log(index);
                this.changeList.splice(index,1);
                if(this.changeList.length<8){
                    this.changeList.push({'content':'','money':''});
                }
            },
            //删除数据
            delChangeListFix:function(index){
                console.log(index);
                this.changeListFix.splice(index,1);
            },
            //添加行
            addChangeList:function(index){
                this.changeList.push({'content':'','money':''});
            },
            //刷新
            refresh:function(){
                this.getData();
            },
            /*
            *author:hyz
            *导出资产负债表Excel表格--待修改
            * 接口：PVoucherMst/PostBalanceSheetExcel
            * 参数：Data--资产负债表数据的整个data
            * */
            /*
          *author:hyz
          *导出Excel表格
          *
          * */
            postBalanceSheetExcel:function() {
                console.log(this.chooseSubject);
                let param = {'uid':this.userid,
                    'orgid':this.orgid,
                    'Year': this.date1.choosedYear};

                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true
                this.$axios.get('DealingsMst/GetDealingsExcel',{params:param}).then(res => {
                    window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    this.downloadLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },

            //下载文件
            fileDownload (data,fileName){
                if (!data) {
                    return
                }
                let blob = new Blob([data],{type:'application/octet-stream'});
                let filename = fileName || "filename.xls";

                if (typeof window.navigator.msSaveBlob !== "undefined") {
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var blobURL = window.URL.createObjectURL(blob);
                    var tempLink = document.createElement("a");
                    tempLink.style.display = "none";
                    tempLink.href = blobURL;
                    tempLink.setAttribute("download", filename);
                    if (typeof tempLink.download === "undefined") {
                        tempLink.setAttribute("target", "_blank");
                    }
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    window.URL.revokeObjectURL(blobURL);
                }
            },
            // 打印
            printContent(e){
                this.$print(this.$refs.printFrom) // 使用
            },
        }
    }
</script>

<style scoped>
    .delArea{
        position: relative;
        left: 4px;
        top:4px;
        z-index: 999;
        display: none;
        height: 0;
        margin-top: -4px;
    }
    .delArea i:last-child{
        width: 14px;
        height: 14px;
        background-color: #00B8EE;
        color:white;
        border-radius: 10px;
        display: block;
        margin-top:4px;
    }
    .delArea i:first-child{
        width: 14px;
        height: 14px;
        font-size: 10px;
        background-color: red;
        border-radius: 10px;
        display: block;
        text-align: center;
        margin-top:5px;
        color: #fff;
        font-weight: 600;
    }

    select{
        margin-left: 150px;
        width: 178px;
        height:30px;
        font-size: 14px;
        line-height: 30px;
        padding-left: 10px;
        color: #6f6f6f;
        border: 1px solid #cccccc;
        border-radius: 4px;
    }
    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(66,66,66,0.45);
        z-index: 99;
    }
    .cover input{
        height: 40px;
        width: 90%;
        border: 0;
        padding-left: 20px;
    }
    .coverdiv{
        margin: auto;
        width: 943px;
        height: 549px;
        background-color: #fff;
        position: relative;
        top: 50%;
        margin-top: -274px;
        padding: 10px 30px;
    }
    .coverdiv .head:first-child{
        border-bottom: 1px solid #cecece;
        height: 40px;
        line-height: 40px;
        font-size: 20px ;
        font-weight: 900;
    }
    .coverdiv .head:first-child p{
        display: inline-block;
        float: left;
    }
    .coverdiv .head:first-child i{
       float: right;
        margin-top: 10px;
        color: #CCCCCC;
    }
    .cover .selectarea{
        height: 45px;
        padding-top: 10px;
        font-size: 16px ;
    }
    .cover .selectarea .btnArea{
        display: inline-block;
        font-size: 14px;
        float: right;
    }
    .cover .selectarea .btnArea div:first-child{
        width: 90px;
        height: 30px;
        border: 1px solid #3e8cbc;
        color: #3e8cbc;
        display: inline-block;
        line-height: 30px;
        text-align:center ;
        cursor: pointer;

    }
    .cover .selectarea .btnArea div:last-child{
        width: 90px;
        height: 30px;
        border: 1px solid #3e8cbc;
        background-color: #3e8cbc;
        color: #fff;
        display: inline-block;
        margin-left: 10px;
        margin-top: -5px;
        line-height: 30px;
        text-align:center ;
        cursor: pointer;
    }
    .formData>ul>li{
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:20%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul>li:nth-of-type(2){
        width:20%;
    }
    .formData>ul>li:nth-of-type(3){
        width:10%;
    }
    .formData>ul>li:nth-of-type(4){
        width:20%;
    }
    .formData>ul>li:nth-of-type(5){
        width:20%;
    }
    .formData>ul>li:nth-of-type(6){
        width:10%;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #d3e9f9;
    }

    .formData>ul>li:first-child{
        padding:0 2px;
    }


    .formDataItems{
        border-bottom:1px solid #ddd;
        background-color: white;
    }
    .formData>ul.formDataItems>li{
        border-right:1px solid #ddd;
        border-left:0;
        border-bottom:0;
        text-align: left;
        line-height: 40px;
        height:40px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 15px;
    }
    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ddd;
    }
    .formData>ul.formDataItems>li.bolder{
        font-weight: bold;
    }
    .formData>ul.formDataItems>li.align-center{
        text-align: center;
        padding:0;
    }
    .formData>ul.formDataItems>li.align-right{
        text-align: right;
        padding-right: 15px;
    }
    .manageContent:before{
        content:"";
        display: inline-block;
    }

    .unionLists>p{
        text-align: center;
        background: #83c350;
        height:50px;
        line-height: 50px;
        color:#fff;
        font-size: 15px;
        margin-bottom: 5px;

    }
    .unionListsContent ul{
        padding-left: 15px;
        position: relative;
    }
    .unionListsContent ul:before{
        content:"";
        height:100%;
        width:1px;
        border-left:1px dotted #aaa;
        position: absolute;
        left:7.5px;
    }
    .unionListsContent ul>li{
        position: relative;
        cursor: pointer;
    }
    .unionListsContent ul>li:before{
        content:"";
        position: absolute;
        width:7.5px;
        left:-7.5px;
        top:9px;
        border-top: 1px dotted #aaa;
    }
    .unionListsContent ul>li:last-child:after{
        content:"";
        height:100%;
        width:7.5px;
        position: absolute;
        left:-7.5px;
        top:10px;
        background: #fff;
    }


</style>
