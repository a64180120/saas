<template>
    <div class="container">


    <div class="manageContent" v-loading="loading">
        <div class="reportBox">
            <div class="unionState flexPublic">
                <ul class="flexPublic">
                    <li class="flexPublic">
                        <div>条件：</div>
                        <div  class="block selectContainer">
                            <select class="el-input__inner el-button--small" v-model="proofType">
                                <option value="1">包含未审核凭证</option>
                                <option value="0">不包含未审核凭证</option>
                            </select>
                        </div>

                    </li>
                </ul>
                <ul class="flexPublic handle">
                    <el-button class="el-button--small" style='margin:0 0 0px 20px;' icon="el-icon-lx-mail" @click="printContent">打印</el-button >
                    <el-button class="el-button--small" style='margin:0 0 0px 20px;' icon="el-icon-lx-down" @click="postBalanceSheetExcel" :loading="downloadLoading">导出</el-button >
                </ul>
            </div>

        <div class="formData" ref="printFrom">
            <ul>
                <li>编码</li>
                <li>资产</li>
                <li>年初数(元)</li>
                <li>期末数(元)</li>
                <li></li>
                <li>编码</li>
                <li>资产与净资产</li>
                <li>年初数(元)</li>
                <li>期末数(元)</li>
            </ul>

                <ul class="formDataItems flexPublic">
                    <li></li>
                    <li class="align-center bolder">一、资产</li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li class="align-center bolder">二、负债</li>
                    <li></li>
                    <li></li>
                </ul>
                <template v-if="cashInData.length >= cashOutData.length+cashData.length+6">
                    <template v-for="(item,index) in cashInData">
                        <ul class="formDataItems flexPublic">
                            <li>{{item.KCode}}</li>
                            <li>{{item.KName}}</li>
                            <li class="align-right">{{item.StartSum}}</li>
                            <li class="align-right">{{item.EndSum}}</li>
                            <li></li>
                            <template v-if="index<=cashOutData.length">
                                <li>{{cashOutData[index-1].KCode}}</li>
                                <li>{{cashOutData[index-1].KName}}</li>
                                <li class="align-right">{{cashOutData[index-1].StartSum}}</li>
                                <li class="align-right">{{cashOutData[index-1].EndSum}}</li>
                            </template>
                            <template v-else-if="index==cashOutData.length+1">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </template>
                            <template v-else-if="index==cashOutData.length+2">
                                <li></li>
                                <li class="align-center bolder">负债合计</li>
                                <li class="align-right">{{cashCounts}}</li>
                                <li class="align-right">{{cashCountsQ}}</li>
                            </template>
                            <template v-else-if="index==cashOutData.length+3">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </template>
                            <template v-else-if="index==cashOutData.length+4">
                                <li></li>
                                <li class="align-center bolder">三、净资产类</li>
                                <li></li>
                                <li></li>
                            </template>
                            <template v-else-if="index==cashOutData.length+cashData.length+5">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </template>
                            <template v-else-if="index==cashOutData.length+cashData.length+6">
                                <li></li>
                                <li class="align-center bolder">净资产合计</li>
                                <li class="align-right">{{cashCounts}}</li>
                                <li class="align-right">{{cashCountsQ}}</li>
                            </template>
                            <template v-else>
                                <li>{{cashData[index-cashOutData.length-3].KCode}}</li>
                                <li>{{cashData[index-cashOutData.length-3].KName}}</li>
                                <li class="align-right">{{cashData[index-cashOutData.length-3].StartSum}}</li>
                                <li class="align-right">{{cashData[index-cashOutData.length-3].EndSum}}</li>
                            </template>
                        </ul>
                    </template>
                </template>
                <template v-else>
                    <template v-for="index in (cashOutData.length+cashData.length+6)">
                        <ul class="formDataItems flexPublic">
                            <template v-if="index<=cashInData.length">
                                <li>{{cashInData[index-1].KCode}}</li>
                                <li>{{cashInData[index-1].KName}}</li>
                                <li class="align-right">{{cashInData[index-1].StartSum | NumFormat}}</li>
                                <li class="align-right">{{cashInData[index-1].EndSum | NumFormat}}</li>
                            </template>
                            <template v-else>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </template>
                            <li></li>
                            <template v-if="index<=cashOutData.length">
                                <li>{{cashOutData[index-1].KCode}}</li>
                                <li>{{cashOutData[index-1].KName}}</li>
                                <li class="align-right">{{cashOutData[index-1].StratSum | NumFormat}}</li>
                                <li class="align-right">{{cashOutData[index-1].EndSum | NumFormat}}</li>
                            </template>
                            <template v-else-if="index==cashOutData.length+1">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </template>
                            <template v-else-if="index==cashOutData.length+2">
                                <li></li>
                                <li class="align-center bolder">负债合计</li>
                                <li class="align-right">{{cashOutCounts | NumFormat}}</li>
                                <li class="align-right">{{cashOutCountsQ | NumFormat}}</li>
                            </template>
                            <template v-else-if="index==cashOutData.length+3">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </template>
                            <template v-else-if="index==cashOutData.length+4">
                                <li></li>
                                <li class="align-center bolder">三、净资产类</li>
                                <li></li>
                                <li></li>
                            </template>
                            <template v-else-if="index <= cashOutData.length+cashData.length+4">
                                <li>{{cashData[index-cashOutData.length-5].KCode}}</li>
                                <li>{{cashData[index-cashOutData.length-5].KName}}</li>
                                <li class="align-right">{{cashData[index-cashOutData.length-5].StartSum | NumFormat}}</li>
                                <li class="align-right">{{cashData[index-cashOutData.length-5].EndSum | NumFormat}}</li>
                            </template>
                            <template  v-if="index == cashOutData.length+cashData.length+5">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </template>
                            <template v-if="index == cashOutData.length+cashData.length+6">
                                <li></li>
                                <li class="align-center bolder">净资产合计</li>
                                <li class="align-right">{{cashCounts | NumFormat}}</li>
                                <li class="align-right">{{cashCountsQ | NumFormat}}</li>
                            </template>
                        </ul>
                    </template>
                </template>
                <ul class="formDataItems flexPublic">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <ul class="formDataItems flexPublic">
                    <li></li>
                    <li class="align-center bolder">资产总计</li>
                    <li class="align-right">{{cashInCounts | NumFormat}}</li>
                    <li class="align-right">{{cashInCountsQ | NumFormat}}</li>
                    <li></li>
                    <li></li>
                    <li class="align-center bolder">负债与净资产总计</li>
                    <li class="align-right">{{cashOutCounts+cashCounts | NumFormat}}</li>
                    <li class="align-right">{{cashOutCountsQ+cashCountsQ | NumFormat}}</li>
                </ul>
                <!--<ul class="formDataItems flexPublic bottomForm">
                    <li>工会主席：</li>
                    <li></li>
                    <li>财务负责人：</li>
                    <li></li>
                    <li>复核：</li>
                    <li></li>
                    <li>制表：</li>
                    <li></li>
                </ul>-->
            </div>
        </div>
        <div class="timeSelectBox">
            <time-select-bar @item-click="dateChoose" :showtype="'singleTime'"></time-select-bar>
        </div>
    </div>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    //import { getLodop } from '@/plugins/Lodop/LodopFuncs';
    import TimeSelectBar from "../../components/TimeSelectBar/index";
    import { mapState, mapGetters } from "vuex";

    let balanceData=[];
    export default {
        name: "assets",
        data(){
            return{
                userState:0,
                downloadLoading: false,
                userStateValues:[{id:0,uname:'全部'},{id:1,uname:'启用'},{id:2,uname:'停用'},{id:3,uname:'临时停用'}],
                dataInfo:[
                    {PhId:1,PDate:'2018-01-01',Abstract:'test1', PNo:'0001',JSum:'1111',DSum:'1111',JD:'1',money:'2222'},
                    {PhId:1,PDate:'2018-02-01',Abstract:'test2', PNo:'0001',JSum:'333',DSum:'',JD:'2',money:'3333'},
                    {PhId:1,PDate:'2018-03-01',Abstract:'test3', PNo:'0001',JSum:'',DSum:'333',JD:'0',money:'4444'}
                ],

                cashInData:[         ],
                cashOutData:[         ],
                cashData:[         ],
                cashInCounts:0,
                cashOutCounts:0,
                cashCounts:0,
                cashInCountsQ:0,
                cashOutCountsQ:0,
                cashCountsQ:0,
                date1:'',
                proofType:'1',
                loading:false
            }
        },
        components: {TimeSelectBar},
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds
            }),
        },
        mounted(){
            this.getData(this.date1,this.proofType);
        },
        watch:{
            // /*
            // *监听日期选择，根据所选的日期以及凭证调用资产负债数据查询方法
            // * */
            // date1:function(){
            //     this.getData(this.date1,this.proofType);
            // },
            proofType:function(){
                this.getData(this.date1,this.proofType);
            }
        },
        methods:{
            dateChoose:function(val){
                let time=val.choosedYear+'-'+ val.choosedMonth;
                this.getData(time,this.proofType);
            },
            /*
             *时间处理方法
             *  */
            getParamTime(param){
                let nowtime ='';
                if(param==null||param==undefined||param==''){
                    nowtime = new Date();
                }else{
                    nowtime = new Date(param);
                }
                let year=nowtime.getFullYear();
                let month=nowtime.getMonth()+1;
                month<10?month='0'+month:month;
                let day=nowtime.getDate();
                day<10?day='0'+day:day;
                return param=year+'-'+month+'-'+day;
            },
            /*
            *author:hyz
            *获取资产负债表数据
            * 接口：PVoucherMst/GetBalanceSheet
            * 参数：param--日期，未选择自动使用当前时间
            * proofType--资产凭证类型，包含未审核凭证（0），不包含未审核凭证（1）
            * */
            getData(param,proofType){
                let that=this;
                this.loading=true;
                param = this.getParamTime(param);
                let data={
                    accountPeriod:param,
                    isContainUncheck:proofType,
                    orgid:this.orgid
                };
                this.$axios.get('/PVoucherMst/GetBalanceSheet',{params:data})
                    .then(res => {
                        that.loading=false;
                       let cashIn=[],cashOut=[],cash=[],cashInCount=0,cashInCountQ=0,cashOutCount=0,cashOutCountQ=0,cashCount=0,cashCountQ=0;
                       for(let i in res.Data){
                           if(res.Data[i].KType==="1"){
                               cashIn.push(res.Data[i]);
                           }else if(res.Data[i].KType==="2"){
                               cashOut.push(res.Data[i]);
                           }else{
                               cash.push(res.Data[i]);
                           }
                       }
                       for(let j in cashIn){
                           cashInCount+=cashIn[j].StartSum;
                           cashInCountQ+=cashIn[j].EndSum;
                       }
                       for(let k in cashOut){
                           cashOutCount+=cashOut[k].StartSum;
                           cashOutCountQ+=cashOut[k].EndSum;
                       }
                       for(let l in cash){
                           cashCount+=cash[l].StartSum;
                           cashCountQ+=cash[l].EndSum;
                        }
                       balanceData=res.Data;
                       this.cashInData=cashIn;
                       this.cashOutData=cashOut;
                       this.cashData=cash;
                       this.cashInCounts=cashInCount;
                       this.cashOutCounts=cashOutCount;
                       this.cashCounts=cashCount;
                        this.cashInCountsQ=cashInCountQ;
                        this.cashOutCountsQ=cashOutCountQ;
                        this.cashCountsQ=cashCountQ;
                    })
                    .catch(err => {that.loading=false;console.log(err)})
            },

            /*
            *author:hyz
            *导出资产负债表Excel表格
            * 接口：PVoucherMst/PostBalanceSheetExcel
            * 参数：Data--资产负债表数据的整个data
            * */
            postBalanceSheetExcel:function(){
                let param = {'infoData':this.balanceData};
                //let baseheader=httpConfig.getHeaderConfig();
                let base=httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true
				this.$axios({
                    method:'get',
                    url:'/PVoucherMst/GetBalanceSheetExcel',
                    params:{
                        accountPeriod:this.getParamTime(this.date1),
                        isContainUncheck:this.proofType,
                        orgid:this.orgid
                    }
                }) .then(res => {
                    window.location.href = base.baseURL+"/File/GetExportFile?filePath="+res.path+"&fileName="+res.filename;
                    this.downloadLoading = false
                }).catch(err => {
                    console.log(err)
                })

                //axios下载

				// this.$axios({
                //     method:'post',
                //     url:'/File/PostBalanceSheetExcelTo',
                //     data:param,
                //     responseType: 'blob'
                // }) .then(res => {
                //     let filename = "poiImport.xlsx";
                //     this.fileDownload(res.data, filename);
                // })
                // .catch(err => {
                //     console.log(err)
                // });


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
                // const me = this
                // var html=this.$refs.printFrom.innerHTML;
                // let  LODOP = getLodop();
                // LODOP.PRINT_INIT("资产负债表");      //首先一个初始化语句
                // LODOP.SET_PRINT_STYLE("FontSize", 18);  //字体
                // LODOP.SET_PRINT_STYLE("Bold", 1);
                // //LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
                // LODOP.ADD_PRINT_TEXT(50, 231, 260, 39, "资产负债表");
                // LODOP.ADD_PRINT_HTM(88, 200, 350, 600,html);
                // //LODOP.PRINT();
                // LODOP.PREVIEW();
            },
             // 打印
            printContent(e){
                this.$print(this.$refs.printFrom) // 使用
            }

        }
    }
</script>

<style scoped>
    .reportBox{
        margin-right: 60px;
    }
    .timeSelectBox{
        position: fixed;
        right: 0;
        top: 110px;
        bottom:0;
        width: 60px;
    }
    .pinzheng{
        margin-left: 120px;
    }
    .unionState>ul>li{
        width:100%;
    }
    .formData{
        margin-bottom: 50px;
    }
    .formData>ul>li{
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:10%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul>li:nth-of-type(5){
        width:10px;
    }
    .formData>ul>li:nth-of-type(2),
    .formData>ul>li:nth-of-type(7){
        width:20%;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #2780d1;
    }

    .formData>ul>li:first-child,
    .formData>ul>li:nth-of-type(6){
        width:9%;
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
    .formData>ul.formDataItems>li:nth-of-type(5){
        width:10px;
        padding:0
    }

    .unionLists{
        width:20%;
        align-self: flex-start;
        margin-right: 10px;
        margin-top: 10px;
    }
    .manageContent:before{
        content:"";
        display: inline-block;
    }
    .unionLists~.formData{
        width:80%;
        align-self: flex-start;
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
    .formData>ul.formDataItems>li{
        text-align: left;
        padding:0 15px;
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
    }
     .formData>ul.bottomForm>li{
         border:none;
         text-align: right;
         height:55px;
         line-height: 55px;
    }
    .formData>ul.bottomForm>li:last-child{
        border-right:1px solid #ddd;
    }
    .formData>ul.bottomForm>li:nth-of-type(2),
    .formData>ul.bottomForm>li:nth-of-type(4),
    .formData>ul.bottomForm>li:nth-of-type(6),
    .formData>ul.bottomForm>li:nth-of-type(8){
        width:15%;
        text-align: left;
    }



</style>
