<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent" v-loading="loading">
            <div class="reportBox">
                <div class="unionState" style="width: 100%;height: 40px">
                    <div style="width:100%;float: right">
                        <ul class="flexUl handle" :style="{'display': changeBtn.disable?'block':'none'}">
                            <a ><li style='margin:0 0 0px 20px;' :class="{'disableBtn':!verify}" @click="!verify?'':changeBtn.disable=false">编辑</li ></a>
                            <a><li style='margin:0 0 0px 20px;' :class="{'disableBtn':!verify||date1.choosedYear>jyear}" @click="showCountMsg=(verify&&date1.choosedYear<=jyear)">核定年末决算</li></a>

                            <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel" :loading="downloadLoading">导出</li ></a>
                            <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                            <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                        </ul>
                        <ul class="flexUl handle" :style="{'display': !changeBtn.disable?'block':'none'}">
                            <a ><li style='margin:0 0 0px 20px;' @click="changeBtn.disable=true">取消</li ></a>
                            <a><li style='margin:0 0 0px 20px;' @click="saveChange">保存</li></a>
                            <a><li style='margin:0 0 0px 20px;' :class="{'disableBtn':!verify||date1.choosedYear>jyear}" @click="showCountMsg=(verify&&date1.choosedYear<=jyear)">保存并核定</li></a>

                        </ul>
                    </div>

                </div>
                <!--<div class="unionState flexPublic">
                    <ul class="flexPublic">
                    </ul>
                    <ul class="flexPublic handle">
                        <a><li style='margin:0 0 0px 20px;' @click="changeBtnC">{{changeBtn.title}}</li ></a>
                        <a><li style='margin:0 0 0px 20px;' @click="showCountMsg=true">核定年末决算</li></a>

                        <a><li style='margin:0 0 0px 20px;' @click="postBalanceSheetExcel" :loading="downloadLoading">导出</li ></a>
                        <a><li style='margin:0 0 0px 20px;' @click="printContent">打印</li ></a>
                        <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                    </ul>
                </div>-->
                <div class="formData" id="form1">
                    <ul>
                        <li>科目编码</li>
                        <li>科目名称</li>
                        <li>核定预算数(元)</li>
                        <li>决算数(元)</li>
                        <li>完成预算(%)</li>
                        <li>说明</li>
                    </ul>
                    <div class="formData formData_content"  ref="printFrom">
                    <template v-for="(item,index) in budgetList">
                        <template v-if="item.SubjectCode=='BNSRHJ'">
                            <ul class="formDataItems flexPublic">
                                <li class=" bolder" style="width:30%;text-align: center;min-width: 270px">{{item.k_name}}</li>
                                <li style="display: none"></li>

                                <li class="align-right">{{item.ApprovedBudgetTotal | NumFormat}}</li>
                                <li class="align-right">
                                    {{item.ThisaccountsTotal | NumFormat}}
                                </li>
                                <li>
                                    <div class="progressContainer" >
                                        <div class="progress" :style="{background:dataInfo[index].zhixing<=0?'none':infoStyle[index],width:dataInfo[index].zhixing+'%'}">{{dataInfo[index].zhixing < 80 ?'':dataInfo[index].zhixing+' %'}}</div>
                                        <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<20?20:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=20?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                    </div>
                                </li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNZCHJ'">
                            <ul class="formDataItems flexPublic">
                                <li class=" bolder" style="width:30%;text-align: center;min-width: 270px">{{item.k_name}}</li>
                                <li style="display: none"></li>
                                <li class="align-right">{{item.ApprovedBudgetTotal | NumFormat}}</li>
                                <li class="align-right">
                                    {{item.ThisaccountsTotal | NumFormat}}
                                </li>
                                <li>
                                    <div class="progressContainer" >
                                        <div class="progress" :style="{background:dataInfo[index].zhixing<=0?'none':infoStyle[index],width:dataInfo[index].zhixing+'%'}">{{dataInfo[index].zhixing < 80 ?'':dataInfo[index].zhixing+' %'}}</div>
                                        <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<20?20:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=20?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                    </div>
                                </li>
                                <li>
                                    <input type="text" v-bind:disabled="changeBtn.disable" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNJY'">
                            <ul class="formDataItems flexPublic">
                                <li class="bolder">{{item.k_name}}</li>
                                <li></li>
                                <li class="align-right">{{item.ApprovedBudgetTotal | NumFormat}}</li>
                                <li class="align-right">{{item.ThisaccountsTotal | NumFormat}}</li>
                                <li></li>
                                <li>
                                    其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text"  v-bind:index="index" v-bind:value="item.Description" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='SNJY'">
                            <ul class="formDataItems flexPublic">
                                <li></li>
                                <li>{{item.k_name}}</li>
                                <li class="align-right">{{item.ApprovedBudgetTotal | NumFormat}}</li>
                                <li class="align-right">{{item.ThisaccountsTotal | NumFormat}}</li>
                                <li></li>
                                <li>
                                    其中：政府补助结余：<input v-bind:disabled="changeBtn.disable" class="other" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNSHTZ'">
                            <ul class="formDataItems flexPublic">
                                <li></li>
                                <li>{{item.k_name}}</li>
                                <li class="align-right">{{item.ApprovedBudgetTotal | NumFormat}}</li>
                                <li class="align-right">{{item.ThisaccountsTotal | NumFormat}}</li>
                                <li></li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNTZ'">
                            <ul class="formDataItems flexPublic">
                                <li></li>
                                <li>{{item.k_name}}</li>
                                <li class="align-right">{{item.ApprovedBudgetTotal | NumFormat}}</li>
                                <li class="align-right">{{item.ThisaccountsTotal | NumFormat}}</li>
                                <li></li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='BNTQHBJ'">
                            <ul class="formDataItems flexPublic">
                                <li></li>
                                <li>{{item.k_name}}</li>
                                <li class="align-right">{{item.ApprovedBudgetTotal | NumFormat}}</li>
                                <li class="align-right">{{item.ThisaccountsTotal | NumFormat}}</li>
                                <li></li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.SubjectCode=='QMGCJY'">
                            <ul class="formDataItems flexPublic">
                                <li class="bolder">{{item.k_name}}</li>
                                <li></li>
                                <li class="align-right">{{item.ApprovedBudgetTotal | NumFormat}}</li>
                                <li class="align-right">{{item.ThisaccountsTotal | NumFormat}}</li>
                                <li>
                                    <!--<div class="progressContainer" >
                                        <div class="progress" :style="{background:dataInfo[index].zhixing<=0?'none':infoStyle[index],width:dataInfo[index].zhixing+'%'}">{{dataInfo[index].zhixing < 80 ?'':dataInfo[index].zhixing+' %'}}</div>
                                        <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<20?20:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=20?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                    </div>-->
                                </li>
                                <li>
                                    其中：政府补助结余：<input  v-bind:disabled="changeBtn.disable"class="other" type="text" v-bind:value="item.Description"  v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>

                        <template v-else-if="item.k_name!='未找到该科目编码对应的科目'">
                            <ul class="formDataItems flexPublic">
                                <li v-bind:class="{'align-centers':item.Layers==1}">{{item.SubjectCode}}</li>
                                <li v-bind:class="{'align-center':item.Layers==1}">{{item.k_name}}</li>
                                <li class="align-right">{{item.BudgetTotal | NumFormat}}</li>
                                <li class="align-right">
                                    {{item.ThisaccountsTotal | NumFormat}}
                                </li>
                                <li>
                                    <div class="progressContainer" >
                                        <div class="progress" :style="{background:dataInfo[index].zhixing<=0?'none':infoStyle[index],width:dataInfo[index].zhixing+'%','color':'#fff'}">{{dataInfo[index].zhixing < 80 ?'':dataInfo[index].zhixing+' %'}}</div>
                                        <div  :style="{color:infoStyle[index],width:(100-dataInfo[index].zhixing)<20?20:100-dataInfo[index].zhixing+'%',display:(100-dataInfo[index].zhixing)<=20?'none':'block'}">{{dataInfo[index].zhixing}} %</div>
                                    </div>
                                </li>
                                <li>
                                    <input v-bind:disabled="changeBtn.disable" type="text" v-bind:value="item.Description" v-bind:index="index" v-on:input="inputDicription">
                                </li>
                            </ul>
                        </template>
                    </template>
                    </div>
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
                <div class="verifyPanel" :style="{display:!verify?'block':'none'}">
                    <div>已核定</div>
                    <div style="font-size: 14px">{{verifyTime.substring(0,10)}}</div>
                </div>
            </div>

            <div class="timeSelectBox">
                <time-select-bar @item-click="dateChoose" :showtype="'yearTime'"></time-select-bar>
            </div>
        </div>
        </div>
       <!--核定弹窗提示-->
        <div class="cover" :style="{'display':(showCountMsg?'block':'none')}">
            <div class="coverContent">
                <div class="flexPublic">
                    <p>提示</p>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right" @click="showCountMsg=false"></i>
                </div>
                <div>
                    <p>年末决算核定后不允许更改，确定核定？</p>
                </div>
                <ul class="flexPublic handle">
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="showCountMsg=false">取消</li>
                    <li style='margin:0 0 0px 20px;cursor: pointer' @click="hedin">确定</li>
                </ul>
            </div>
        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { mapState, mapGetters } from "vuex";
    //import { getLodop } from '@/plugins/Lodop/LodopFuncs'
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import saasMsg from '@/components/message/message'
    let balanceData=[];
    export default {
        name: "user",
        data(){
            return{
                showCountMsg:false,//核定显示
                downloadLoading: false,
                date1:[],
                currentyear:'',//当前年份
                dataInfo:[{zhixing:30}],
                infoStyle:[`#ff9900`],
                budgetList:[],
                changeBtn:{
                    flag:true,
                    title:'编辑',
                    disable:true,
                },
                loading:true,
                verifyTime:'',
                verify:true,//判断页面是否可以修改，true默认可修改，若为false不可修改
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                jyear:''
            }
        },
        components: {TimeSelectBar,saasMsg},
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds
            }),
        },
        mounted(){
            this.getEndYear();
            this.getChecked();
        },
        methods:{
            /*获取结账年*/
            getChecked(){
                var data={
                    uid:this.uid,
                    orgid:this.orgid,
                    queryfilter:{"OrgId*num*eq*1":this.orgid}
                }
                this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                    .then(res=>{
                        if(res.Record.length>0){
                            this.jyear=res.Record[0].JYear;
                        }else{
                            let currentYear = new Date();
                            this.jyear=currentYear.getFullYear();
                        }
                    })
                    .catch(err=>console.log(err))
            },
            /*
           *核定
           *
           * */
            hedin:function(){
                this.verifyEnd();
            },
            //时间选择器
            dateChoose:function(val){
                this.date1=val;
                this.getEndYear();
                this.changeBtn.title='编辑';
                this.changeBtn.disable=true;
            },
            /*
           * 监听编辑按钮事件
           * */
            changeBtnC:function(){
                if(this.verify){
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
                }else{
                    this.saasMessage={
                        message:'已经进行过年末决算核定，不可进行修改',
                        delay:3000,
                        visible:true
                    };
                    //this.$message({ showClose: true, message:'已经进行过年末决算核定，不可进行修改',type: 'error' })
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
                    infos[i].zhixing=infos[i].zhixing.toFixed(2);
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
                    'IsStart':1
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

                    //判断是否已经核算
                    if( res.Record[0].VerifyEnd==1){
                        this.verify=false;
                        this.verifyTime=res.Record[0].VerifyEnd_time;
                    }else{
                        this.verify=true;
                    }
                    for(var i in res.Record){
                        res.Record[i].OrgId=this.orgid;
                        res.Record[i].OrgCod=this.orgcode;
                        res.Record[i].Uyear=year;
                        if(res.Record[i].ApprovedBudgetTotal==0||res.Record[i].ApprovedBudgetTotal==''||res.Record[i].ApprovedBudgetTotal==null){
                            let anwser=0;
                            dataInfo.push({zhixing:anwser})
                        }else{
                            let anwser=res.Record[i].ThisaccountsTotal/res.Record[i].ApprovedBudgetTotal*100;
                            dataInfo.push({zhixing:anwser});
                        }
                    }
                    this.budgetList=res.Record;
                    this.dataInfo=dataInfo;
                    this.getInfoStyle();

                    //动态进度条
                   /*for(let j in this.dataInfo){

                       if(this.dataInfo[j].zhixing<=100){
                           this.timer(j,0,this.dataInfo[j].zhixing)
                       }

                    }*/
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
                    that.saasMessage={
                        message:res.Msg,
                        delay:3000,
                        visible:true
                    };
                    //that.$message({ showClose: true, message:res.Msg,type: 'success' });
                    that.changeBtn.disable=true;
                    that.getEndYear();
                }).catch(function(err){
                    that.loading=false;
                    that.saasMessage={
                        message:'保存异常，请刷新页面后重试',
                        delay:3000,
                        visible:true
                    };
                    //that.$message({showClose:true, message:'保存异常，请刷新页面后重试'});
                    that.changeBtn.disable=true
                    console.log(err);
                })

            },

            timer(index,str,data){
                let that=this;
                setTimeout(function(){
                    if(str<data){
                        let i=data/50;
                        if(str+i<data){
                            str+=i;
                        }else{
                            str=data;
                        }
                        that.dataInfo[index].zhixing=str.toFixed(2);
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
                },30)
            },
            /*
            * 核定
            * */
            verifyEnd:function(){
                if(this.verify){
                    let that=this;
                    let time=this.timeFor(new Date());
                    this.loading=true;
                    for(let i in this.budgetList){
                        this.budgetList[i].VerifyEnd=1;
                        this.budgetList[i].VerifyEnd_time=time;
                    }
                    this.$axios.post(
                        'PSubjectBudget/PostSave',
                        {
                            "uid": this.userid,
                            "orgid": this.orgid,
                            "infodata": this.budgetList
                        }
                    ).then(function(res){
                        that.loading=false;
                        that.saasMessage={
                            message:'年末决算核定成功',
                            delay:3000,
                            visible:true
                        };
                        //that.$message({ showClose: true, message:'年末决算核定成功',type: 'success' });
                        that.getEndYear();
                        that.changeBtn.disable=true
                        that.verify=false;
                        that.showCountMsg=false;
                    }).catch(function(err){
                        that.loading=false;
                        that.changeBtn.disable=true
                        console.log(err);
                    })
                }else{
                    this.saasMessage={
                        message:'已经核定年末决算',
                        delay:3000,
                        visible:true
                    };
                    //this.$message({ showClose: true, message:'已经核定年末决算',type: 'error' })
                }
            },


            postBalanceSheetExcel:function() {
                let param = {'uid':this.uid,
                    'orgid':this.orgid,
                    'infoData': this.budgetList};

                //let baseheader = ajaxhttp.header;
                let base = httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true
                this.$axios({
                    method: 'post',
                    url: '/PsubjectBudget/PostExportEndYear',
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

                // this.$print(this.$refs.printFrom) // 使用
                let dm = this.$refs.printFrom.parentNode.firstChild.cloneNode(true);
                dm.classList.add('first_child');
                let cop = this.$refs.printFrom.cloneNode(true);
                cop.insertBefore(dm,cop.firstChild);
                cop.classList.remove('formData_content');
                //获取打印内容的子节点 ;
                let childList=cop.childNodes;

                let len=15;
                let level=Math.ceil(childList.length/len);
                for(var i=1; i<level ; i++){
                    childList[i*len].setAttribute('style','page-break-after:always');
                    childList[i*len+1].setAttribute('style','border-top:1px solid #ebeef5;margin-top:20px');
                }

                this.$print(cop) // 使用
            },
            //刷新
            refresh:function(){
                this.getEndYear();
            },
            /*
            * 当前时间格式化
            *
            * */
            timeFor:function(ti){
                let time=new Date(ti);
                let year = time.getFullYear(),
                    month = time.getMonth()+1<10?'0'+(time.getMonth()+1):time.getMonth()+1,
                    day = time.getDate()<10?"0"+time.getDate():time.getDate() ,
                    hours=time.getHours()<10?"0"+time.getHours():time.getHours(),
                    minutes=time.getMinutes()<10?"0"+time.getMinutes():time.getMinutes(),
                    second=time.getSeconds()<10?"0"+time.getSeconds():time.getSeconds();

                return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+second
            }
        }
    }
</script>

<style scoped>
    .flexUl{
        float: right;
    }
    .flexUl>a>li{
        display: inline-block;
        float: left;
        vertical-align: top;
    }
    .selectContainer>select {
        background-color: transparent;
        line-height: 30px;
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
    .formData_content{
        position: absolute;
        overflow-y: scroll;
        bottom: -50px;
        top: 90px;
        left: 0;
        right: -17px;
    }
    .formData_content>ul:first-child{
        background: white;
        margin-top: 0;
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
        border-right:1px solid #d3e9f9;
    }

    .formData>ul>li:first-child{
        width:11%;
        min-width: 70px;
        padding:0 2px;
    }
    .formData>ul>li:nth-of-type(2){
        width:19%;
        min-width: 200px;
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
    .formData>ul.formDataItems>li.align-center{
        text-indent: 30px;
    }
    .formData>ul.formDataItems>li.align-right{
        text-align: right;
    }
    .formData>ul.formDataItems>li:last-child >input{
        text-align: left;
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
        overflow: hidden;
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

    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(66,66,66,0.45);
        z-index: 99;
        text-align: center;
    }
    .coverContent{
        background-color: #fff;
        width: 362px;
        height: 195px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -87.5px -181px;
        box-shadow: 0 0 5px 1px #d3e9f9;
    }
    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid #eee;
        padding:10px 20px;

    }
    .coverContent div:nth-of-type(2){
        padding: 30px 20px;
    }
    .coverContent ul{
        padding: 30px 50px;
    }
    .coverContent ul li:nth-of-type(1){
        border: 1px solid #ccc;
        color: #fff;
        background-color: #ccc;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(1):hover{
        color: #ccc;
        background-color: #fff;
    }
    .coverContent ul li:nth-of-type(2){
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(2):hover{
        color: #00B8EE;
        background: #fff;
    }

    .disableBtn{
        color: #cccccc !important;
        background: #fff !important;
        border-color: #ccc !important;
        cursor: not-allowed !important;
    }
</style>

