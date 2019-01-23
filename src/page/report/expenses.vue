<template>
    <div class="timeSelect">
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
                        <div class="block selectContainer" style="margin-left: 20px">
                            <select class="el-input__inner el-button--small" v-model="carryOver" >
                                <option value="0">转结前</option>
                                <option value="1">转结后</option>
                            </select>
                        </div>
                    </li>
                </ul>
                <ul class="flexPublic handle">
                    <a><li style='margin:0 0 0px 10px;' icon="el-icon-lx-down" @click="postBalanceSheetExcel" size="small" plain>导出</li></a>
                    <a><li style='margin:0 0 0px 10px;' icon="el-icon-lx-mail" @click="printContent" size="small" plain>打印</li ></a>

                    <a><li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li></a>
                </ul>
            </div>
                <div class="formData" >
                    <ul>
                        <li>编码</li>
                        <li>名称</li>
                        <li>本月数(元)</li>
                        <li>本年累计数(元)</li>
                    </ul>
                    <div class="formData formData_content" ref="printFrom">
                        <template v-for="item in inMoney">
                            <ul  class="formDataItems flexPublic">
                                <li  :class="{bolder:item.flag}" style="text-indent: 20px">{{item.KCode}}</li>
                                <li :class="{bolder:item.flag,'align-center':item.flag}"  style="text-indent: 50px">{{item.KName}}</li>
                                <li class="align-right">{{item.StartSum}}</li>
                                <li class="align-right">{{item.EndSum}}</li>
                            </ul>
                            <template v-if="item.children.length>0">
                                <ul  class="formDataItems flexPublic" v-for="n in item.children">
                                    <li :class="{bolder:item.flag}" style="text-indent: 35px">{{n.KCode}}</li>
                                    <li :class="{bolder:item.flag,'align-center':item.flag}"  style="text-indent: 50px">{{n.KName}}</li>
                                    <li class="align-right">{{n.StartSum}}</li>
                                    <li class="align-right">{{n.EndSum}}</li>
                                </ul>
                            </template>
                        </template>



                    </div>
                </div>



                <!--<div class="formData" ref="printFrom">
                    <tree-table
                        :isindex="false"
                        :data="inMoney"
                        :expand-all="expandAll"
                        node-key="KCode"
                        :columns="columns"
                        :header-cell-style="{background:'#d3e9f9',color:'#000','text-align':'center'}"
                        v-loading="loading"
                        highlight-current-row
                        :extraheight='extraheight'
                        border>
                    </tree-table>
                </div>-->
            </div>
            <div class="timeSelectBox">
                <time-select-bar @item-click="dateChoose" :showtype="'singleTime'"></time-select-bar>
            </div>
        </div>
       </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
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
    import treeSum from './totalAmount'
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
                        text: "编码",
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
                proofType:'1',
                carryOver:'0',
                date1:[],
                loading:false,
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
            }
        },
        components: { treeTable,TimeSelectBar,saasMsg },
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                uid:state=>state.user.userid,
                user:state=>state.user
            })
        },
        created(){

        },
        mounted(){
            this.getData();
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
            changeData:function(res){
                for(var i in res){
                    res[i].StartSum=this.changeNum(res[i].StartSum);
                    res[i].EndSum=this.changeNum(res[i].EndSum);
                    if(res[i].children!=[]){
                        this.changeData(res[i].children)
                    }
                }
                return res;
            },
            dateChoose:function(val){
                console.log(val);
                this.date1=val;
                this.getData()
            },

            getData:function(){
                let param='';
                if(this.date1.choosedYear==undefined||this.date1.choosedYear==''){
                    let currentYear = new Date();
                    let currentyear=currentYear.getFullYear(currentYear);
                    let currentMonth=currentYear.getMonth()+1;
                    this.date1.choosedYear=currentyear;
                    this.date1.choosedMonth=currentMonth;
                    this.date1.choosedMonthEnd=currentMonth;
                    param=currentyear+'-'+currentMonth;
                }else{
                    param=this.date1.choosedYear+'-'+this.date1.choosedMonth;
                }
                this.loading=true;
                //收入科目的数据
                var data = {
                    accountPeriod: param, //账期
                    isContainUncheck: this.proofType,      //是否包含未审核的凭证(1=包含，0=不包含)
                    orgid:this.orgid,
                    carryOver:this.carryOver
                };
                var vm=this;
                IncomList(vm,data).then(res => {
                    this.loading = false;
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

                    // indata[2].StartSum=12
                    // indata[2].EndSum=21

                    // indata[2].children[0].StartSum=22
                    // indata[2].children[0].EndSum=33

                    var indata_StartSum=Number(0);
                    var indata_EndSum=Number(0);
                    treeSum(indata).forEach(item =>{
                        indata_StartSum +=Number(item.StartSum);
                        indata_EndSum +=Number(item.EndSum)
                    })
                    var outdata=data.filter((value,key,arr) => {
                        //1-资产,2-负债,3-净资产,4-收入,5-支出
                        return value.KType==="5"
                    })

                    var outdata_StartSum=Number(0);
                    var outdata_EndSum=Number(0);
                    //var listArry2=treeSum(outdata);
                    treeSum(outdata).forEach(item =>{
                        outdata_StartSum +=Number(item.StartSum);
                        outdata_EndSum +=Number(item.EndSum)
                    })

                    var newdata=new Array();
                    indata=this.changeData(indata);
                    outdata=this.changeData(outdata);
                    this.inMoney=newdata.concat([{
                        KCode:'一、收入',
                        KName:'',
                        StartSum:'',
                        EndSum:'',
                        children:{},
                        flag:true
                    }],indata,[{
                        KCode:'',
                        KName:'本期合计收入',
                        StartSum:this.changeNum(indata_StartSum),
                        EndSum:this.changeNum(indata_EndSum),
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
                        KName:'本期合计支出',
                        StartSum:this.changeNum(outdata_StartSum),
                        EndSum:this.changeNum(outdata_EndSum),
                        children:{},
                        flag:true
                    }],[{
                        KCode:'三、本期结余',
                        KName:'',
                        StartSum:this.changeNum(indata_StartSum-outdata_StartSum),
                        EndSum:this.changeNum(indata_EndSum-outdata_EndSum),
                        children:{},
                        flag:true
                    }])
                    console.log(this.inMoney);
                }).catch(error =>{
                    console.log(error);
                    this.loading = false;
                    this.saasMessage={
                        message:'收入科目获取错误',
                        delay:3000,
                        visible:true
                    };
                    //this.$message({ showClose: true,  message: '收入科目获取错误',  type: 'error' })
                })

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
                    const tHeader = ['编码', '名称', '本月数', '本年累计数']
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
            //打印
            printContent(){
                //console.log(this.$refs.printFrom);
                let dom=this.$refs.printFrom.cloneNode(true);
                dom.childNodes[0].style.height='inherit';
                dom.childNodes[0].childNodes[2].style.height='inherit';
                dom.childNodes[0].childNodes[2].classList.remove('el-table__body-wrapper');
                dom.childNodes[0].childNodes[1].childNodes[0].setAttribute('style','width:750px');
                dom.childNodes[0].childNodes[2].childNodes[0].setAttribute('style','width:720px');
                console.log(dom.childNodes[0].childNodes[2].childNodes[0]);
                dom.childNodes[0].childNodes[2].childNodes[0].childNodes[0].childNodes[0].width=100;
                let tb=dom.childNodes[0].childNodes[2].childNodes[0].childNodes[0].childNodes;
                console.log(tb);
                for(var i=0;i<tb.length;i++){
                    dom.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[i].width=110;
                    tb[i].width=100;
                }
                let bom = document.body.cloneNode(true);
                bom.innerHTML='';
                bom.appendChild(dom);
                // let bom = document.body.cloneNode(true);
                // bom.innerHTML='';
                // bom.appendChild(dom);
                // console.log(bom);
                //let ht=bom.parentNode.cloneNode(true);
                //this.$print(ht.appendChild(bom)) // 使用
                console.log(bom);
                this.$print(bom);
            },
            postBalanceSheetExcel:function(){
                let base=httpConfig.getAxiosBaseConfig();

                //下载Excel
                this.downloadLoading = true
                this.$axios({
                    method:'get',
                    url:'/PVoucherMst/GetIncomAndExpenditureExcel',
                    params:{
                        accountPeriod:this.date1.choosedYear+'-'+this.date1.choosedMonth,
                        isContainUncheck:this.proofType,
                        orgid:this.orgid,
                        carryOver:this.carryOver
                    }
                }) .then(res => {
                    window.location.href = base.baseURL+"/File/GetExportFile?filePath="+res.path+"&fileName="+res.filename;
                    this.downloadLoading = false;
                }).catch(err => {
                    console.log(err)
                })
            },

            //刷新
            refresh:function(){
                this.getData();
            }
        }
    }
</script>
<!--<style>
   .reportBox>formData> .el-table>.el-table__body-wrapper>table>tbody>tr>td:nth-of-type(4) .cell{
        text-align: right;
    }
</style>-->
<style scoped>
    @media print{
        html,body{
            height: inherit;
        }
        body{
            height: inherit !important;
        }
        #printForm{
            height: inherit !important;
        }
    }
    .unionState>ul>li{
        width:100%;
    }
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
    .formData>ul.formDataItems>li:first-child{
        border-left:1px solid #ebeef5;
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
</style>
