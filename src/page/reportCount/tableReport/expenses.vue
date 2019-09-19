<template>
    <div class="timeSelect">
        <div class="container">
            <div class="manageContent" v-loading="loading">
            <div class="reportBox">
            <div class="">
                <ul class="flexUl" style="float: left">
                    <div  style="display: inline-block;width: 100px;vertical-align: bottom; text-align: center;">
                        <el-select placeholder="剔除条件" value="剔除条件" style="width: 100px;">
                            <el-option value="0">
                                <el-checkbox v-model="showBqList.allZero"  @change="dispart('allZero')">剔除本月数及本年累计数均为0</el-checkbox>
                            </el-option>
                            <el-option value="1">
                                <el-checkbox v-model="showBqList.benyueZero"  @change="dispart('benyueZero')" >剔除本月数为0，且本年累计数不为0</el-checkbox>
                            </el-option>
                            <el-option value="2">
                                <el-checkbox v-model="showBqList.bennianZero"  @change="dispart('bennianZero')" >剔除本年累计数为0，且本月数不为0</el-checkbox>
                            </el-option>
                            <el-option value="3">
                                <el-checkbox v-model="proofType">剔除未审核凭证</el-checkbox>
                            </el-option>
                        </el-select>
                       <!-- <select class="el-input__inner el-button&#45;&#45;small" v-model="proofType">
                            <option value="1">包含未审核凭证</option>
                            <option value="0">不包含未审核凭证</option>
                        </select>-->

                    </div>
                    <div style="margin-left: 20px;vertical-align: bottom; display: inline-block;width: 100px;text-align: center;">
                        <el-select value="剔除条件" style="width: 100px;" v-model="carryOver">
                            <el-option value="0" label="结转前">结转前</el-option>
                            <el-option value="1" label="结转后">结转后</el-option>
                        </el-select>
                    </div>
                </ul>
                <ul class="flexUl">
                    <li  v-if="Roleauthorize.incomeExpenses_export!=0" @click="postBalanceSheetExcel">导出</li>
                    <li  v-if="Roleauthorize.incomeExpenses_print!=0" @click="showPrintArea">打印</li >

                    <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                </ul>
            </div>
                <div class="formData" >
                    <div class="tbHeader">
                        <table>
                            <colgroup>
                                <col width="10%"/>
                                <col width="20%"/>
                                <col width="35%"/>
                                <col width="35%"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <td>科目编码</td>
                                <td>科目名称</td>
                                <td>本月数(元)</td>
                                <td>本年累计数(元)</td>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <div class="tbBody ">
                        <table  ref="printFrom">
                            <colgroup>
                                <col width="10%"/>
                                <col width="20%"/>
                                <col width="35%"/>
                                <col width="35%"/>
                            </colgroup>
                            <tbody >
                            <template v-for="item in inMoney">
                                <tr>
                                    <td  :class="{bolder:item.flag,center:(item.KCode=='三、本期结余')}" :style="{'text-indent':(item.KCode=='三、本期结余'?'0px':'20px')}">{{item.KCode}}</td>
                                    <td :class="{bolder:item.flag,'center':item.flag}"  style="text-indent: 30px">{{item.KName}}</td>
                                    <td class="right">
                                        <template v-if="item.KCode=='一、收入'||item.KCode=='二、支出'"></template>
                                        <template v-else>
                                            {{item.StartSum | NumFormat}}
                                        </template>
                                    </td>
                                    <td class="right">
                                        <template v-if="item.KCode=='一、收入'||item.KCode=='二、支出'"></template>
                                        <template v-else>
                                            {{item.EndSum | NumFormat}}
                                        </template>
                                    </td>
                                </tr>
                                <template v-if="item.children.length>0">
                                    <tr v-for="n in item.children">
                                        <td :class="{bolder:item.flag}" style="text-indent: 35px">{{n.KCode}}</td>
                                        <td :class="{bolder:item.flag,'center':item.flag,'left':item.flag}"  style="text-indent: 30px">{{n.KName}}</td>
                                        <td class="right">{{n.StartSum | NumFormat}}</td>
                                        <td class="right">{{n.EndSum | NumFormat}}</td>
                                    </tr>
                                </template>
                            </template>
                            </tbody>
                        </table>
                    </div>
                    <!--表头和表尾隐藏-->
                    <table style="display: none">
                        <colgroup>
                            <col width="10%"/>
                            <col width="20%"/>
                            <col width="35%"/>
                            <col width="35%"/>
                        </colgroup>
                        <div id="theadArea">
                            <tr>
                                <td colspan="4" style="background-color: #fff;font-weight: bolder;font-size: 20px;border: 0;height: 30px">收入支出表</td>
                            </tr>
                            <tr>
                                <td colspan="2" class="left" style="background-color: #fff;border: 0;">编制单位：{{orgName}}</td>
                                <td colspan="1" class="center" style="background-color: #fff;border: 0;">
                                    {{date1.choosedYear}}年
                                    {{date1.choosedMonth<10?'0'+date1.choosedMonth:date1.choosedMonth}}月
                                    {{ (((date1.choosedYear)%4==0&&(date1.choosedYear%100)!=0)||((date1.choosedYear)%400==0))?monthDayR[this.date1.choosedMonth-1]:monthDay[this.date1.choosedMonth-1]}}日
                                    {{ date1.choosedYear < jyear ?'':((date1.choosedYear==jyear && date1.choosedMonth <= jmonth)?'':'(未结账)') }}
                                </td>
                                <td colspan="1" class="right" style="background-color: #fff;border: 0;">单位：元</td>
                            </tr>
                        </div>

                        <div id="tbodyArea">
                            <tr>
                                <td >注：</td>
                                <td colspan="3">
                                    <span style="width: 50%;display: inline-block;float: left">
                                        <input disabled type="checkbox" :checked="proofType" > 剔除未审核凭证
                                    </span>
                                   <span style="width: 50%;display: inline-block">
                                       <input disabled type="checkbox" :checked="showBqList.allZero" > 剔除本月数及本年累计数均为0
                                   </span>
                                </td>
                            </tr>
                            <tr>
                                <td ></td>
                                <td colspan="3">
                                    <span  style="width: 50%;display: inline-block;float: left">
                                        <input disabled type="checkbox" :checked="showBqList.benyueZero" > 剔除本月数为0，且本年累计数不为0
                                    </span>
                                    <span style="width: 50%">
                                        <input disabled type="checkbox" :checked="showBqList.bennianZero" > 剔除本年累计数为0，且本月数不为0
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td ></td>
                                <td colspan="3">
                                    <span  style="width: 50%;display: inline-block;float: left">
                                        <input disabled type="checkbox" :checked="carryOver==0" > 结转前
                                    </span>
                                    <span style="width: 50%">
                                        <input disabled type="checkbox" :checked="carryOver==1" > 结转后
                                    </span>
                                </td>
                            </tr>

                            <tr>
                                <td colspan="4" style="border: 0;">
                                    <span  style="width: 25%;display: inline-block;float: left">
                                        工会主席：{{curOrg.Chairman}}
                                    </span>
                                    <span style="width: 25%;display: inline-block">
                                        审核：
                                    </span>
                                    <span style="width: 25%;display: inline-block">
                                        复核：
                                    </span>
                                    <span style="width: 25%">
                                        制表：{{username}}
                                    </span>

                                </td>
                            </tr>
                        </div>

                    </table>
                </div>
            </div>
            <div class="timeSelectBox">
                <time-select-bar @item-click="dateChoose" :showtype="'singleTime'"></time-select-bar>
            </div>
        </div>
       </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>

        <!--打印预览界面-->
        <div id="covCon" class="cover" :style="{'display':(showPrint?'block':'none'),'z-index':'999'}">
            <div class="coverContent" style="width: auto;height: auto;top: 30px;left:40px;right: 40px;margin-top: 0;margin-left:0;">
                <div id="covTil" class="" style="text-align: left">
                    <span>打印预览界面</span>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right;float: right;padding-top: 4px;margin-left: 50px;" @click="closePrintArea"></i>
                    <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right' @click="printContent">打印</a>
                    <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right;color: #333333' @click="closePrintArea">取消</a>
                </div>
                <div id="printContentArea" style="margin-bottom: 20px">

                </div>
                <ul class=" handle" style="margin-bottom: 20px;margin-top: 20px">
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 收入支出表
     */
    import { IncomList,IncomListToExcel } from '@/api/voucher/reportInfo'
    import { mapState, mapActions } from 'vuex'
    import treeTable from "@/components/tree-table/indexHeight";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    //import treeTable from "@/components/tree-table";
    import treeSum from '../../report/totalAmount'
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    import saasMsg from '@/components/message/message'
    export default {
        name: "expensesRe",
        data(){
            return{
                extraheight:300,
                downloadLoading:false,
                loading: false,
                expandAll: true,
                zwTime:'',
                columns: [
                    {
                        text: "科目编码",
                        value: "KCode",
                        width: '10%',
                        'text-indent': '40px'
                    },
                    {
                        text: "名称",
                        value: "KName",
                        width: '10%',
                        align:'center'
                    },
                    {
                        text: "本月数(元)",
                        value: "StartSum",
                        width: '10%',
                        align:'right'
                    },
                    {
                        text: "本年累计数(元)",
                        value: "EndSum",
                        width: '10%',
                        align:'right'
                    }
                ],
                //收入
                inMoney:[],
                userState:0,
                userStateValues:[{id:0,uname:'全部'},{id:1,uname:'启用'},{id:2,uname:'停用'},{id:3,uname:'临时停用'}],
                proofType:false,
                showBqList:{
                    allZero:false,
                    benyueZero:false,
                    bennianZero:false,
                },
                showType:0,
                carryOver:'1',
                date1:[],
                loading:false,
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                showPrint:false,//打印预览界面 显示隐藏
                monthDay:[31,28,31,30,31,30,31,31,30,31,30,31],//月份天数-非闰年
                monthDayR:[31,29,31,30,31,30,31,31,30,31,30,31],//月份天数-闰年  year%4=0&&year%100!=0
                jyear:0,
                jmonth:0
            }
        },
        components: { treeTable,TimeSelectBar,saasMsg },
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                orgName:state=>state.user.orgName,
                uid:state=>state.user.userid,
                user:state=>state.user,
                curOrg: state => state.user.curOrg,   //当前的组织信息
                username: state => state.user.username,
                Roleauthorize: state => state.user.Roleauthorize,
            })
        },
        created(){

        },
        mounted(){
            this.getCheckeds();
            window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件},
        },
        destroyed(){
            window.removeEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        watch:{

            // /*
            // *监听日期选择，根据所选的日期以及凭证调用资产负债数据查询方法
            // * */
            // date1:function(){
            //     this.getData(this.date1,this.proofType);
            // },
            proofType:function(){
                this.getData();
            },
            carryOver:function(){
                this.getData();
            }
        },
        methods:{
            //滚动事件
            handleScroll: function () {
                let scObj = document.getElementById('covCon');//打印区域滚动
                if(scObj==undefined){
                    window.removeEventListener('scroll', this.handleScroll, false);  // 监听（绑定）滚轮滚动事件
                }else{
                    if(scObj.scrollTop>35){
                        document.getElementById('covTil').classList.add('fixTitle');
                    }else{
                        document.getElementById('covTil').classList.remove('fixTitle');
                    }
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

            dateChoose:function(val){
                console.log(val);
                this.date1=val;
                this.getData()
            },
            getData:function(){
                let param=this.date1.choosedYear+'-'+this.date1.choosedMonth;
                let loading=this.$loading();
                //收入科目的数据
                var data = {
                    accountPeriod: param, //账期
                    isContainUncheck: this.proofType?'1':'0',      //是否包含未审核的凭证(1=包含，0=不包含)
                    orgid:this.orgid,
                    carryOver:this.carryOver,
                    uid:this.uid,
                    query:this.showType
                };
                var vm=this;
                IncomList(vm,data).then(res => {
                    loading.close()
                    if(res.Status==='error'){
                        this.saasMessage={
                            message:res.Msg,
                            delay:3000,
                            visible:true
                        };
                        //this.$message.error(res.Msg);
                        return
                    }
                    var data=res.Data;
                    var indata=data.filter((value,key,arr) => {
                        //1-资产,2-负债,3-净资产,4-收入,5-支出
                        return value.KType==="4"
                    })
                    var indata_StartSum=Number(0);
                    var indata_EndSum=Number(0);
                    treeSum(indata).forEach(item =>{
                        indata_StartSum +=item.StartSum;
                        indata_EndSum +=item.EndSum
                    })
                    var outdata=data.filter((value,key,arr) => {
                        //1-资产,2-负债,3-净资产,4-收入,5-支出
                        return value.KType==="5"
                    })

                    var outdata_StartSum=Number(0);
                    var outdata_EndSum=Number(0);
                    //var listArry2=treeSum(outdata);
                    treeSum(outdata).forEach(item =>{
                        outdata_StartSum +=item.StartSum;
                        outdata_EndSum +=item.EndSum
                    })

                    var newdata=new Array();
                   /* indata=this.changeData(indata);
                    outdata=this.changeData(outdata);*/


                    this.inMoney=newdata.concat([{
                        KCode:'一、收入',
                        KName:'',
                        StartSum:'',
                        EndSum:'',
                        children:{},
                        flag:true
                    }],indata,[{
                        KCode:'',
                        KName:'本期收入合计',
                        StartSum:indata_StartSum,
                        EndSum:indata_EndSum,
                        children:{},
                        flag:true
                    }],[{
                        KCode:'二、支出',
                        KName:'',
                        StartSum:'',
                        EndSum:'',
                        children:{},
                        flag:true
                    }],outdata,[{
                        KCode:'',
                        KName:'本期支出合计',
                        StartSum:outdata_StartSum,
                        EndSum:outdata_EndSum,
                        children:{},
                        flag:true
                    }],[{
                        KCode:'三、本期结余',
                        KName:'',
                        StartSum:indata_StartSum-outdata_StartSum,
                        EndSum:indata_EndSum-outdata_EndSum,
                        children:{},
                        flag:true
                    }])
                }).catch(error =>{
                    console.log(error);
                    loading.close();
                    this.saasMessage={
                        message:'收入科目获取错误',
                        delay:3000,
                        visible:true
                    };
                })

            },

            download(){

                //var data=this.inMoney
                // let param = {'infoData':this.inMoney};

                // this.$axios({
                //     method:'post',
                //     url:'/PVoucherMst/PostIncomAndExpenditureExcel',
                //     data:param,
                //     responseType:'blob'
                // }) .then(res => {
                //     console.log(res);
                // }).catch(err => {
                //     console.log(err)
                // })

                this.downloadLoading = true
                import('@/plugins/Excel/Export2Excel').then(excel => {
                    const tHeader = ['科目编码', '名称', '本月数', '本年累计数']
                    const filterVal = ['KCode', 'KName', 'StartSum', 'EndSum']
                    const list = treeSum(this.inMoney)
                    const data = this.formatJson(filterVal, list)
                    excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: this.filename,
                    autoWidth: true
                    })
                    this.downloadLoading = false
                })

            },
            //时间格式转换
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },
            // 下载文件
            downloadFile (data) {
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

            postBalanceSheetExcel:function(){
                let loading=this.$loading();
                let base=httpConfig.getAxiosBaseConfigUncontrol();
                let param=this.date1.choosedYear+'-'+this.date1.choosedMonth;
                //收入科目的数据
                let data = {
                    accountPeriod: param, //账期
                    isContainUncheck: this.proofType?'1':'0',      //是否包含未审核的凭证(1=包含，0=不包含)
                    orgid:this.orgid,
                    carryOver:this.carryOver,
                    uid:this.uid,
                    query:this.showType
                };
                //下载Excel
                this.downloadLoading = true
                this.$axios({
                    method:'get',
                    url:'/PVoucherMst/GetIncomAndExpenditureExcel',
                    params:data
                }) .then(res => {
                    //window.location.href = base.baseURL+"/File/GetExportFile?filePath="+res.path+"&fileName="+res.filename;
                    if(res.Status=="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error' })
                    }else{
                        // window.location.href = base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        /*let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
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
                }).catch(err => {
                    loading.close();
                    console.log(err)
                })
            },

            //刷新
            refresh:function(){
                this.getData();
            },
            //显示打印预览
            showPrintArea:function(){
                this.showPrint=true;
                //获取打印内容，渲染于弹窗
                let print = document.createElement("div");
                print.setAttribute('class','timeSelect');
                print.style.padding='30px 40px 30px 30px';
                //获取页面显示的打印表格的表头
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
                //内容全部放入打印预览
                document.getElementById('printContentArea').appendChild(print);
            },
            //关闭打印预览
            closePrintArea:function(){
                this.showPrint=false;
                document.getElementById('printContentArea').innerHTML='';
            },
            // 打印
            printContent(e){
                let print =document.getElementById('printContentArea');
                this.$print(print) // 使用
            },
            //显示剔除
            dispart:function(val){
                console.log(val);
                let tof=this.showBqList[val];
                this.showBqList={
                    allZero:false,
                    benyueZero:false,
                    bennianZero:false,
                };
                this.showBqList[val]=tof;

                switch (val) {
                    case 'allZero':
                        this.showType=this.showBqList[val]?1:0;
                        break;
                    case 'benyueZero':
                        this.showType=this.showBqList[val]?2:0;
                        break;
                    case 'bennianZero':
                        this.showType=this.showBqList[val]?3:0;
                        break;
                    default: break;
                }

                this.getData();
            },
        }
    }
</script>
<!--<style>
   .reportBox>formData> .el-table>.el-table__body-wrapper>table>tbody>tr>td:nth-of-type(4) .cell{
        text-align: right;
    }
</style>-->
<style scoped>
    .formData_content{
        position: absolute;
        overflow-y: scroll;
        bottom: 0px;
        top: 80px;
        left: 0;
        right: -17px;
    }

    .formData_content>ul:first-child{
        background: transparent;
        margin-top: 0;
    }
    .formData>ul>li{
        border-right:1px solid #fff;
        height:50px;
        line-height:50px;
        text-align: center;
        width:35%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 15px;
    }
    .formData>ul>li:nth-of-type(2){
        width:20%;
    }
    .formData>ul:first-child>li:last-of-type{
        /* border-right:1px solid #2780d1; */
    }

    .formData>ul>li:first-child{
        width:10%;
        min-width: 70px;
        padding:0 2px;
    }
    .formData>ul.formDataItems>li{
        border-right:1px solid #ebeef5;
        border-left:0;
        border-bottom:0;
        text-align: left;
        line-height: 40px;
        height:40px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .formData>ul.formDataItems>li:first-of-type{
        text-align: left;
    }

    .formData>ul.formDataItems>li.bolder{
        font-weight: bold;
    }
    .formData>ul.formDataItems>li.align-center{
        text-indent: 0px !important;
        text-align: center;
    }
    .formData>ul.formDataItems>li.align-right{
        text-align: right;
    }
    .selectContainer>select {
         background-color: transparent;
         line-height: 30px;
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
        top: 5%;
        left: 5%;
        right: 5%;
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
        color: #FFF;
        background: #00B8EE;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(1):hover{
        color: #00B8EE;
        background: #fff;
    }
    .coverContent ul li:nth-of-type(2){
        border: 1px solid #ccc;
        color: #fff;
        background-color: #ccc;

        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(2):hover{
        color: #ccc;
        background-color: #fff;
    }
    /*兼容IE11样式  测试后才可确定是否可用*/
    @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
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
</style>
<style>
    .flexUl .el-input--suffix .el-input__inner{
        line-height: 30px;
    }
</style>
