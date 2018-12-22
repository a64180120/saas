<template>
        <div class="manageContent" v-loading="loading">
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
                        </div>
                        <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel" :loading="downloadLoading">导出</li></a>
                        <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li></a>

                    </ul>
                </div>
                <div class="flexPublic  p0">
                    <div class="unionLists">

                        <div class="unionListsTitle">科目列表 &nbsp;
                        </div>
                        <div class="el-input el-input--prefix" style="text-align: center; padding: 3px 10px;height: 35px;overflow: hidden">
                            <div style="width: 158px;height: 26px;line-height: 26px;margin: auto">
                                <input type="text" autocomplete="off" placeholder="搜索科目编码/名称" class="el-input__inner" style="width: 158px;height: 26px;line-height: 26px;font-size: 10pt;" @change="searchCode">
                                <i class="el-input__icon el-icon-lx-search" style="position: relative; left: -60px;z-index: 14; height: 26px;top: -28px;color: #dcdfe6;"></i>

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
                    <div class="formData" ref="printFrom"> <!--v-loading.fullscreen.lock="loading"-->
                        <ul>
                            <li>凭证日期</li>
                            <li>凭证字号</li>
                            <li>摘要</li>
                            <li>借方金额(元)</li>
                            <li>贷方金额(元)</li>
                            <li>方向</li>
                            <li>余额(元)</li>
                        </ul>
                        <ul class="formDataItems flexPublic" v-for="item of dataInfo" :key="item.uid">
                            <li>{{item.Pdate.slice(0,10)}}</li>
                            <li class="align-center" :title="item.Pno">{{item.Pno!='本月累计'&&item.Pno!='本年累计'?item.Pno:''}}</li>
                            <li :class="{bolder:item.Abstract=='本月累计'||item.Abstract=='本年累计','align-center':true}">{{item.Abstract}}</li>
                            <li class="align-right">{{item.JSum | NumFormat}}</li>
                            <li class="align-right" :title="item.DSum">{{item.DSum | NumFormat}}</li>
                            <li>{{JD[item.DType]}}</li>
                            <li class="align-right">{{item.Balance | NumFormat}}</li>
                        </ul>
                        <!--
                            v-infinite-scroll:
                            infinite-scroll-distance 指定滚动条距离底部多高时触发v-infinite-scroll指向的方法
                            infinite-scroll-disabled 等于true时代表正在执行加载，这时禁用滚动触发
                            infinite-scroll-listen-for-event 当vue实例触发事件时立即再次检查
                            infinite-scroll-throttle-delay 两次检查之间的时间间隔(默认值= 200)
                          -->
                        <!--<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">-->
                            <!--.....加载中-->
                        <!--</div>-->
                    </div>
                </div>
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
    /**
     * 明细表
     */
    export default {
        name: "detailsAc",
        data() {
            return {
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
                pageSize: 40, //pageSize
                pageIndex: 1, //pageIndex
                testIndex:0,
                totalCount: 0, //总页数
                busy:false,    //是否正在加载过程中
                dataInfo: [],
                selectSubject:'',  //选择科目
                date1:{choosedYear:'',
                       choosedMonth:'',
                       choosedMonthEnd:''},
                loading:false,
                inputCode:'',//搜索框输入项目编码
                focus:false,
                proofType:'0,1',
                inputKvalue:''//顶部搜索框输入凭证字号或摘要Kno Abstract
            }
        },
        created() {
            //获取科目属性列表
            this.getSubjectData();
        },
        mounted() {

        },
        watch: {

            filterText(val) {
                this.$refs.subjectTree.filter(val);
            },
            inputCode(val){
                this.inputCode=val;
            },
            proofType:function(){
                this.getData(this.date1,this.proofType);
            }
        },
        components: {TimeSelectBar},
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                uid:state=>state.user.userid,
                user:state=>state.user
            })
        },
        methods: {
            searchCode:function(val){
                this.selectSubject.KCode=val.target.value;
                //let que='{"[or-dictionary0]*dictionary*or",{"KCode*str*like":"'+val.target.value+'" , "KName*str*like":"'+val.target.value+'"}}';
                this.getSubjectData(val.target.value);
            },

            selectBtn:function(){
                 let que='{"[or-dictionary0]*dictionary*or",{"Pno*str*like":"'+this.inputKvalue+'" , "Abstract*str*like":"'+this.inputKvalue+'"}}';
                this.getData(this.inputKvalue);

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
                this.getData();
            },
            getData(queryf) {
                let year='';
                let Pmonth='';
                let query=(queryf==undefined?'':queryf);
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
                    pageindex:this.testIndex,
                    pagesize:this.pageSize,
                    Title:this.selectSubject.KName,
                    Verify:this.proofType,
                    Pmonth:Pmonth,
                    value:query
                };

                this.loading = true;
                this.$axios.get("/PVoucherMst/GetDetailAccount",{params:data})
                    .then(res=>{
                        this.loading = false;
                        if(res.Status==='error'){
                            this.$message.error(res.Msg);
                            this.dataInfo=[]
                            return
                        }
                        this.dataInfo=res.Record;
                        this.totalCount=res.totalRows;
                        // if(flag){//如果flag为true则表示分页
                        //     this.dataInfo=res.Record;  //concat数组串联进行合并
                        //
                        //     if(res.Record.count==0){  //如果数据加载完 那么禁用滚动时间 this.busy设置为true
                        //         this.busy=true;
                        //     }else{
                        //         this.busy=false;
                        //     }
                        // }else{
                        //     //第一次进入页面 完全不需要数据拼接的
                        //     this.dataInfo=res.Record;
                        //     this.totalCount=res.totalRows;
                        // }
                    })
                    .catch(err=>{
                        console.log(err)
                        this.loading = false;
                        this.$message({ showClose: true, message:'获取科目明细错误',type: 'error' })
                    })


            },
            async getSubjectData(queryfil){
                console.log('查询科目');
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
                        this.getData(res[0]);
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
                this.getData();
                this.inputCode=data.KCode;
            },
            //当属性滚动的时候  加载  滚动加载
            loadMore(){
                this.busy=true  //将无限滚动给禁用
                setTimeout(() => {  //发送请求有时间间隔第一个滚动时间结束后才发送第二个请求
                    this.pageIndex++;  //滚动之后加载第二页
                    if(this.pageIndex < this.totalCount){
                        this.getData(true);
                    }
                }, 1000);
            },
            postBalanceSheetExcel:function() {
                let param = {'uid':this.uid,
                    'orgid':this.orgid,
                    'infoData': this.budgetList};

                let baseheader = ajaxhttp.header;
                let base = ajaxhttp.base;

                //下载Excel
                this.downloadLoading = true
                this.$axios({
                    method: 'post',
                    url: '/PsubjectBudget/PostExportMiddleYear',
                    data: param
                }).then(res => {
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
            printLodop() {
                const me = this
                var html=this.$refs.printFrom.innerHTML;
                let  LODOP = getLodop();
                LODOP.PRINT_INIT("资产负债表");      //首先一个初始化语句
                LODOP.SET_PRINT_STYLE("FontSize", 18);  //字体
                LODOP.SET_PRINT_STYLE("Bold", 1);
                //LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
                LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "资产负债表");
                LODOP.ADD_PRINT_HTM(88, 200, 350, 600,html);
                //LODOP.PRINT();
                LODOP.PREVIEW();
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
            }

        }
    }
</script>

<style scoped>
    .selectContainer>select {
        background-color: transparent;
        line-height: 30px;
    }
    .searcherValue {
        border-radius: 15px 0 0 15px;
    }
    .reportBox{
        margin-right: 60px;
        height: 100%;
    }
    .timeSelectBox{
        position: fixed;
        right: 0;
        top: 110px;
        bottom:0;
        width: 60px;
        z-index: 999;
    }
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
        border-right:1px solid #2780d1;
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
        align-self: flex-start;
        margin-right: 10px;
        margin-top: 10px;
        border: 1px solid #83c350;
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
        background: #83c350;
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
</style>
