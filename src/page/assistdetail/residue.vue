<template>
    <div class="timeSelect detail">
        <div class="container">
            <div class="manageContent">
                <div class="reportBox">
                    <div class="unionState" style="width: 100%;height: 40px;min-width: 1260px;">

                        <div style="width:100%;float: right" id="elSelf" >
                            <div  class="flexUl handle" style="float: left;line-height: 30px">
                                <el-select placeholder="剔除条件" value="剔除条件" style="width: 100px;">
                                    <el-option value="0">
                                        <el-checkbox v-model="apartList.BQFS">剔除本期发生发生为零</el-checkbox>
                                    </el-option>
                                    <el-option value="0">
                                        <el-checkbox v-model="apartList.QMYE">剔除期末余额为零</el-checkbox>
                                    </el-option>
                                    <el-option value="0">
                                        <el-checkbox v-model="apartList.proof">剔除未审核凭证</el-checkbox>
                                    </el-option>
                                    <el-option value="0">
                                        <el-checkbox v-model="apartList.TYFZ">剔除停用辅助项目</el-checkbox>
                                    </el-option>
                                </el-select>
                            </div>

                            <ul class="flexUl handle">
                                <li @click="postBalanceSheetExcel">导出</li >
                                <li @click="printContent">打印</li >
                                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </ul>
                            <ul  class="flexUl handle" style="line-height: 30px">
                                <div class="flexPublic handle">
                                    <div class="searcherValue">
                                        <input type="text" placeholder="编码/辅助项目名称" v-model="inputKvalue">
                                        <span class="el-icon-circle-close" :style="{ 'display':inputKvalue!=''?'inline-block':'none' }" @click="inputKvalue=''"></span>
                                    </div>
                                    <div  class="searcherBtn" style="margin-left: -1px;" @click="getResidueData">搜索</div>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div class="flexPublic  formData">
                        <div class="unionLists" >
                            <div class="unionListsTitle">

                                <div class="el-input el-input--prefix" style="text-align: center; padding: 3px 10px;height: 35px;overflow: hidden">
                                    <p style="color: rgb(58, 55, 55);font-size: 20px;">辅助类型</p>
                                </div>
                            </div>
                            <div class="unionContent">
                                <div style="width: 235px;height: 26px;line-height: 26px;margin: auto;margin-top: 10px">
                                    <el-input :suffix-icon="searchCode.length!=0?'':'el-icon-search'" :clearable="true" @change="getResidueType" v-model="searchCode" placeholder="辅助项类型名称"></el-input>

                                    <ul style="position: absolute;left: 0;right: -17px;top: 100px;bottom: 40px;overflow: hidden scroll;">
                                        <li v-for="(item,index) in typeList" :class="{active: choosedType.BaseCode==item.BaseCode}" @click="choosedType=typeList[index]">{{item.BaseName}}</li>
                                    </ul>

                                </div>

                            </div>
                            <div style="position: absolute;bottom: 0;left: 0;width: 100%;text-align: center;box-shadow: 0 0 10px #45c0f7;height: 35px;line-height: 35px;">
                                <el-checkbox v-model="showStop">显示停用辅助项目</el-checkbox>
                            </div>
                        </div>
                        <div class="formData" style="left: 270px;top: 0px;right: 0px;bottom: 0;width: auto;margin-top: 0;">
                            <div class="tbHeader">
                                <table>
                                    <colgroup>
                                        <col width="7%"/>
                                        <col width="13%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <td rowspan="2">编码</td>
                                        <td rowspan="2">辅助项目名称</td>
                                        <td colspan="2">期初余额</td>
                                        <td colspan="2">本期发生额</td>
                                        <td colspan="2">本年累计发生额</td>
                                        <td colspan="2">期末余额</td>
                                    </tr>
                                    <tr>
                                        <td>借方</td>
                                        <td>贷方</td>
                                        <td>借方</td>
                                        <td>贷方</td>
                                        <td>借方</td>
                                        <td>贷方</td>
                                        <td>借方</td>
                                        <td>贷方</td>
                                    </tr>
                                    </thead>

                                </table>
                            </div>
                            <div class="tbBody" id="ts">
                                <table  ref="printFrom">
                                    <colgroup>
                                        <col width="7%"/>
                                        <col width="13%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                        <col width="10%"/>
                                    </colgroup>
                                    <tbody>
                                        <template v-for="(item,index) of dataList">
                                            <tr>
                                                <td :style="{'text-indent':item.Layers==0?'':'20px','text-align':'left'}">
                                                    {{ (item.subject_code=='ALLHJ'||item.subject_code=='DFHJ')?'':item.subject_code}}
                                                </td>
                                                <td :class="{'bolder':(item.subject_code=='JFHJ'||item.subject_code=='DFHJ')}">{{item.k_name}}</td>
                                                <td class="right">
                                                    <template v-if="item.ys_j_sum!=0">
                                                        {{item.ys_j_sum | NumFormat}}
                                                    </template>
                                                </td>
                                                <td>
                                                    <template v-if="item.ys_d_sum!=0">
                                                        {{item.ys_d_sum | NumFormat}}
                                                    </template>
                                                </td>
                                                <td class="right">
                                                    <template v-if="item.yh_j_sum!=0">
                                                        {{item.yh_j_sum | NumFormat}}
                                                    </template>
                                                </td>
                                                <td class="right">
                                                    <template v-if="item.yh_d_sum!=0">
                                                        {{item.yh_d_sum | NumFormat}}
                                                    </template>
                                                </td>
                                                <td class="right">
                                                    <template v-if="item.yl_j_sum!=0">
                                                        {{item.yl_j_sum | NumFormat}}
                                                    </template>
                                                </td>
                                                <td class="right">
                                                    <template v-if="item.yl_d_sum!=0">
                                                        {{item.yl_d_sum | NumFormat}}
                                                    </template>
                                                </td>
                                                <td class="right">
                                                    <template v-if="item.ye_j_sum!=0">
                                                        {{item.ye_j_sum | NumFormat}}
                                                    </template>

                                                </td>
                                                <td>
                                                    <template v-if="item.ye_d_sum!=0">
                                                        {{item.ye_d_sum | NumFormat}}
                                                    </template>
                                                </td>
                                            </tr>
                                        </template>
                                        <tr v-if="dataList.length==0">
                                            <td class="center bolder" colspan="10">当前查询为空</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!--表头和表尾隐藏-->
                            <table style="display: none">
                                <colgroup>
                                    <col width="7%"/>
                                    <col width="13%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                    <col width="10%"/>
                                </colgroup>
                                <div id="theadArea">
                                    <tr>
                                        <td colspan="10" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">核算项目余额表</td>
                                    </tr>
                                    <tr>
                                        <td colspan="10" style="background-color: #fff;font-size: 14px;border: 0">
                                            {{date1.choosedYear}}年
                                            {{date1.choosedMonth<10?'0'+date1.choosedMonth:date1.choosedMonth}}月
                                            01 日
                                            -
                                            {{date1.choosedYear}}年
                                            {{date1.choosedMonthEnd<10?'0'+date1.choosedMonthEnd:date1.choosedMonthEnd}}月
                                            {{ (((date1.choosedYear)%4==0&&(date1.choosedYear%100)!=0)||((date1.choosedYear)%400==0))?monthDayR[this.date1.choosedMonthEnd-1]:monthDay[this.date1.choosedMonthEnd-1]}}日
                                            {{ date1.choosedYear < jyear ?'':((date1.choosedYear==jyear && date1.choosedMonthEnd <= jmonth)?'':'(未结账)') }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="5" class="left" style="background-color: #fff;border: 0;">编制单位：{{orgName}}</td>
                                        <td colspan="5" class="right" style="background-color: #fff;border: 0;">单位：元</td>
                                    </tr>
                                </div>

                                <div id="tbodyArea">
                                    <tr>
                                        <td colspan="10">
                                            注：
                                            <input disabled type="checkbox" :checked="apartList.BQFS" style="margin-left: 10px"> 剔除本期发生发生为零
                                            <input disabled type="checkbox" :checked="apartList.QMYE" style="margin-left: 10px"> 剔除期末余额为零
                                            <input disabled type="checkbox" :checked="apartList.proof" style="margin-left: 10px"> 剔除未审核凭证
                                            <input disabled type="checkbox" :checked="apartList.TYFZ" style="margin-left: 10px" /> 剔除停用辅助项目
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" style="border: 0;">
                                            财务主管：{{curOrg.Treasurer}}
                                        </td>
                                        <td colspan="3" style="border: 0;">审核：</td>
                                        <td colspan="3" style="border: 0;">制表：{{username}}</td>
                                    </tr>
                                </div>

                            </table>
                        </div>

                    </div>
                </div>
                <div class="timeSelectBox" style="z-index: 998">
                    <time-select-bar @item-click="dateChoose"
                                     :showtype="'doubleTime'"
                    ></time-select-bar>
                </div>
                <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
                <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>

            </div>
        </div>
    </div>
</template>

<script>
    import {delList} from '@/api/detailaccount/details.js'
    import { mapState, mapActions } from 'vuex'
    import { SubjectList } from '@/api/subject/subjectInfo'
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import voucherdetail from '../accountbooks/detailaccount/voucherDetail'
    import voucher from '@/page/finance/voucher'
    import axios from "axios";
    import qs from 'qs';
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import saasMsg from '@/components/message/message'
    /**
     * 辅助项明细表
     */
    export default {
        name: "assist",
        data() {
            return {
                searchCode:'',//左侧选择框
                typeList:[],//选择框可选的列表
                choosedType:{},//选中的辅助类型
                //剔除条件
                apartList:{
                    BQFS: false,
                    QMYE: false,
                    proof: false,
                    TYFZ: true
                },
                dataList:[],
                monthDay:[31,28,31,30,31,30,31,31,30,31,30,31],//月份天数-非闰年
                monthDayR:[31,29,31,30,31,30,31,31,30,31,30,31],//月份天数-闰年  year%4=0&&year%100!=0
                date1:{choosedYear:'',
                    choosedYearEnd:'',
                    choosedMonth:'',
                    choosedMonthEnd:''},
                focus:false,
                proofType:false,
                showStop:false ,//是否显示停用的辅助项目
                inputKvalue:'',//顶部搜索框输入凭证字号或摘要Kno Abstract
                jyear:0,//结账年
                jmonth:0,//结账月
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
            }
        },
        mounted() {
            //获取左侧类型列表
            this.getResidueType();
        },
        watch: {
            choosedType:{
                handler(newval,oldval){
                    console.log(newval,oldval)
                    if( newval.PhId!=oldval.PhId ){
                        this.getResidueData();
                    }
                },
                deep:true
            },
            apartList:{
                handler(newval,oldval){
                    this.getResidueData();
                },
                deep:true
            },
            filterText(val) {
                this.$refs.subjectTree.filter(val);
            },
            proofType:function(){
                this.getData(false);
            },
        },
        components: {TimeSelectBar,voucherdetail,saasMsg,voucher},
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                orgName:state=>state.user.orgName,
                userid:state=>state.user.userid,
                user:state=>state,
                curOrg: state => state.user.curOrg,   //当前的组织信息
                username: state => state.user.username,
                Roleauthorize: state => state.user.Roleauthorize,
                dbname:state=>state.user.dbname,
            })
        },
        methods: {
            /*
            * 当前页面接口
            * */
            //获取左侧辅助项类型
            getResidueType: function() {
                let url='/PVoucherMst/GetAuxSubjectTypeList';
                let param={
                    orgid: this.orgid, //组织Id，(必填)
                    EnabledMark: this.showStop?0:1,  //辅助类型显示停用传0, 不显示停用传1(必填)
                    uname:this.searchCode
                };
                this.$axios.get(url,{params:param}).then( res=>{
                    if(res.Status=='success'){
                        this.typeList=res.type;
                        this.choosedType=res.type[0];
                    }else{
                        this.saasMessage={
                            message:'未查询到匹配辅助类型，请检查您输入的关键字是否有误',
                            delay:3000,
                            visible:true
                        };
                    }
                }).catch( err=>{
                    console.log(err)
                })
            },
            //获取右侧表格数据
            getResidueData: function() {
                if(this.date1.choosedYear=='') return;
                let url='/PVoucherMst/GetAuxSubjectBalanceReport';
                let param={
                    orgid: this.orgid, //组织Id，(必填)
                    Year:this.date1.choosedYear, //年度(必填)
                    Pmonth:this.date1.choosedMonth, //开始时间(必填)  计算本期发生额
                    PmonthTwo:this.date1.choosedMonthEnd, //结束时间(必填)  计算本期发生额
                    AuxTypeId:this.choosedType.PhId, //辅助类型Id(必填)
                    value:this.inputKvalue, //编码/辅助项目名称模糊查询（选填）
                    Verify:this.apartList.proof?1:0, //是否剔除未审核凭证，传1（选填）
                    BQFS:this.apartList.BQFS?1:0,   //是否剔除本期发生，传1（选填）
                    QMYE:this.apartList.QMYE?1:0   //是否剔除期末余额，传1（选填）

                };
                this.$axios.get(url,{params:param}).then( res=>{
                    console.log(res)
                    if(res.Status=='success'){
                        this.dataList=res.list;
                    }else{
                        this.dataList=[];
                        this.saasMessage={
                            message:'对应辅助类型无数据',
                            delay:3000,
                            visible:true
                        };
                    }
                }).catch( err=>{
                    console.log(err)
                })
            },
            /*
            * 明细账复制接口，后面按需保留
            * */
            /*时间选择*/
            dateChoose:function(val){
                let time=val;
                this.date1=time;
                this.searchYear=time.choosedYear;
                if(this.choosedType.PhId!=undefined){
                    this.getResidueData();
                }

            },
            /*获取结账年*/
            getCheckeds(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{
                        console.log(res);
                        if(res.Record.length>0){
                            this.jyear=res.Record[0].JYear;
                            this.jmonth=res.Record[0].JAccountPeriod;
                        }else{
                            let currentYear = new Date();
                            this.jyear=currentYear.getFullYear();
                            this.jmonth=0;
                        }
                    })
                    .catch(err=>console.log(err))
            },


            /*excel导出*/
            postBalanceSheetExcel:function() {

                let loading=this.$loading();
                let param = {
                    orgid: this.orgid, //组织Id，(必填)
                    uid:this.userid,//用户id
                    Year:this.date1.choosedYear, //年度(必填)
                    Pmonth:this.date1.choosedMonth, //开始时间(必填)  计算本期发生额
                    PmonthTwo:this.date1.choosedMonthEnd, //结束时间(必填)  计算本期发生额
                    AuxTypeId:this.choosedType.PhId, //辅助类型Id(必填)
                    value:this.inputKvalue, //编码/辅助项目名称模糊查询（选填）
                    Verify:this.apartList.proof?1:0, //是否剔除未审核凭证，传1（选填）
                    BQFS:this.apartList.BQFS?1:0,   //是否剔除本期发生，传1（选填）
                    QMYE:this.apartList.QMYE?1:0   //是否剔除期末余额，传1（选填）

                };
                let base=httpConfig.getAxiosBaseConfigUncontrol();
                //下载Excel
                this.downloadLoading = true;
                let url="PVoucherMst/GetAuxSubjectAllBalanceExcel";

                this.$axios.get(url,{params:param})
                    .then(res=>{
                        // "{\"path\":\"zcfz\",\"filename\":\"20181229103028248.xls\"}"
                        //window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        if(res.Status=="error"){
                            this.$message({ showClose: true, message: res.Msg, type: 'error' })
                        }else{
                            // window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                            /* let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
                             myWindow=null;*/
                            let tempLink = document.createElement("a");
                            let downloadUrl=base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                            tempLink.style.display = "none";
                            tempLink.href = downloadUrl;
                            tempLink.setAttribute("download", res.filename);
                            if (typeof tempLink.download === "undefined") {
                                tempLink.setAttribute("target", "_blank");
                            }
                            document.body.appendChild(tempLink);
                            tempLink.click();
                            document.body.removeChild(tempLink);
                        }
                        this.downloadLoading = false;
                        loading.close();
                    }).catch(err=>{
                    loading.close();
                    console.log(err);
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
               let print = document.createElement("div");
               print.setAttribute('class','timeSelect');
               print.style.padding='30px 40px 30px 30px';
               let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
               //获取隐藏的工会组织科目名称的表头
               let thchilds=document.getElementById('theadArea').cloneNode(true).childNodes;
               //获取隐藏的表格内容--表尾
               let tbchilds=document.getElementById('tbodyArea').cloneNode(true).childNodes;
               //表头拼接
               for(let i=thchilds.length-1;i>=0;i--){
                   dm.insertBefore(thchilds[i],dm.firstChild);
               }
               //获取页面的表格内容
               let cop = this.$refs.printFrom.cloneNode(true);
               //表格内容拼接表尾
               for(let i=0;i<tbchilds.length;i++){
                   cop.lastChild.appendChild(tbchilds[i]);
               }
               //表格内容拼接表头
               cop.insertBefore(dm,cop.childNodes[2]);
               print.appendChild(cop);
               this.$print(print) // 使用
           },
            //刷新
            refresh:function(){
                this.getResidueData(false);
            },

        }
    }
</script>

<style scoped>
    .tableContent{
        position: relative;
        top: 10px;
        width: 100%;
    }
    .voucherCover{
        position:fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: 100%;
        padding: 0 30px;
        overflow-y: auto;
    }



    .voucherCover .el-icon-close{
        float: right;
        color: #ccc;
        font-size: 24px;
        padding:0px 7px;
        cursor: pointer;
    }
    .voucherCover .voucherCover_title{
        font-size: 17px;
        font-weight: 600;
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
        height: 45px;
    }
    .voucherContent{
        margin-top: 8%;
        background-color: white;
        width: 80%;
        margin-left: 10%;
        padding: 5px 15px;
        border-radius: 5px;
    }
    .selectContainer>select {
        background-color: transparent;
        line-height: 30px;
    }
    .searcherValue {
        height: 30px;
        display: inline-block;
        vertical-align: bottom;
        position: relative;
        padding-right: 16px;
    }
    .searcherValue span{
        position: absolute;
        right: 1px;
        top: 8px;
        color: #C0C4CC;
        display: none;
        cursor: pointer;
    }
    .unionState>ul>li{
        width:100%;
    }
    .unionLists{
        width: 260px;
        min-width: 260px;
        margin-right: 10px;
        border: 1px solid #dadada;
        height: 100%;
        position: relative;
        overflow: hidden;
    }
    .unionLists~.formData{
        width:100%;
        align-self: flex-start;
    }
    .unionLists>div.unionListsTitle{
        text-align: center;
        background: #45c0f7;
        height:50px;
        color:#fff;
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 260px;
        z-index: 9;
        margin-left:-1px;
    }
    .unionContent ul li{
        height: 35px;
        line-height: 35px;
        text-align: center;
        border: 1px solid #00b8ee;
        border-radius: 5px;
        margin: 10px 30px;
        cursor: pointer;
    }
    .unionContent ul li:hover{
        color: #00B8EE;
    }
    .unionContent ul .active{
        background-color: #00B8EE;
        color: #fff!important;
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
    .unionListsContent{
        position: absolute;
        overflow-y: scroll;
        overflow-x: hidden;
        bottom: 35px;
        left: 0;
        top: 52px;
        width: 275px;
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
    div.moreList{
        position:relative;
    }
    div.moreList:before{
        content:"-";
        display: block;
        width:10px;
        height:10px;
        line-height: 10px;
        text-align: center;
        border:1px solid #333;
        background: #d5f3fe;
        position:absolute;
        left:-12px;
        top:3px;
        color:#333;
        z-index: 2;
    }
    div.moreListOpen:before{
        content:"+";
        line-height: 8px;
    }
    .searchPanel{
        position: absolute;
        top: 42px;
        right: -103px;
        z-index: 99;
        background-color: #fff;
        width: 360px;
        height: auto;
        box-shadow: 0 0 6px 2px #c9ccce;
        border-radius: 10px 10px;
    }
    .searchPanel input{
        height: 100%;
        background-color: #fff;
    }

    .searchPanel .searchPanel_title{
        height: 40px;
        background-color: #00b7ee;
        color: #fff;
        border-radius: 10px 10px 0 0;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
    }
    .searchPanel .searchPanel_title i{
        float: right;
        position: relative;
        top: -30px;
        right: 10px;
        padding: 2px;
        background: #fff;
        color: #00b7ee;
        border-radius: 15px;
        font-size: 13px;
        -webkit-box-shadow: 1px 1px 2px 1px #909090;
        -moz-box-shadow: 1px 1px 2px 1px #909090;
        box-shadow: 1px 1px 2px 1px #909090;
        cursor: pointer;
    }
    .searchPanel  .searchPanel_content{
        padding: 10px;
    }
    .searchPanel_content>div{
        margin-bottom: 10px;
    }
    .searchPanel .searchContentArea{
        border: 1px solid #dcdcdc;
        border-radius: 3px;
        width: 270px;
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        float: right;
    }
    .searchPanel input{
        width: 116px;
        display: inline;
        font-size: 14px;
        color: #606266;
        border: none;
        padding-left: 5px;
    }
    .searchPanel .searchPanel_bottom{
        height: 65px;
        border-top: 1px solid #dddfe4;
        padding: 0 40px;
        background-color: #fff;
    }
    .searchPanel .searchPanel_btn{
        height: 33px;
        color: #fff;
        line-height: 33px;
        text-align: center;
        cursor: pointer;
        border: 1px solid #00B8EE;
        background: #00B8EE;
        padding: 0 15px;
        width: 100px;
        border-radius: 3px;
        -webkit-box-shadow: 1px 1px 2px 1px #909090;
        -moz-box-shadow: 1px 1px 2px 1px #909090;
        box-shadow: 1px 1px 2px 1px #909090;
    }
    .searchPanel .searchPanel_btn:hover{
        color: #00B8EE;
        background: #fff;
    }
    /* .searchPanel .searchPanel_btn:active{
         color: #88b927;
         border-color: #88b927;
     }*/
    #printContentArea a{
        color: #000;
        text-decoration: none;
    }

    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(66,66,66,0.45);
        z-index: 99;
        text-align: center;
        overflow-y: auto;
    }

    .coverContent{
        background-color: #fff;
        width: 362px;
        height: auto;
        position: absolute;
        top: 15%;
        left: 50%;
        margin-left:-181px;
        margin-bottom: 50px;
        box-shadow: 0 0 5px 1px #d3e9f9;
    }

    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid #eee;
        padding:10px 20px;

    }
    .coverContent div:nth-of-type(2){
        padding: 0px 20px;
    }
    .coverContent ul{
        padding: 0px 50px;
        margin-bottom: 20px;
    }
    .coverContent ul li:nth-of-type(1){
        border: 1px solid #00B8EE;
        color: #00B8EE;
        background:#FFF ;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li{
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
        cursor: pointer;
    }
    .coverContent ul li:hover{
        color: #00B8EE;
        background: #fff;
    }
    /*兼容IE11样式  测试后才可确定是否可用*/
    @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
        .voucherCover{
            position:-ms-page;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            height: 100%;
            width: 100%;
            padding: 0 30px;
            overflow-y: auto;
        }
        .cover{
            position: -ms-page;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(66,66,66,0.45);
            z-index: 99;
            text-align: center;
            overflow-y: auto;
        }
    }
    .voucherDisabledCon{
        position:relative;
        width:100%;
        z-index: 99;
        background:#fff;
    }
    .voucherDisabledCon> .voucherDisabled{
        position:absolute;
        background: none;
        z-index: 99;
        width:74%;
        height:100%;
        top:74px;
        right:0;
    }
    .voucherDisabledCon> .voucherDisabled >div{
        position:relative;
        z-index:89;
    }
    .voucherHandle{
        overflow: hidden;
        margin-top:10px;
    }
    .voucherHandle>span{
        float:right;
        margin-right:20px;
    }
    .tbHeader td{
        height: 24px!important;
    }
</style>
<style>
    .timeSelect .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        color: #00b8ee;
    }
    .flexUl .el-input--suffix .el-input__inner{
        line-height: 30px;
    }
</style>
