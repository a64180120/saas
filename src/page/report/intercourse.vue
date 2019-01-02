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
                                        <template v-if="item.Asset_Name">
                                            {{item.Asset_Amount | NumFormat}}
                                        </template>
                                        <template v-else></template>
                                    </li>
                                    <li :class="{'bolder':item.Layer==1,'algin-center':item.Layer==2}">{{item.Liability_Name}}</li>
                                    <li>{{item.Liability_Content}}</li>
                                    <li class="align-right">
                                        <template v-if="item.Liability_Name">
                                            {{item.Liability_Amount | NumFormat}}
                                        </template>
                                        <template v-else></template>
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
                            <el-select v-model="chooseSubject" :value="chooseSubject.KName" placeholder="请选择"  @change="getCodeDetailData">
                                <el-option
                                    v-for="item in subjectList"
                                    :key="item.KCode"
                                    :label="item.KName"
                                    :value="item.KCode"
                                    :style="{'margin-left':'30px'}"
                                >
                                </el-option>
                            </el-select>
                            <div class="btnArea">
                                <div class=""  @click="aocType.show=false">取消</div>
                                <div class="">保存</div>
                            </div>

                        </div>
                        <div class="formData" ref="printFrom">
                            <ul>
                                <li style="width:80%">具体内容</li>
                                <li style="width:20%">金额(元)</li>
                            </ul>
                            <ul class="formDataItems flexPublic" v-for="item in changeList">
                                <li style="width:80%"><input :disabled="item.content=='合计'" :class="{bolder:item.content=='合计'}" :value="item.content"></li>
                                <li style="width:20%" class="align-right"><input :disabled="item.content=='合计'" :class="{bolder:item.content=='合计'}" :value="item.money"></li>
                            </ul>
                            <ul class="formDataItems flexPublic">
                                <li style="width:80%"><input class="bolder"value="合计"></li>
                                <li style="width:20%" class="align-right"><input disabled class="bolder" :value="countMoney"></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="timeSelectBox">
                <time-select-bar @item-click="dateChoose" :showtype="'singleTime'"></time-select-bar>
            </div>
        </div>
    </div>
</template>

<script>
    import TimeSelectBar from "../../components/TimeSelectBar/index";
    import { mapState, mapGetters } from "vuex";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
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
                subjectList:[
                    {value:0,label:'资产明细'}
                ],//选择资产类，查询详细的资产类科目
                chooseSubject:'',//选择的资产科目
                aocType:{show:false,choose:0,title:'新增往来明细'}, //选择的增加还是修改,0增加，1修改
                changeList:[{'content':'','money':''}],//默认添加的空白表格
                countMoney:0
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
            this.getData();
            this.addBlock();

        },
        components: { TimeSelectBar },
        watch:{
            checkType:function(){
                this.getCodeData();

            }
        },
        methods:{
            //页面加载，默认添加表格
            addBlock:function (){
                let c={'content':'','money':''};
                for(let i=0;i<6;i++){
                    this.changeList.push(c)//默认添加的空白表格
                }
            },
            //选择增加还是隐藏
            aoc:function(type){
              this.aocType.show=true;
              this.aocType.choose=type;
              if(type==0){
                  this.aocType.title='新增往来款项明细';
                  this.getCodeData();
              }else{
                  this.aocType.title='修改往来款项明细'
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
                    param=currentyear+'-'+currentMonth;
                }else{
                    param=this.date1.choosedYear+'-'+this.date1.choosedMonth;
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
                    param=currentyear+'-'+currentMonth;
                }else{
                    param=this.date1.choosedYear+'-'+this.date1.choosedMonth;
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
                }).catch(err=>{
                    this.loading=false;
                    this.$message(err);
                })
            },
            //根据科目类型获取明细列表
            getCodeDetailData:function(){
                let param='';
                if(this.date1.choosedYear==undefined){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    param=currentyear+'-'+currentMonth;
                }else{
                    param=this.date1.choosedYear+'-'+this.date1.choosedMonth;
                }
                let data={
                    "orgid":this.orgid,
                    "Year":  param,
                    'Type': this.chooseSubject.Type,
                    'KCode':this.chooseSubject.KCode
                }
                this.loading=true;
                this.$axios.get(
                    // 'PSubjectBudget/GetBeginYear',
                    'DealingsMst/GetPSubjectByType',
                    {params:data}
                ).then(res=>{
                    this.loading=false;
                    console.log(res);
                    //this.changeList=res.Record;
                }).catch(err=>{
                    this.loading=false;
                    this.$message(err);
                })
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
                let param = {'uid':this.uid,
                    'orgid':this.orgid,
                    'infoData': this.budgetList};

                //let baseheader = httpConfig.header;
                let base = httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true
                this.$axios({
                    method: 'post',
                    url: '/PsubjectBudget/PostExportBeginYear',
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
