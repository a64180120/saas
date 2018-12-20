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
                    <a><li style='margin:0 0 0px 20px;' @click="changeBtnC">{{changeBtn.title}}</li ></a>
                    <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                    <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel" :loading="downloadLoading">导出</li ></a>
                </ul>
            </div>
            <div class="formData" id="form1" ref="printFrom">
                <ul>
                    <li>编号</li>
                    <li>名称</li>
                    <li>核定预算数</li>
                    <li>决算数</li>
                    <li>完成预算</li>
                    <li>说明</li>
                </ul>
                <template v-for="(item,index) in budgetList">
                    <template v-if="item.SubjectCode=='BNSRHJ'">
                        <ul class="formDataItems flexPublic">
                            <li></li>
                            <li class="align-center bolder">{{item.k_name}}</li>
                            <li>{{item.ApprovedBudgetTotal | NumFormat}}</li>
                            <li>
                                {{item.ThisaccountsTotal | NumFormat}}
                            </li>
                            <li>
                                <div class="progressContainer" >
                                    <div class="progress" :style="{background:infoStyle[index],width:dataInfo[index].zhixing+'%'}">{{dataInfo[index].zhixing < 80 ?'':dataInfo[index].zhixing+' %'}}</div>
                                    <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<20?20:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=20?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                </div>
                            </li>
                            <li>
                                <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                            </li>
                        </ul>
                        <ul class="formDataItems flexPublic">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </template>

                    <template v-else-if="item.SubjectCode=='BNZCHJ'">
                        <ul class="formDataItems flexPublic">
                            <li></li>
                            <li class="align-center bolder">{{item.k_name}}</li>
                            <li>{{item.ApprovedBudgetTotal | NumFormat}}</li>
                            <li>
                                {{item.ThisaccountsTotal | NumFormat}}
                            </li>
                            <li>
                                <div class="progressContainer" >
                                    <div class="progress" :style="{background:infoStyle[index],width:dataInfo[index].zhixing+'%'}">{{dataInfo[index].zhixing < 80 ?'':dataInfo[index].zhixing+' %'}}</div>
                                    <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<20?20:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=20?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                </div>
                            </li>
                            <li>
                                <input type="text" v-bind:disabled="changeBtn.disable" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                            </li>
                        </ul>
                    </template>

                    <template v-else-if="item.SubjectCode=='BNJY'">
                        <ul class="formDataItems flexPublic">
                            <li></li>
                            <li class="bolder">{{item.k_name}}</li>
                            <li>{{item.ApprovedBudgetTotal | NumFormat}}</li>
                            <li>{{item.ThisaccountsTotal | NumFormat}}</li>
                            <li></li>
                            <li>
                                其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text"  v-bind:index="index" v-bind:placeholder="item.Description" v-on:input="inputDicription">
                            </li>
                        </ul>
                    </template>

                    <template v-else-if="item.SubjectCode=='SNJY'">
                        <ul class="formDataItems flexPublic">
                            <li></li>
                            <li class="bolder">{{item.k_name}}</li>
                            <li>{{item.ApprovedBudgetTotal | NumFormat}}</li>
                            <li>{{item.ThisaccountsTotal | NumFormat}}</li>
                            <li></li>
                            <li>
                                其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                            </li>
                        </ul>
                    </template>

                    <template v-else-if="item.SubjectCode=='BNSHTZ'">
                        <ul class="formDataItems flexPublic">
                            <li></li>
                            <li class="bolder">{{item.k_name}}</li>
                            <li>{{item.ApprovedBudgetTotal | NumFormat}}</li>
                            <li>{{item.ThisaccountsTotal | NumFormat}}</li>
                            <li></li>
                            <li>
                                <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                            </li>
                        </ul>
                    </template>

                    <template v-else-if="item.SubjectCode=='BNTZ'">
                        <ul class="formDataItems flexPublic">
                            <li></li>
                            <li class="bolder">{{item.k_name}}</li>
                            <li>{{item.ApprovedBudgetTotal | NumFormat}}</li>
                            <li>{{item.ThisaccountsTotal | NumFormat}}</li>
                            <li></li>
                            <li>
                                <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                            </li>
                        </ul>
                    </template>

                    <template v-else-if="item.SubjectCode=='BNTQHBJ'">
                        <ul class="formDataItems flexPublic">
                            <li></li>
                            <li class="bolder">{{item.k_name}}</li>
                            <li>{{item.ApprovedBudgetTotal | NumFormat}}</li>
                            <li>{{item.ThisaccountsTotal | NumFormat}}</li>
                            <li></li>
                            <li>
                                <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                            </li>
                        </ul>
                    </template>

                    <template v-else-if="item.SubjectCode=='QMGCJY'">
                        <ul class="formDataItems flexPublic">
                            <li></li>
                            <li class="bolder">{{item.k_name}}</li>
                            <li>{{item.ApprovedBudgetTotal | NumFormat}}</li>
                            <li>{{item.ThisaccountsTotal | NumFormat}}</li>
                            <li>
                                <div class="progressContainer" >
                                    <div class="progress" :style="{background:infoStyle[index],width:dataInfo[index].zhixing+'%'}">{{dataInfo[index].zhixing < 80 ?'':dataInfo[index].zhixing+' %'}}</div>
                                    <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<20?20:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=20?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                </div>
                            </li>
                            <li>
                                其中：政府补助结余：<input  v-bind:disabled="changeBtn.disable"class="other" type="text" v-bind:placeholder="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                            </li>
                        </ul>
                    </template>

                    <template v-else-if="item.k_name!='未找到该科目编码对应的科目'">
                        <ul class="formDataItems flexPublic">
                            <li v-bind:class="{'align-center':item.Layers==1}">{{item.SubjectCode}}</li>
                            <li v-bind:class="{'align-center':item.Layers==1}">{{item.k_name}}</li>
                            <li>{{item.BudgetTotal | NumFormat}}</li>
                            <li>
                                {{item.ThisaccountsTotal | NumFormat}}
                            </li>
                            <li>
                                <div class="progressContainer" >
                                    <div class="progress" :style="{background:infoStyle[index],width:dataInfo[index].zhixing+'%'}">{{dataInfo[index].zhixing < 80 ?'':dataInfo[index].zhixing+' %'}}</div>
                                    <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<20?20:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=20?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                </div>
                            </li>
                            <li>
                                <input v-bind:disabled="changeBtn.disable" type="text" v-bind:placeholder="item.Description" v-bind:index="index" v-on:input="inputDicription">
                            </li>
                        </ul>
                    </template>
                </template>
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
            <time-select-bar @item-click="dateChoose" :showtype="'yearTime'"></time-select-bar>
        </div>
    </div>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { mapState, mapGetters } from "vuex";
    //import { getLodop } from '@/plugins/Lodop/LodopFuncs'
    import TimeSelectBar from "../../components/TimeSelectBar/index";

    let balanceData=[];
    export default {
        name: "user",
        data(){
            return{
                date1:[],
                proofType:'0',
                dataInfo:[{zhixing:30}],
                infoStyle:[`#ff9900`],
                budgetList:[],
                changeBtn:{
                    flag:true,
                    title:'编辑',
                    disable:true,
                },
                loading:true
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
            this.getEndYear();
        },
        methods:{
            dateChoose:function(val){
                this.date1=val;
                this.getEndYear();
            },
            /*
           * 监听编辑按钮事件
           * */
            changeBtnC:function(){
                if(this.changeBtn.flag){
                    if(this.changeBtn.disable){
                        this.changeBtn.title='保存';
                        this.changeBtn.disable=false;
                    }else{
                        this.saveChange();
                        this.changeBtn.title='编辑';
                        this.changeBtn.disable=true;
                    }
                }
            },
            /*
           * 监听说明的input输入
           * */
            inputDicription:function(val){
                let index=val.target.attributes.index.value;//当前修改数据在列表中的下标
                let in_value = val.target.value;//input数据转数字
                this.budgetList[index].Description=in_value;
            },
            getInfoStyle(){
                var infos=this.dataInfo;
                var val=[];
                for(var i in infos){
                    infos[i].zhixing=parseInt(infos[i].zhixing);
                    val[i]=infos[i].zhixing;
                    if(val[i]<30){
                        val[i]=`#ff0000`;
                    }else if(val[i]>=30&&val[i]<50){
                        val[i]=`#ff9900`;
                    }else if(val[i]>=50&&val[i]<80){
                        val[i]=`#2473eb`;
                    }else{
                        val[i]=`#83c350`;
                    }
                }
                this.infoStyle=val;
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
            getEndYear:function(){
                let year='';
                if(this.date1.choosedYear==undefined){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    this.date1.choosedMonthEnd=currentMonth;
                    year=currentyear;
                }else{
                    year=this.date1.choosedYear
                }
                let data={
                    "uid": this.userid,
                    "orgid":this.orgid,
                    "Year":  year,
                    "OrgIds": this.orgid,
                };
                this.loading=true;
                let that=this;
                this.$axios.get(
                    // 'PSubjectBudget/GetBeginYear',
                    'PSubjectBudget/GetEndYear',
                    {params:data}
                ).then(res=>{
                    that.loading=false;
                    let dataInfo=[];
                    for(var i in res.Record){
                        res.Record[i].OrgId=this.orgid;
                        res.Record[i].OrgCod=this.orgcode;
                        res.Record[i].Uyear=year;
                        if(res.Record[i].ApprovedBudgetTotal==0||res.Record[i].ApprovedBudgetTotal==''||res.Record[i].ApprovedBudgetTotal==null){
                            let anwser=0;
                            dataInfo.push({zhixing:anwser})
                        }else{
                            let anwser=parseFloat(res.Record[i].ThisaccountsTotal)/parseFloat(res.Record[i].ApprovedBudgetTotal)*100;
                            dataInfo.push({zhixing:anwser});

                        }
                    }
                    this.budgetList=res.Record;
                    this.dataInfo=dataInfo;
                    this.getInfoStyle();
                    for(let j in this.dataInfo){
                        this.timer(j,0,this.dataInfo[j].zhixing)
                    }
                }).catch(res=>{
                    console.log(res);
                })
            },
            /*
            * 修改保存
            * */
            saveChange:function(){
                this.loading=true;
                let that=this;
                this.$axios.post(
                    'PSubjectBudget/PostSave',
                    {
                        "uid": this.userid,
                        "orgid": this.orgid,
                        "infodata": this.budgetList
                    }
                ).then(function(res){
                    that.loading=false;
                    that.$message({ showClose: true, message:res.Msg,type: 'success' })
                }).catch(function(err){
                    that.loading=false;
                    console.log(err);
                })

            },
            timer(index,str,data){
                let that=this;
                setTimeout(function(){
                    if(str<data){
                        str++;
                        that.dataInfo[index].zhixing=str;
                        if(str<30){
                            that.infoStyle[index]=`#ff0000`;
                        }else if(str>=30&&str<50){
                            that.infoStyle[index]=`#ff9900`;
                        }else if(str>=50&&str<80){
                            that.infoStyle[index]=`#2473eb`;
                        }else{
                            that.infoStyle[index]=`#83c350`;
                        }
                        that.timer(index,str,data);
                    }
                },35)
            },
            postBalanceSheetExcel:function() {
                let param = {'uid':this.uid,
                    'orgid':this.orgid,
                    'infoData': this.budgetList};

                //let baseheader = ajaxhttp.header;
                let base = ajaxhttp.getAxiosBaseConfig();

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
        border-right:1px solid #ebeef5;;
        height:50px;
        line-height:50px;
        text-align: center;
        width:15%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .formData>ul:first-child>li:last-of-type{
        border-right:1px solid #2780d1;
    }

    .formData>ul>li:first-child{
        width:10%;
        min-width: 70px;
        padding:0 2px;
    }
    .formData>ul>li:nth-of-type(2){
        width:20%;
        min-width: 210px;
        padding:0 2px;
    }
    .formData>ul>li:last-child{
        width:25%;
        min-width: 210px;
        padding:0 2px;
    }

    .formDataItems{
        border-bottom:1px solid #ebeef5;
        background: white;
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
    .formData>ul.formDataItems>li.bolder{
        font-weight: bold;
    }

    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ddd;
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
    .formData>ul.formDataItems>li.align-center{
        padding:0;
        text-indent: 40px;
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
    .progressContainer{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        height:15px;
        width:100%;
        border:1px solid #ddd;
        border-radius: 15px;
        background: #ebeef5;
        margin-top:13px;
    }
    .progressContainer>div{
        text-align: left;
        padding-left:3px;
    }
    .progressContainer>div.progress{
        border-radius: 15px;
        height:100%;
        text-align: center;
        line-height: 15px;
    }
    input{
        border: none;
        line-height: 40px;
        height: 40px;
        width: 100%;
        text-align: right;
    }
    input.other{
        width:45%;
    }
</style>

