<template>
        <div class="manageContent" v-loading="loading" id="ts">
            <div class="reportBox">
                <div class="unionState flexPublic">
                    <ul class="flexPublic">
                    <li class="flexPublic">
                        <div>条件：</div>
                        <div  class="block selectContainer">
                            <select class="el-input__inner el-button--small" v-model="proofType">
                                <option value="0,1">包含未审核凭证</option>
                                <option value="1">不包含未审核凭证</option>
                            </select>
                        </div>

                    </li>
                    </ul>


                    <!--<ul class="flexPublic">-->
                    <!--<div >-->
                        <!--<el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>-->
                    <!--</div>-->

                    <!--</ul>-->
                    <ul class="flexPublic handle">
                        <div class="flexPublic handle">
                            <div class="searcherValue"><input type="text" placeholder="凭证字号/摘要" v-model="inputKvalue"></div>
                            <div  class="searcherBtn" @click="selectBtn">搜索</div>
                            <div   class="searcherBtn" @click="showType='block'" style="margin-left: 20px">高级</div>
                            <div class="searchPanel" :style="{'display':showType}">
                                <div class="flexPublic searchPanel_title">
                                    <div>高级查询</div>
                                    <div class="el-icon-close" @click="showType='none'"></div>
                                </div>
                                <div class="flexPublic">
                                    <div>凭证日期:</div>
                                    <div>
                                        <el-date-picker
                                            v-model="zwTime"
                                            type="daterange"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            value-format="yyyy-MM-dd"
                                            style="width: 250px;border:none;padding-right: 0;"
                                            popper-class="popper"
                                        >
                                        </el-date-picker>
                                    </div>
                                </div>
                                <div class="flexPublic">
                                    <div>凭证号码</div>
                                    <div class="flexPublic">
                                        <input v-model="startCode"/>至<input v-model="endCode"/>
                                    </div>

                                </div>
                                <div class="flexPublic">
                                    <div>发生金额</div>
                                    <div class="flexPublic">
                                        <input v-model="startMoney"/>至<input v-model="endMoney"/>
                                    </div>
                                </div>
                                <div class="flexPublic searchPanel_bottom">
                                    <div class="searchPanel_btn greybtn" @click="clearPorp">重置</div>
                                    <div class="searchPanel_btn bluebtn" @click="searchDetail">搜索</div>
                                </div>

                            </div>
                        </div>
                        <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel" :loading="downloadLoading">导出</li></a>
                        <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li></a>
                        <a><li style='margin:0 0 0px 20px;' class="el-icon-refresh" @click="refresh"></li></a>
                    </ul>
                </div>
                <div class="flexPublic  p0">
                    <div class="unionLists" >

                        <div class="unionListsTitle">

                        <div class="el-input el-input--prefix" style="text-align: center; padding: 3px 10px;height: 35px;overflow: hidden">
                            <div style="width: 158px;height: 26px;line-height: 26px;margin: auto">
                                <input type="text" autocomplete="off" placeholder="搜索科目编码/名称" class="el-input__inner" style="width: 158px;height: 26px;line-height: 26px;font-size: 10pt;" @change="searchCode">
                                <i class="el-input__icon el-icon-lx-search" style="position: relative; left: -60px;z-index: 14; height: 26px;top: -28px;color: #dcdfe6;"></i>

                            </div>

                        </div>
                        </div>
                        <div class="unionListsContent">
                            <el-tree
                                class="filter-tree"
                                :data="subjectLists"
                                :props="defaultProps"
                                default-expand-all
                                node-key="PhId"
                                :filter-node-method="filterNode"
                                @node-click="handleNodeClick"
                                ref="subjectTree">
                            </el-tree>
                        </div>
                    </div>
                    <div class="formData" ref="printFrom" @mousedown="loadMore" > <!--v-loading.fullscreen.lock="loading"-->
                        <ul>
                            <li>凭证日期</li>
                            <li>凭证字号</li>
                            <li>摘要</li>
                            <li>借方金额(元)</li>
                            <li>贷方金额(元)</li>
                            <li>方向</li>
                            <li>余额(元)</li>
                        </ul>
                       <ul class="formDataItems flexPublic" v-if="dataInfoMonth.Pdate!=undefined">
                            <li>{{dataInfoMonth.Pdate.slice(0,10)}}</li>
                            <li></li>
                            <li :class="{bolder:true,'align-center':true}">{{date1.choosedMonth==1?'本年期初':dataInfoMonth.Abstract}}</li>
                            <li class="align-right">{{dataInfoMonth.JSum| NumFormat}}</li>
                            <li class="align-right" :title="dataInfoMonth.DSum">{{dataInfoMonth.DSum| NumFormat}}</li>
                            <li>{{JD[dataInfoMonth.DType]}}</li>
                            <li class="align-right">
                                {{ KBalanceType=='1' ? (Number(dataInfoMonth.JSum)-Number(dataInfoMonth.DSum)) : (Number(dataInfoMonth.DSum)-Number(dataInfoMonth.JSum))  | NumFormat}}
                            </li>
                        </ul>
                        <ul class="formDataItems flexPublic" v-for="item of dataInfo" :key="item.uid">
                            <li>{{item.Pdate}}</li>
                            <li class="align-center" style=""><a @click="showvoucher" :title="item.PhIdMst">{{item.Pno!='本月累计'&&item.Pno!='本年累计'?'记-'+item.Pno:''}}</a></li>
                            <li :class="{bolder:item.Abstract=='本月累计'||item.Abstract=='本年累计','align-center':true}">{{item.Abstract}}</li>
                            <li class="align-right">{{item.JSum |NumFormat}}</li>
                            <li class="align-right">{{item.DSum |NumFormat}}</li>
                            <li>{{JD[item.DType]}}</li>
                            <template v-if="item.Pno!='本月累计'&&item.Pno!='本年累计'">
                                <li></li>
                            </template>
                            <template v-else>
                                <li class="align-right">{{ KBalanceType=='1' ? (Number(item.JSum)-Number(item.DSum)) : (Number(item.DSum)-Number(item.JSum))  | NumFormat}}</li>
                            </template>

                        </ul>
                        <div :style="{'display':!busy?'block':'none'}">
                            ...加载中
                        </div>
                        <!--
                            v-infinite-scroll:
                            infinite-scroll-distance 指定滚动条距离底部多高时触发v-infinite-scroll指向的方法
                            infinite-scroll-disabled 等于true时代表正在执行加载，这时禁用滚动触发
                            infinite-scroll-listen-for-event 当vue实例触发事件时立即再次检查
                            infinite-scroll-throttle-delay 两次检查之间的时间间隔(默认值= 200)
                          -->
                        <!--<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"  infinite-scroll-distance="10">
                            <template v-if="!busy">.....加载中</template>
                        </div>-->
                    </div>
                </div>
                <!--<div class="voucherCover" :style="{'display':voucherDataList.bool?'block':'none'}" >
                    <div class="el-icon-close" @click="voucherDataList.bool=false"></div>
                    <div class="voucherContent">
                        <voucher :dataList="voucherDataList" v-if="voucherDataList.bool" ref="voucher"></voucher>
                    </div>
                </div>-->

            </div>

            <div class="timeSelectBox">
                <time-select-bar @item-click="dateChoose"
                                :showtype="'doubleTime'"
                ></time-select-bar>
            </div>
        </div>
</template>

<script>
    import {delList} from '../../../api/detailaccount/details.js'
    import { mapState, mapActions } from 'vuex'
    import { SubjectList } from '@/api/subject/subjectInfo'
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import voucher from '../..//finance/voucher'
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    /**
     * 明细表
     */
    export default {
        name: "detailsAc",
        data() {
            return {
                sideDate:'',
                voucherDataList:{bool:false,data:{Mst:'',Attachements:[]}},
                JD:['平','借','贷'],
                downloadLoading: false,
                loading: false,
                filterText:'',
                subjectLists: [],
                selectItem:'',
                defaultProps: {
                    children: 'children',
                    label: 'KNameC'
                },
                zwTime:'', //账期 开始时间 结束时间  [ "2018-12-07", "2019-01-11" ]
                auxiliary:0,  //显示辅助项
                pageSize: 10, //pageSize
                pageIndex: 0, //pageIndex
                testIndex:0,
                totalCount: 0, //总页数
                busy:false,    //是否正在加载过程中
                dataInfo: [],
                dataInfoMonth: {},//月初数据
                selectSubject:'',  //选择科目
                date1:{choosedYear:'',
                       choosedMonth:'',
                       choosedMonthEnd:''},
                loading:false,
                inputCode:'',//搜索框输入项目编码
                focus:false,
                proofType:'0,1',
                inputKvalue:'',//顶部搜索框输入凭证字号或摘要Kno Abstract
/*高级搜索框参数   */
                showType:'none',
                zwTime:'',
                startCode:'',
                endCode:'',
                startMoney:'',
                endMoney:'',
                que:'',
                KBalanceType:''//用于判断本月累计和本年累计计算方式
            }
        },
        created() {
            //获取科目属性列表
            this.getSubjectData();
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
            console.log(this.user);
        },
        watch: {

            filterText(val) {
                this.$refs.subjectTree.filter(val);
            },
            inputCode(val){
                this.inputCode=val;
            },
            proofType:function(){
                this.getData(false);
            }
        },
        components: {TimeSelectBar,voucher},
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                orgName:state=>state.user.orgName,
                uid:state=>state.user.userid,
                user:state=>state
            })
        },
        methods: {
            handleScroll: function () {
                let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                // 设备/屏幕高度
                let scrollObj = document.getElementById('ts'); // 滚动区域
                let scrollTop = scrollObj.parentElement.parentElement.parentElement.scrollTop; // div 到头部的距离
                let scrollHeight = scrollObj.scrollHeight; // 滚动条的总高度
                //滚动条到底部的条件
                if(scrollTop>=100){
                    // div 到头部的距离 + 屏幕高度 = 可滚动的总高度

                    if(!this.busy){
                        this.loadMore();
                    }
                }
            },
            //显示凭证
            showvoucher:function(val){

                this.getVoucherData(val.target.title);

                },
            //清除高级查询数据
            clearPorp:function(){
                this.zwTime='';
                this.startCode='';
                this.endCode='';
                this.startMoney='';
                this.endMoney=''
            },
            searchDetail:function(){
                if(this.startCode>this.endCode){
                    this.$message.error('开始凭证号码不应大于结束凭证号码');
                }else if(this.startMoney>this.endMoney){
                    this.$message.error('开始发生金额不应大于结束发生金额');
                }else{
                    this.showType='none';
                    this.getData(false);
                }

            },
            searchCode:function(val){
                this.selectSubject.KCode=val.target.value;
                //let que='{"[or-dictionary0]*dictionary*or",{"KCode*str*like":"'+val.target.value+'" , "KName*str*like":"'+val.target.value+'"}}';
                this.getSubjectData(val.target.value);
            },

            selectBtn:function(){
                 this.que=this.inputKvalue
                this.getData(false);
                // let flag=true;
                // for(let i in this.subjectLists){
                //     if(this.subjectLists[i].KCode==this.inputCode){
                //         this.selectSubject=this.subjectLists[i];
                //         this.getData();
                //         flag=false;
                //     }
                // }
                // if(flag){
                //     alert('您输入的科目编码有误');
                //     this.focus=true;
                // }
            },
            dateChoose:function(val){
                let time=val;
                this.date1=time;
                this.getData(false);
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
                            this.voucherDataList.bool=true;
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
            //查询详细数据
            getData(flag) {
                if(!flag){
                    this.dataInfo=[];
                    this.getDataByMonth();
                    //清除分页查询页面增长，避免数据查询出错
                    this.pageIndex=0;
                }

                let year='';
                let Pmonth='';
                if(this.date1.choosedYear==''){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    this.date1.choosedMonthEnd=currentMonth;
                    year=currentyear;
                    Pmonth=currentMonth+','+currentMonth;
                }else{
                    year=this.date1.choosedYear;
                    Pmonth=this.date1.choosedMonth+','+this.date1.choosedMonthEnd;
                }
                var data = {
                    uid: this.uid,
                    orgid:this.orgid,
                    Kcode: this.selectSubject.KCode||'',
                    // Year: this.selectSubject.Uyear|| '',
                    Year: year,
                    OrgIds: this.orgid,
                    pageindex:this.pageIndex,
                    pagesize:this.pageSize,
                    Title:this.selectSubject.KName,
                    Verify:this.proofType,
                    Pmonth:Pmonth,
                    value:this.inputKvalue==''?'':this.que,
                    StartTime:this.zwTime[0],
                    EndTime:this.zwTime[1],
                    StartPNo:this.startCode,EndPno:this.endCode,
                    StartAmount:this.startMoney,EndAmount:this.endMoney
                };
                this.loading = true;
                this.$axios.get("/PVoucherMst/GetDetailAccount",{params:data})
                    .then(res=>{
                        this.loading = false;
                        //res.Record=this.changeData(res.Record);

                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            this.dataInfo=[]
                            return
                        }
                        //this.dataInfo=res.Record;
                        this.totalCount=res.totalRows;
                        console.log(res);

                        this.pageIndex++;  //滚动之后加载第二页
                        if(flag){//如果flag为true则表示分页
                            if(res.Record.length<this.pageSize){
                                for(var i in res.Record){
                                    this.dataInfo.push(res.Record[i]);  //concat数组串联进行合并
                                }
                                this.busy=true;//禁用滚动加载
                            }else{
                                for(var i in res.Record){
                                    this.dataInfo.push(res.Record[i]);  //concat数组串联进行合并
                                }
                                this.busy=false;//启用滚动加载
                            }
                        }else{
                            //第一次进入页面 完全不需要数据拼接的
                            for(var i in res.Record){
                                this.dataInfo.push(res.Record[i]);  //concat数组串联进行合并
                            }
                            if(res.Record.length<this.pagesize){
                                this.busy=true;//禁用滚动加载
                            }else{
                                this.busy=false;//启用滚动加载
                            }

                        }
                    })
                    .catch(err=>{
                        console.log(err)
                        this.loading = false;
                        this.$message({ showClose: true, message:'获取科目明细错误',type: 'error' })
                    })
            },
            //查询月初数据
            getDataByMonth() {
                this.dataInfoMonth={};
                let year='';
                let Pmonth='';
                if(this.date1.choosedYear==''){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    this.date1.choosedMonthEnd=currentMonth;
                    year=currentyear;
                    Pmonth=currentMonth+','+currentMonth;
                }else{
                    if(this.date1.choosedMonth!=this.date1.choosedMonthEnd){
                        if(this.date1.choosedMonth==1){
                            year=this.date1.choosedYear;
                            Pmonth=this.date1.choosedMonth+','+this.date1.choosedMonth;
                        }else{
                            return
                        }
                   }
                    else{
                        year=this.date1.choosedYear;
                        Pmonth=this.date1.choosedMonth+','+this.date1.choosedMonthEnd;
                    }
                }
                var data = {
                    uid: this.uid,
                    orgid:this.orgid,
                    Kcode: this.selectSubject.KCode||'',
                    Year: year,
                    OrgIds: this.orgid,
                    pageindex:this.testIndex,
                    pagesize:this.pageSize,
                    Title:this.selectSubject.KName,
                    Verify:this.proofType,
                    Pmonth:Pmonth,
                    value:this.inputKvalue==''?'':this.que,
                    StartTime:this.zwTime[0],
                    EndTime:this.zwTime[1],
                    StartPNo:this.startCode,EndPno:this.endCode,
                    StartAmount:this.startMoney,EndAmount:this.endMoney
                };
                this.loading = true;
                let that=this;
                this.$axios.get("/PVoucherMst/GetDetailAccount_MonthStart",{params:data})
                    .then(res=>{
                        that.loading = false;

                        if(res.Status==='error'){
                            this.$message.error(res);
                            return
                        }
                        that.dataInfoMonth=res;
                    })
                    .catch(err=>{
                        console.log(err)
                        this.loading = false;
                        this.$message({ showClose: true, message:'获取科目明细错误',type: 'error' })
                    })
            },
            async getSubjectData(queryfil){
                    let vm=this;
                    this.loading = true;
                    let queryfilter={
                        KCode:'',
                        KName:''
                    };
                    if(queryfil==''||queryfil==undefined){

                    }else{
                        queryfilter.KCode=queryfil,
                        queryfilter.KName=queryfil
                    }
                    //科目列表
                    SubjectList(vm,{
                        uid: this.uid,
                        orgid: this.orgid,
                        infoData:queryfilter
                    }).then(res => {

                    this.loading = false;
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }
                    this.pingjie(res);
                    this.subjectLists=res;

                    if(res.length>0){
                        this.selectItem=res[0];
                        this.selectSubject=res[0];
                        this.inputCode=res[0].KCode;
                        //加载第一个科目的明细
                        this.getData(false);
                        this.KBalanceType=res[0].KBalanceType
                    }

                }).catch(error =>{
                    this.loading = false;
                    this.$message({
                        showClose: true,
                        message: '科目列表获取错误',
                        type: 'error'
                    })
                })

            },
            pingjie:function(res){
                for(var i in res){
                    let KNameC=(res[i].KCode+' - '+res[i].KName)
                    res[i]['KNameC']=KNameC;
                    if(res[i].children!=[]){
                        this.pingjie(res[i].children)
                    }
                }
            },
            changeData:function(res){
                for(var i in res){
                    res[i].JSum=this.changeNum(res[i].JSum);
                    res[i].DSum=this.changeNum(res[i].DSum);
                    if(res[i].children!=[]){
                        this.changeData(res[i].children)
                    }
                }
                return res;
            },
            changeNum:function(value) {
                if(!value) return '0.00';

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
            // unionListOpen($event) {
            //     var e = $event.target;
            //     if (e.className == "moreList") {
            //         e.className = "moreList moreListOpen";
            //         e.nextElementSibling.style.display = 'none';
            //     }
            //     else if (e.className == "moreList moreListOpen") {
            //         e.className = "moreList"
            //         e.nextElementSibling.style.display = 'block';
            //     }
            // },
            //科目过滤
            filterNode(value, data) {
                if (!value) return true;
                return data.KName.indexOf(value) !== -1;
            },
            //科目选择
            handleNodeClick(data){
                this.selectSubject=data;
                this.KBalanceType=data.KBalanceType;
                this.getData(false);
                this.inputCode=data.KCode;
            },
            //当属性滚动的时候  加载  滚动加载
            loadMore(){
                if(!this.busy){
                    this.busy=true;
                    setTimeout(() => {  //发送请求有时间间隔第一个滚动时间结束后才发送第二个请求

                        this.getData(true);
                    }, 1000);
                }
            },
            postBalanceSheetExcel:function() {
                let param = {
                    uid: this.uid,
                    orgid:this.orgid,
                    OrgName:this.orgName,
                    Kcode: this.selectSubject.KCode||'',
                    Year: this.date1.choosedYear,
                    OrgIds: this.orgid,
                    pageindex:0,
                    pagesize:this.totalCount,
                    Title:this.selectSubject.KName,
                    Verify:this.proofType,
                    Pmonth:this.date1.choosedMonth+','+this.date1.choosedMonthEnd,
                    value:this.inputKvalue==''?'':this.que,
                    StartTime:this.zwTime[0],
                    EndTime:this.zwTime[1],
                    StartPNo:this.startCode,EndPno:this.endCode,
                    StartAmount:this.startMoney,EndAmount:this.endMoney,
                    'Title':this.selectSubject.KCode+this.selectSubject.KName,
                };

                //let baseheader = ajaxhttp.header;
                let base=httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true;
                this.$axios.get("/PVoucherMst/GetDetailAccountExcel",{params:param})
                    .then(res=>{
                        console.log(res);
                        // "{\"path\":\"zcfz\",\"filename\":\"20181229103028248.xls\"}"
                        window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        this.downloadLoading = false
                    }).catch(err=>{
                      console.log(err);
                    })
                /*this.$axios({
                    method: 'post',
                    url: '/PsubjectBudget/PostExportMiddleYear',
                    data: param
                }).then(res => {
                    window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                    this.downloadLoading = false
                }).catch(err => {
                    console.log(err)
                })*/
            },
            //下载文件
            fileDownload (data,fileName){
                if (!data) {
                    return
                }
                // let fileName = res.headers['content-disposition'].split('=')[1];
                // let fileName2 = res.headers['content-disposition'].match(/fushun(\S*)xls/)[0];

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
                // let subOutputRankPrint = this.$refs.printFrom;
                // console.log(subOutputRankPrint.innerHTML);
                // let newContent =subOutputRankPrint.innerHTML;
                // let oldContent = document.body.innerHTML;
                // document.body.innerHTML = newContent;
                // window.print();
                // window.location.reload();
                // document.body.innerHTML = oldContent;
                // return false;

                this.$print(this.$refs.printFrom) // 使用
            },
        //刷新
            refresh:function(){
                this.getData(false);
            }
        }
    }
</script>

<style scoped>
    .voucherCover{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 0 30px;
    }
    .voucherCover .el-icon-close{
        position: relative;
        top: 80px;
        float: right;
        background-color: #45c0f7;
        color: white;
        font-size: 20px;
        font-weight: 900;
        padding: 7px;
        border-radius: 20px;
    }
    .voucherContent{
        margin-top: 10%;
        background-color: white;
    }
    .selectContainer>select {
        background-color: transparent;
        line-height: 30px;
    }
    .searcherValue {
        border-radius: 15px 0 0 15px;
    }
    /*.reportBox{
        margin-right: 60px;
        height: 100%;
    }
    .timeSelectBox{
        position: fixed;
        right: 0;
        top: 110px;
        bottom:0;
        width: 60px;
        z-index: 99;
    }*/
    .unionState>ul>li{
        width:100%;
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
        width:15%;
    }
    .formData>ul>li:nth-of-type(3){
        width:24%;
    }
    .formData>ul>li:nth-of-type(4){
        width:18%;
    }
    .formData>ul>li:nth-of-type(5){
        width:18%;
    }
    .formData>ul>li:nth-of-type(6){
        width:5%;
    }
    .formData>ul>li:nth-of-type(7){
        width:10%;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #d3e9f9;
    }

    .formData>ul>li:first-child{
        width:10%;
        min-width: 70px;
        padding:0 2px;
    }


    .formDataItems{

        border-bottom:1px solid #ddd;
    }
    .formData>ul.formDataItems>li{
        border-right:1px solid #ddd;
        border-left:0;
        border-bottom:0;
        text-align: center;
        line-height: 40px;
        height:40px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ddd;
    }
    .unionLists{
        width:20%;
        min-width: 180px;
        align-self: flex-start;
        margin-right: 10px;
        margin-top: 10px;
        border: 1px solid #45c0f7;
    }
    .manageContent:before{
        content:"";
        display: inline-block;
    }
    .unionLists~.formData{
        width:80%;
        align-self: flex-start;
    }
    .unionLists>div.unionListsTitle{
        text-align: center;
        background: #45c0f7;
        height:50px;
        color:#fff;
        font-size: 15px;
        margin-bottom: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
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
        position: relative;
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
    .bolder{
        font-weight: bold;
    }
    .formData>ul.formDataItems>li.align-center{
        padding:0;
        text-indent: 30px;
        text-align: left;
    }
    .formData>ul.formDataItems>li.align-right{
        text-align: right;
        padding-right: 10px;
    }
    .searchPanel{
        position: absolute;
        top: 42px;
        right: -103px;
        z-index: 99;
        background-color: #fff;
        width: 339px;
        height: 250px;
        box-shadow: 0 0 6px 2px #c9ccce;
        /*border-radius: 10px 10px 0 0;*/
    }
    .searchPanel .flexPublic{
        padding: 5px 10px;
        height: 45px;
    }
    .searchPanel .searchPanel_title{
        height: 29px;
        background-color: #3E8CBC;
        color: #fff;
    }
    .searchPanel .searchPanel_title div:nth-of-type(2){
        padding: 5px;
        border-radius: 15px;
        background: white;
        font-size: 15px;
        color: #3e8cbc;
        cursor: pointer;
    }
    .searchPanel>.flexPublic:nth-of-type(3)>div:last-child,
    .searchPanel>.flexPublic:nth-of-type(4)>div:last-child{
        width: 250px;
        padding-left: 10px;
    }
    .searchPanel>.flexPublic:nth-of-type(3)>div:last-child input,
    .searchPanel>.flexPublic:nth-of-type(4)>div:last-child input{
        width: 116px;
        display: inline;
        font-size: 14px;
        color: #606266;
        border: none;
        padding-left: 5px;
    }
    .searchPanel .searchPanel_bottom{
        height: 86px;
        border-top: 1px solid #dddfe4;
    }
    .searchPanel .searchPanel_btn{
        width: 135px;
        height: 33px;
        color: #fff;
        line-height: 33px;
        text-align: center;
        cursor: pointer;
    }

    .searchPanel .greybtn{
        background-color: #606266;
    }
   .searchPanel .bluebtn{
        background-color: #3e8cbc;
    }
</style>
